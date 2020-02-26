'use strict';

const { Router } = require('express');
const routeGuard = require('./../middleware/route-guard');
const router = new Router();
const Home = require('../models/home');

router.get('/create', (req, res) => {
  res.render('./home/home-create');
});

router.post('/create', routeGuard(true), (req, res, next) => {
  const userId = req.user._id;
  console.log(req.body);
  const { address, zipcode, phone } = req.body;
  Home.create({
    member: userId,
    address,
    zipcode,
    phone
  })
    .then(home => {
      console.log('should redirect');
      res.redirect(`/dashboard/${home._id}`);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:homeId/edit', (req, res, next) => {
  const { homeId } = req.params;

  Home.findOne({
    _id: homeId
  })
    .then(home => {
      if (home) {
        res.render('home/home-single-edit', { home });
      } else {
        next(new Error('NOT_FOUND'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:homeId/edit', routeGuard(true), (req, res, next) => {
  const { homeId } = req.params;
  const { address, zipcode, phone } = req.body;

  Home.findOneAndUpdate(
    {
      _id: homeId
    },
    {
      address,
      zipcode,
      phone
    }
  )
    .then(() => {
      res.redirect(`/home/${homeId}`);
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:homeId/delete', routeGuard(true), (req, res, next) => {
  Home.deleteOne({ _id: req.params.homeId })
    .then(deleted => {
      console.log('deleted', deleted);
      res.redirect('/dashboard');
    })
    .catch(error => {
      console.log(error);

      next(error);
    });
});

router.get('/:homeId', routeGuard(true), (req, res) => {
  res.render('./home/home-single');
});

module.exports = router;
