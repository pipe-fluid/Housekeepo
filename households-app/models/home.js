'use strict';

const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  members: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {},
  zipcode: {},
  phone: {},
  pictures: {},
  geolocation: {}
});

module.exports = mongoose.model('Home', homeSchema);
