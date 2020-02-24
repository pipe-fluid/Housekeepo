'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
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
    enum: ['admin', 'user'],
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
