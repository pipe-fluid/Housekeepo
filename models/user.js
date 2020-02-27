'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  passwordHash: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'user']
  },
  githubId: {
    type: String
  },
  githubUsername: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
