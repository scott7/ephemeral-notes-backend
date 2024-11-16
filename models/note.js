const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const { v4: uuidv4 } = require('uuid');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  note_body: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
    unique: false
  },
  createdDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    unique: false
  },
  ttl: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    unique: false
  }
  }, 
  {
  indexes: [
    {
      fields: ['title'],
    },
    {
      fields: ['createdDate'],
    },
  ]
});

sequelize.sync();

module.exports = { Note };