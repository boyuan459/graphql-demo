const graphql = require('graphql')
const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLSchema, 
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt } = graphql
const _ = require('lodash')
const Author = require('../models/author')
const Book = require('../models/book')

//dummy data
var books = [
  { name: 'Test 1', genre: 'Fantasy', id: '1', authorId: '1'},
  { name: 'Test 2', genre: 'Fantasy', id: '2', authorId: '2'},
  { name: 'Test 3', genre: 'Sci-Fi', id: '3', authorId: '3'},
  { name: 'Test 4', genre: 'Fantasy', id: '1', authorId: '1'},
  { name: 'Test 5', genre: 'Fantasy', id: '2', authorId: '2'},
  { name: 'Test 6', genre: 'Sci-Fi', id: '3', authorId: '3'},
]

var authors = [
  { name: 'Name 1', age: 12, id: '1'},
  { name: 'Name 2', age: 44, id: '2'},
  { name: 'Name 3', age: 33, id: '3'},
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // return _.find(authors, { id: parent.authorId })
        return Author.findById(parent.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return _.filter(books, {authorId: parent.id})
        return Book.find({authorId: parent.id})
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        //code to get data from db/other source
        // return _.find(books, { id: args.id })
        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        //code to get data from db/other source
        // return _.find(authors, { id: args.id })
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books
        return Book.find({})
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors
        return Author.find({})
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        })
        return author.save()
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        })
        return book.save()
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})