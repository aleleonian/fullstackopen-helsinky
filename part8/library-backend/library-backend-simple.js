require('dotenv').config();
const { startStandaloneServer } = require('@apollo/server/standalone')
const { ApolloServer } = require('@apollo/server');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI;
console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })


const Author = require('./models/author');
const Book = require('./models/book');
const User = require("./models/user");

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/


/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `

    type User {
    username: String!
    favoriteGenre: String!
    id: ID!
    }

    type Token {
    value: String!
    }

    type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
    }
    
    type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
    id: ID!
    }

  type Query {
   bookCount: Int!
   authorCount: Int!
   allBooks(author:String, genre:String): [Book]!
   allAuthors:[Author]
   me: User
  }

  type Mutation {
  addBook(
    title: String!
    published: Int!
    author: String!
    genres: [String]!
  ): Book,

  editAuthor(
  name: String! 
  setBornTo: Int!
  ): Author

  createUser(
    username: String!
    favoriteGenre: String!
  ): User

login(
    username: String!
    password: String!
): Token
}
`

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allAuthors: async (root, args) => {
            console.log("querying allAuthors!");
            return await Author.find({})
        },
        allBooks: async (root, args) => {
            console.log("querying allBooks!");
            const bookList = await Book.find({});
            if (!args.author && !args.genre) {
                console.log("No args.author or args.genre");
                return bookList;
            }
            let filteredBooks = [...bookList];
            if (args.author) filteredBooks = filteredBooks.filter(book => book.author === args.author);
            if (args.genre) filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre));
            return filteredBooks;
        },
        // me: (root, args, context) => {
        //     return context.currentUser
        // }
    },
    Author: {
        bookCount: async (root) => {
            let count = 0;
            const books = await Book.find({});
            count = books.reduce(
                (accumulator, currentBook) => {
                    if (currentBook.author === root.name) accumulator += 1;
                    return accumulator;
                }, 0);
            return count
        }
    },
    Mutation: {
        addBook: async (root, args) => {
            console.log("args->", args);
            const authors = await Author.find({});
            if (!authors.find(author => author.name === args.author)) {
                const newAuthor = new Author({ name: args.author });
                newAuthor.save();
            }
            const newBook = new Book({ ...args });
            return newBook.save();
        },

        editAuthor: async (root, args) => {
            const chosenAuthor = await Author.findOne({ name: args.name });
            if (!chosenAuthor) {
                return null;
            }
            //change date
            chosenAuthor.born = args.setBornTo;
            return chosenAuthor.save();
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    })
                })
        },
        // login: async (root, args) => {
        //     const user = await User.findOne({ username: args.username })

        //     if (!user || args.password !== 'secret') {
        //         throw new GraphQLError('wrong credentials', {
        //             extensions: {
        //                 code: 'BAD_USER_INPUT'
        //             }
        //         })
        //     }

        //     const userForToken = {
        //         username: user.username,
        //         id: user._id,
        //     }

        //     console.log("userForToken->", userForToken);
        //     console.log("JWT Secret in login:", process.env.JWT_SECRET);
        //     const signed = jwt.sign(userForToken, process.env.JWT_SECRET);
        //     console.log("signed->", signed);
        //     return { value: signed }
        // },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})