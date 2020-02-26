'use strict';

const { Router } = require('express');
const routeGuard = require('./../middleware/route-guard');
const router = new Router();
const Task = require('./../models/task');
const Comment = require('./../models/comment');

router.get('/', (req, res, next) => {
  res.render('task/tasks', { title: 'Tasks Page' });
});

router.get('/create', (req, res, next) => {
  res.render('./task/task-create');
});

router.post('/create', routeGuard(true), (req, res, next) => {
  const userId = req.user._id;
  const { title, urgency, deadline, currency, amount } = req.body;
  const { householdId, houseId } = req.params;
  Task.create({
    creator: userId,
    title,
    urgency,
    deadline,
    price: { currency, amount },
    home: houseId,
    household: householdId
  })
    .then(task => {
      res.redirect(`/tasks/${task._id}`);
    })
    .catch(error => {
      console.log(error);

      next(error);
    });
});

router.get('/:taskId/comment', routeGuard(true), (req, res, next) => {
  res.render('task/task-comment');
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
      console.log('i am running', task);
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

router.post('/:taskId/delete', routeGuard(true), (req, res, next) => {
  Task.deleteOne({ _id: req.params.taskId })
    .then(deleted => {
      console.log('deleted', deleted);
      res.redirect('/tasks');
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
    .then(document => {
      if (!document) {
        next(new Error('NOT_FOUND'));
      } else {
        task = document;
        res.render('task/task-single', { task });
        console.log(task);
      }
    })
    .catch(error => {
      console.log(error);

      next(error);
    });
});

module.exports = router;
