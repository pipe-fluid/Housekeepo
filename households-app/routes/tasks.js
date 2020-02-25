'use strict';

const { Router } = require('express');
const passport = require('passport');
const routeGuard = require('./../middleware/route-guard');
const router = new Router();

router.get('/', (req, res, next) => {
  res.render('./task/tasks', { title: 'Tasks Page' });
});

router.get('/create', (req, res, next) => {
  res.render('./task/task-create');
});

router.post(
  '/sign-up',
  passport.authenticate('local-sign-up', {
    successRedirect: '/',
    failureRedirect: '/authentication/sign-up'
  })
);

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post(
  '/sign-in',
  passport.authenticate('local-sign-in', {
    successRedirect: '/',
    failureRedirect: '/authentication/sign-in'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;

('use strict');

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

module.exports = router;
