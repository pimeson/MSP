'use strict'
const db = require('./_db');
module.exports = db;

const User = require('./models/user');
const Exhibit = require('./models/exhibit');
const Project = require('./models/project');

Project.hasMany(Exhibit);
Exhibit.belongsTo(Project);