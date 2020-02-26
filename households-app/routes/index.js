'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res) => {
  res.render('index', { title: 'Hello World!' });
  console.log('i am logged in', req.session);
});

router.get('/dashboard/:homeId', routeGuard(true), (req, res) => {
  res.render('dashboard');
});

module.exports = router;
