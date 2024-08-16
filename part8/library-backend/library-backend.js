require('dotenv').config();
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI
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


const typeDefs = `

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
}
`
async function allAuthors() {
    const authors = await Author.find({});
    console.log("Author.find->", authors);
}
async function allBooks() {
    const books = await Book.find({})
    console.log("Books.find->", books);
}

// allAuthors();
// allBooks();

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allAuthors: async (root) => await Author.find({}),
        allBooks: async (root, args) => {
            const bookList = await Book.find({});
            if (!args.author && !args.genre) return bookList;
            let filteredBooks = [...bookList];
            if (args.author) filteredBooks = filteredBooks.filter(book => book.author === args.author);
            if (args.genre) filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre));
            return filteredBooks
        },
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
        }
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