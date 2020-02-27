'use strict';

const { Router } = require('express');
const routeGuard = require('./../middleware/route-guard');
const router = new Router();
const User = require('../models/user');

const Home = require('../models/home');
const Task = require('../models/task');

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  resource_type: 'raw'
});

const storage = multerStorageCloudinary({
  cloudinary,
  folder: 'Housekeepo Houses',
  resource_type: 'raw'
});

const uploader = multer({ storage });

router.get('/create', (req, res) => {
  res.render('./home/home-create');
});

router.post('/create', routeGuard(true), uploader.single('pictures'), (req, res, next) => {
  const userId = req.user._id;
  const { url } = req.file;
  console.log(url);
  const { address, zipcode, phone, name } = req.body;
  Home.create({
    pictures: url,
    name,
    members: [userId],
    address,
    zipcode,
    phone
  })
    .then(home => {
      console.log('should redirect');
      res.redirect(`/dashboard`);
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
  const { address, zipcode, phone, name, pictures } = req.body;

  Home.findOneAndUpdate(
    {
      _id: homeId
    },
    {
      name,
      address,
      pictures,
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

router.get('/:homeId', routeGuard(true), (req, res, next) => {
  const homeId = req.params.homeId;
  let home;
  Home.findById(homeId)
    .populate('members')
    .then(homeInfo => {
      home = homeInfo;
      return Task.find({ home: homeId });
    })
    .then(tasks => {
      console.log(home);
      res.render('./home/home-single', { home, tasks });
    })
    .catch(error => next(error));
});

router.post('/invite/:homeId', routeGuard(true), (req, res, next) => {
  const homeId = req.params.homeId;
  console.log(req.body, homeId);
  User.find({ email: req.body.email })
    .then(user => {
      Home.findByIdAndUpdate(homeId, { $push: { members: user } }).then(() => {
        res.redirect('/home/' + homeId);
      });
    })
    .catch(error => next(error));
});
module.exports = router;
