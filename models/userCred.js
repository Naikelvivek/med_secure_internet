const mongoose = require('mongoose');

const UserCredSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('UserCred', UserCredSchema);
