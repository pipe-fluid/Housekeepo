'use strict';

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamps: {
    createdAt: 'creationDate',
    updatedAt: 'updateDate'
  },
  household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household'
  },
  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true
  },
  urgency: {
    type: String,
    enum: ['regular', 'important', 'urgent']
  },
  deadline: {
    type: String
  },
  pictures: [
    {
      type: String
    }
  ],
  price: {
    currency: {
      type: String,
      enum: [
        'EUR',
        'DOL',
        'BRL',
        'CAD',
        'MXN',
        'DKK',
        'RUB',
        'PLN',
        'SEK',
        'CHF',
        'TRY',
        'UAH',
        'GBP',
        'ARS'
      ]
    },
    type: Number
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }
});

module.exports = mongoose.model('Task', taskSchema);
