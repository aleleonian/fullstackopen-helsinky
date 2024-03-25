const { test, describe, expect, beforeEach } = require("@playwright/test");
const helper = require("./helper");
const axios = require("axios");
const { exec } = require("child_process");
const exp = require("constants");

const FIRST_USER_FULL_NAME = "Daniela Alzate";
const FIRST_USER_USERNAME = "dalzate";
const FIRST_USER_PASSWORD = "daniela1234";

const SECOND_USER_FULL_NAME = "Alejandro Leonian";
const SECOND_USER_USERNAME = "aleonian";
const SECOND_USER_PASSWORD = "ale1234";

const WRONG_PASSWORD = "fdsfds";

const BLOGPOST_TITLE = "La insoportable levedad del cerdo";
const BLOGPOST_AUTHOR = "Cacho Castañares";
const BLOGPOST_URL = "http://www.geocities.com/cacho/~123";

// i don't know how to make axios respect playwright's baseUrl
const BACKEND = "http://localhost:3003";

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("/");
    await axios.post(BACKEND + "/api/testing/reset");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = await page.getByText("Login to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("Fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill(FIRST_USER_USERNAME);
      await page.getByTestId("password").fill(WRONG_PASSWORD);
      await page.getByRole("button", { name: "login" }).click();
      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(errorDiv).toContainText("Wrong credentials");
      await expect(
        page.getByText("Daniela Alzate is logged in")
      ).not.toBeVisible();
    });

    test("Succeeds with right credentials", async ({ page }) => {
      let result = await axios.post(BACKEND + "/api/users", {
        name: FIRST_USER_FULL_NAME,
        username: FIRST_USER_USERNAME,
        password: FIRST_USER_PASSWORD,
      });
      await helper.loginWith(page, FIRST_USER_USERNAME, FIRST_USER_PASSWORD);
      await expect(page.getByText("Daniela Alzate is logged in")).toBeVisible();
    });
  });

  describe("When logged in...", () => {
    beforeEach(async ({ page }) => {
      await axios.post(BACKEND + "/api/users", {
        name: FIRST_USER_FULL_NAME,
        username: FIRST_USER_USERNAME,
        password: FIRST_USER_PASSWORD,
      });
      await helper.loginWith(page, FIRST_USER_USERNAME, FIRST_USER_PASSWORD);
      await expect(page.getByText("Daniela Alzate is logged in")).toBeVisible();
    });
    test("a new blogpost can be created", async ({ page }) => {
      await helper.createBlogPost(
        page,
        BLOGPOST_TITLE,
        BLOGPOST_AUTHOR,
        BLOGPOST_URL
      );
      await expect(page.getByText(BLOGPOST_TITLE)).toBeVisible();
      await expect(
        page.getByText("Blogpost created succesfully!")
      ).toBeVisible();
    });

    test("A blogpost can be edited (likes incremented)", async ({ page }) => {
      await helper.createBlogPost(
        page,
        BLOGPOST_TITLE,
        BLOGPOST_AUTHOR,
        BLOGPOST_URL
      );
      await expect(
        page.getByText("Blogpost created succesfully!")
      ).toBeVisible();

      await expect(page.getByText(BLOGPOST_TITLE)).toBeVisible();

      // await page.getByTestId("view-hide-button").click();
      await page.getByRole("button", { name: "view" }).click();

      // await expect(page.getByTestId("like-button")).toBeVisible();
      await expect(page.getByText("Cacho Castañares")).toBeVisible();
      await page.getByTestId("like-button").click();
      // await expect(page.getByText("1")).toBeVisible();
      await expect(page.getByText("1 like")).toBeVisible();
    });
    test("A blogpost can be deleted by its author", async ({ page }) => {
      // page.on("dialog", (dialog) => dialog.accept());
      page.on("dialog", async (dialog) => {
        console.log("Dialog message:", dialog.message());
        debugger;
        await dialog.accept(); // Accept the dialog
        // You can also use dialog.dismiss() to dismiss the dialog
      });

      await helper.createBlogPost(
        page,
        BLOGPOST_TITLE,
        BLOGPOST_AUTHOR,
        BLOGPOST_URL
      );
      await expect(
        page.getByText("Blogpost created succesfully!")
      ).toBeVisible();
      await expect(page.getByText(BLOGPOST_TITLE)).toBeVisible();
      await page.getByRole("button", { name: "view" }).click();
      //click on the remove button
      await page.getByTestId("remove-button").click();
      await expect(page.getByText("Blogpost removed allright!")).toBeVisible();
    });
    test("Only the user who added the blog sees the blog's delete button.", async ({
      page,
    }) => {
      //let's create the second user
      await axios.post(BACKEND + "/api/users", {
        name: SECOND_USER_FULL_NAME,
        username: SECOND_USER_USERNAME,
        password: SECOND_USER_PASSWORD,
      });
      //let's create a blogpost authored by the first user
      await helper.createBlogPost(
        page,
        BLOGPOST_TITLE,
        BLOGPOST_AUTHOR,
        BLOGPOST_URL
      );
      await expect(
        page.getByText("Blogpost created succesfully!")
      ).toBeVisible();
      await expect(page.getByText(BLOGPOST_TITLE)).toBeVisible();

      //click on the log out button
      await page.getByRole("button", { name: "log out" }).click();
      const locator = await page.getByText("Login to application");
      await expect(locator).toBeVisible();

      //we now login with the second user and expect to NOT find the remove button
      await helper.loginWith(page, SECOND_USER_USERNAME, SECOND_USER_PASSWORD);
      await expect(
        page.getByText("Alejandro Leonian is logged in")
      ).toBeVisible();

      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByText("Cacho Castañares")).toBeVisible();
      await expect(page.getByText("remove")).not.toBeVisible();
    });
    test("Ensure that the blogs are arranged in the order according to the likes, the blog with the most likes first.", async ({
      page,
    }) => {
      //let's create a blogpost authored by the first user
      await helper.createBlogPost(
        page,
        BLOGPOST_TITLE,
        BLOGPOST_AUTHOR,
        BLOGPOST_URL
      );
      await expect(
        page.getByText("Blogpost created succesfully!")
      ).toBeVisible();
      await expect(page.getByText(BLOGPOST_TITLE)).toBeVisible();
      //let's like 3 times the first blogpost
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByText("Cacho Castañares")).toBeVisible();

      for (let i = 0; i < 3; i++) await page.getByTestId("like-button").click();

      //let's create another blogpost
      await helper.createBlogPost(
        page,
        "Second blogpost title",
        "Adrian Dargelos",
        "www.google.com"
      );
      await expect(
        page.getByText("Blogpost created succesfully!")
      ).toBeVisible();
      await expect(page.getByText("Second blogpost title")).toBeVisible();
      // Select the second div with class "Blog"

      // Select the second div with class "Blog"
      const secondBlogDiv = (await page.$$(".Blog"))[1]; // Index 1 corresponds to the second div

      // Within the second div, find the button with the label 'view' using a more conventional selector
      const viewButton = await secondBlogDiv.$('button:has-text("view")');

      // Within the second div, find the button with the label 'view'
      await viewButton.click();

      //like it 10 times
      const likeButton = await secondBlogDiv.$('button:has-text("like")');
      for (let i = 0; i < 10; i++) await likeButton.click();

      // reload so the most viewed blogpost is on top of the list
      //(maybe i should have done things so i needed not a reload?)
      await page.reload();

      await page.waitForSelector(".Blog");

      const mostLikedBlogpostDiv = (await page.$$(".Blog"))[0];

      const blogpostTitleText = await mostLikedBlogpostDiv.evaluate((div) => {
        const blogpostTitle = div.querySelector("#blogpost-title");
        return blogpostTitle ? blogpostTitle.textContent.trim() : null;
      });

      expect(await blogpostTitleText).toBe("Second blogpost title");
    });
  });
});
