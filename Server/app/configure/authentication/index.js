'use strict'

const path = require('path');
const session = require('express-session');
var passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const ENABLED_AUTH_STRATEGIES = ['local'];

module.exports = (app, db) => {

  const dbStore = new SequelizeStore({
    db
  });

  let User = db.model('user');

  dbStore.sync();

  app.use(session({
    secret: app.getValue('env').SESSION_SECRET,
    store: dbStore,
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then( user => done(null, user) )
      .catch(done);
  })

  app.get('/session', (req, res, next) => {

    let err;
    
    if(req.user) {
      res.send({ user: req.user.sanitize() });
    } else {
      err = new Error('No authentificated user.')
      err.status = 401;
      next(err);
    }
  })

  app.get('/logout', (req, res) => {
    req.logout();
    res.status(200).end();
  })

  ENABLED_AUTH_STRATEGIES.forEach( (strategyName => {
    require(path.join(__dirname, strategyName))(app, db);
  }))

}