'use strict';

const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  name: {
    type: String
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  address: {
    type: String,
    required: true
  },
  zipcode: {
    type: String
  },
  phone: {
    type: Number
  }
  // pictures: [
  //   {
  //     type: String
  //   }
  // ]
  // geolocation: {
  //   lat: Number,
  //   lng: Number
  // }
});

module.exports = mongoose.model('Home', homeSchema);
