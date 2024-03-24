const { test, describe, expect, beforeEach } = require("@playwright/test");
const helper = require("./helper");
const axios = require("axios");

const FULL_NAME = "Daniela Alzate";
const USERNAME = "dalzate";
const PASSWORD = "daniela1234";
const WRONG_PASSWORD = "daniela1234";

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

  // test.only("just a post", async ({ page }) => {
  //   let result = await axios.post(BACKEND + "/api/testing/reset");
  //   console.log("result->", result);
  //   await page.goto("/");
  //   console.log("ciulo");
  // });

  describe("Login", () => {
    test("Fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill(USERNAME);
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
        name: FULL_NAME,
        username: USERNAME,
        password: PASSWORD,
      });
      await helper.loginWith(page, USERNAME, PASSWORD);
      await expect(page.getByText("Daniela Alzate is logged in")).toBeVisible();
    });
  });

  describe("When logged in...", () => {
    beforeEach(async ({ page }) => {
      let result = await axios.post(BACKEND + "/api/users", {
        name: FULL_NAME,
        username: USERNAME,
        password: PASSWORD,
      });
      await helper.loginWith(page, USERNAME, PASSWORD);
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

    test.only("a blogpost can be edited (likes incremented)", async ({
      page,
    }) => {
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

      await page.pause();
      // await page.getByTestId("view-hide-button").click();
      await page.getByRole("button", { name: "view" }).click();

      // await expect(page.getByTestId("like-button")).toBeVisible();
      await expect(page.getByText("Cacho Castañares")).toBeVisible();
      await page.getByTestId("like-button").click();
      // await expect(page.getByText("1")).toBeVisible();
      await expect(page.getByText("1 like")).toBeVisible();
    });
  });
});
