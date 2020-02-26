'use strict';

const { Router } = require('express');
const routeGuard = require('./../middleware/route-guard');
const router = new Router();
const Home = require('../models/home');
const User = require('../models/user');

module.exports = router;
