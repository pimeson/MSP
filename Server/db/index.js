'use strict'

const db = require('./_db');
module.exports = db;

const User = require('./models/user');
const Exhibit = require('./models/exhibit');
const Project = require('./models/project');
const AltView = require('./models/altView');
const download = require('./models/download');


Exhibit.belongsTo(Project, {
  foreignKeyConstraint: true,
  onDelete: 'cascade',
  hooks: true
});
Project.hasMany(Exhibit, {
  onDelete: 'cascade',
  hooks: true
})
Exhibit.hasMany(AltView, {
  onDelete: 'cascade',
  hooks: true
});
AltView.belongsTo(Exhibit, {
  foreignKeyConstraint: true,
  hooks: true
});
Project.hasMany(AltView, {
  onDelete: 'cascade',
  hooks: true
});
AltView.belongsTo(Project, {
  foreignKeyConstraint: true,
  hooks: true
});