'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Task = require('../models/Task');
const Home = require('../models/Home');

router.get('/', (req, res) => {
  res.render('index', { title: 'Housekeepo!' });
  console.log('i am logged in', req.session);
});

router.get('/dashboard/', routeGuard(true), (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  Home.find({ members: userId })
    .then(homes => {
      res.render('dashboard', { homes });
    })
    .catch(error => next(error));
});

module.exports = router;
