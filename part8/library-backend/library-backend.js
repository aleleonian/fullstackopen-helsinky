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
        allAuthors: async (root, args, context) => {
            console.log("context->", context);
            if (!context.currentUser) {
                throw new Error('You must be logged in to use allAuthors');
            }
            return await Author.find({})
        },
        allBooks: async (root, args) => {
            const bookList = await Book.find({});
            if (!args.author && !args.genre) return bookList;
            let filteredBooks = [...bookList];
            if (args.author) filteredBooks = filteredBooks.filter(book => book.author === args.author);
            if (args.genre) filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre));
        },
        me: (root, args, context) => {
            return context.currentUser
        }
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
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            console.log("userForToken->", userForToken);
            console.log("JWT Secret in login:", process.env.JWT_SECRET);
            const signed = jwt.sign(userForToken, process.env.JWT_SECRET);
            console.log("signed->", signed);
            return { value: signed }
        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
            console.log("auth->", auth)
            try {
                const token = auth.substring(7);
                const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
                const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
                const currentUser = await User.findById(verifiedToken.id);
                console.log("currentUser->", currentUser);
                return { currentUser };
            } catch (error) {
                console.log("error.name", error.name);
                console.log("error.message", error.message);

                throw new GraphQLError('Invalid/Expired token', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        error
                    }
                });
            }
        }
        else {
            console.log("auth does not start with 'Bearer '->", auth)
        }
        return { currentUser: null }; // Return null if no token is provided
    }

}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})