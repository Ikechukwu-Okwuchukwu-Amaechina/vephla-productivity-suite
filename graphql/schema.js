const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Note {
    _id: ID!
    title: String!
    content: String!
    tags: [String]
    createdAt: String
    updatedAt: String
  }

  type Task {
    _id: ID!
    title: String!
    description: String
    completed: Boolean
    dueDate: String
    createdAt: String
    updatedAt: String
  }

  type RootQuery {
    getNotes: [Note!]!
    getTasks: [Task!]!
  }

  type RootMutation {
    addNote(title: String!, content: String!, tags: [String]): Note!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
