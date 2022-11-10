const mongoose = require("mongoose");

const AppSchema = new mongoose.Schema({
  downloads: {
    type: String,
    default: ""
  },
  users: {
    type: String,
    default: ""
  },
  Pravachans: {
    type: String,
    default: ""
  },
  Temples: {
    type: String,
    default: ""
  },
});

const AppStats = mongoose.model("AppStats", AppSchema);

module.exports = AppStats;
