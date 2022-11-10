const mongoose = require("mongoose");

const TempleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please enter title"],
    },
    slug: { type: String, unique: true },
    description: {
      type: String,
      required: [true, "please enter description"],
    },
    content: {
      type: String,
      required: [true, "please enter content"],
      trim:true
    },
    thumbnail: {
      type: String,
      required: [true, "please submit thumbnail"],
    },
    status: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
  },
  { timestamps: true }
);

const Temple = mongoose.model("temples", TempleSchema);
module.exports = Temple;
