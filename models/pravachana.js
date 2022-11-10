const mongoose = require("mongoose");

const PravachanaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter name"],
    },
    slug: { type: String },
    discription: {
      type: String,
      required: [true, "please enter discription"],
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
    channel_id: [{ type: String }],
  },
  { timestamps: true }
);

const Pravachana = mongoose.model("Pravachana", PravachanaSchema);
module.exports = Pravachana;
