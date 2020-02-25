'use strict';

const { Router } = require('express');
const passport = require('passport');
const routeGuard = require('./../middleware/route-guard');
const router = new Router();
//household page
router.get('/', (req, res, next) => {
  res.render('households/households', { title: 'Households Page' });
});
//create household
router.get('/create', (req, res, next) => {
  res.render('households/households-create');
});

router.post(
  '/sign-up',
  passport.authenticate('local-sign-up', {
    successRedirect: '/',
    failureRedirect: '/authentication/sign-up'
  })
);

//edit single household
router.get('/edit', (req, res, next) => {
  res.render('households/households-single-edit');
});

//sign-in & sign-out
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
//route guard
router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

module.exports = router;
