const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 64,
      trim: true,
    },
    users: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room',roomSchema)