const Note = require('../models/Note');
const Task = require('../models/Task');

module.exports = {
  getNotes: async (args, context) => {
    if (!context.user) {
      throw new Error('Authentication required.');
    }
    return Note.find({ userId: context.user.id });
  },
  getTasks: async (args, context) => {
    if (!context.user) {
      throw new Error('Authentication required.');
    }
    console.log('Fetching tasks for user:', context.user.id);
    return Task.find({ userId: context.user.id });
  },
  addNote: async ({ title, content, tags }, context) => {
    if (!context.user) {
      throw new Error('Authentication required.');
    }
    const note = new Note({
      title,
      content,
      tags,
      userId: context.user.id,
    });
    return note.save();
  },
};
