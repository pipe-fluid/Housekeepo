'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const bcryptjs = require('bcryptjs');

const passportGithub = require('passport-github');
const PassportGithubStrategy = passportGithub.Strategy;

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  'local-sign-up',
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, callback) => {
      const name = req.body.name;
      bcryptjs
        .hash(password, 10)
        .then(hash => {
          return User.create({
            name,
            email,
            passwordHash: hash
          });
        })
        .then(user => {
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);

passport.use(
  'local-sign-in',
  new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
    let user;
    User.findOne({
      email
    })
      .then(document => {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      })
      .then(passwordMatchesHash => {
        if (passwordMatchesHash) {
          callback(null, user);
        } else {
          callback(new Error('WRONG_PASSWORD'));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

const githubStrategy = new PassportGithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://households-web-app.herokuapp.com/authentication/github-callback',
    scope: 'user:email'
  },
  (accessToken, refreshToken, profile, callback) => {
    console.log(profile);
    const data = {
      name: profile.displayName,
      githubId: profile.id,
      githubUsername: profile.username,
      email: profile.emails.find(object => object.primary).value,
      photo: profile.photos.length ? profile.photos[0].value : undefined,
      location: profile._json.location
    };
    console.log(data);
    User.findOne({
      githubId: data.githubId
    })
      .then(user => {
        if (user) {
          return Promise.resolve(user);
        } else {
          return User.create(data);
        }
      })
      .then(user => {
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  }
);

passport.use('github', githubStrategy);
