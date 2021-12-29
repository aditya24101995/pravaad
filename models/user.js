const mongoose = require("mongoose");
require("mongoose-type-url");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    imageUrl: {
      profile: { type: mongoose.SchemaTypes.Url},
    },
    firstname: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      trim: true,
      required: true,
    },
    salt: String,
    userlevel: {
      type: Number,
      default: 3,
    },
    roomaccess: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .get(function () {
    return _password;
  })
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  });

userSchema.methods = {
  authenticate: function (plain_password) {
    return this.securePassword(plain_password) === this.encry_password;
  },
  securePassword: function (plain_password) {
    if (!plain_password) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plain_password)
        .digest("hex");
    } catch (error) {}
  },
};
module.exports = mongoose.model("User", userSchema);
