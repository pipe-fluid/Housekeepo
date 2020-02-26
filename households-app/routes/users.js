'use strict';

const { Router } = require('express');
const passport = require('passport');
const routeGuard = require('./../middleware/route-guard');
const router = new Router();

router.get('/', (req, res, next) => {
  res.render('users/users', { title: 'Users Page' });
});

router.get('/create', (req, res, next) => {
  res.render('users/user-create');
});

router.post(
  '/sign-up',
  passport.authenticate('local-sign-up', {
    successRedirect: '/dashboard',
    failureRedirect: '/authentication/sign-up'
  })
);

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post(
  '/sign-in',
  passport.authenticate('local-sign-in', {
    successRedirect: '/dashboard',
    failureRedirect: '/authentication/sign-in'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.get('/:userId/dashboard', routeGuard(true), (req, res, next) => {
  res.render('dashboard');
});

module.exports = router;
