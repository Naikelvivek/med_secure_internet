const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Staff', StaffSchema);
