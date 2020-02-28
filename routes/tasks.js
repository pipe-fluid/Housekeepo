'use strict';

const { Router } = require('express');
const routeGuard = require('./../middleware/route-guard');
const router = new Router();
const Task = require('../models/task');
const Comment = require('../models/comment');
const Home = require('../models/home');

router.get('/', (req, res, next) => {
  res.render('task/tasks', { title: 'Tasks Page' });
});

router.get('/:homeId/create', (req, res, next) => {
  const homeId = req.params.homeId;
  res.render('./task/task-create', { homeId: homeId });
});

router.post('/:homeId/create', routeGuard(true), (req, res, next) => {
  console.log('im posting');
  const homeId = req.params.homeId;
  console.log(homeId);
  const userId = req.user._id;
  const { title, urgency, deadline, currency, amount } = req.body;
  Task.create({
    creator: userId,
    title,
    urgency,
    deadline,
    price: { currency, amount },
    home: homeId
  })
    .then(task => {
      res.redirect(`/home/${homeId}`);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:taskId/comment', routeGuard(true), (req, res, next) => {
  const { taskId } = req.params;

  Task.findOne({
    _id: taskId
  })
    .then(task => {
      if (task) {
        res.render('task/task-comment', { task });
      } else {
        next(new Error('NOT_FOUND'));
      }
    })
    .catch(error => {
      console.log(error);

      next(error);
    });
});

router.post('/:taskId/comment', routeGuard(true), (req, res, next) => {
  const userId = req.user._id;
  const { content } = req.body;
  const { taskId } = req.params;
  Comment.create({
    author: userId,
    content,
    task: taskId
  })
    .then(task => {
      res.redirect(`/tasks/${taskId}`);
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

router.get('/:taskId/edit', (req, res, next) => {
  const { taskId } = req.params;

  Task.findOne({
    _id: taskId
  })
    .then(task => {
      if (task) {
        res.render('task/task-single-edit', { task });
      } else {
        next(new Error('NOT_FOUND'));
      }
    })
    .catch(error => {
      console.log(error);

      next(error);
    });
});

router.post('/:taskId/edit', routeGuard(true), (req, res, next) => {
  const { taskId } = req.params;
  const { title, urgency, deadline, currency, amount } = req.body;

  Task.findOneAndUpdate(
    {
      _id: taskId
    },
    {
      title,
      urgency,
      deadline,
      price: { currency, amount }
    }
  )
    .then(() => {
      res.redirect(`/tasks/${taskId}`);
    })
    .catch(error => {
      console.log(error);

      next(error);
    });
});

router.post('/:taskId/comments/:commentId/delete', routeGuard(true), (req, res, next) => {
  const commentId = req.params.commentId;
  const taskId = req.params.taskId;
  console.log(req.params);
  Comment.findByIdAndDelete({ _id: commentId })
    .then(deleted => {
      console.log('deleted', deleted);
      res.redirect(`/tasks/${taskId}`);
    })
    .catch(error => {
      console.log(error);

      next(error);
    });
});

router.post('/:taskId/delete', routeGuard(true), (req, res, next) => {
  const taskId = req.params.taskId;
  console.log(taskId);
  Task.findByIdAndDelete({ _id: taskId })
    .then(deleted => {
      console.log('deleted', deleted);
      res.redirect(`/home/${deleted.home}`);
    })
    .catch(error => {
      console.log(error);

      next(error);
    });
});

router.get('/:taskId', (req, res, next) => {
  const taskId = req.params.taskId;
  let task;

  Task.findById(taskId)
    .then(taskInfo => {
      task = taskInfo;
      return Comment.find({ task: taskId }).populate('author');
    })
    .then(comments => {
      console.log(comments);
      res.render('task/task-single', { task, comments });
      console.log(task);
    })
    .catch(error => {
      console.log(error);

      next(error);
    });
});

module.exports = router;
