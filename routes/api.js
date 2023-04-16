const express = require("express");
const Pravachana = require("../models/pravachana");
const router = express.Router();

router.get("/pravachans", async (req, res) => {
  try {
    const pravachans = await Pravachana.find({
      status: "Save and Publish",
    }).sort({ updatedAt: "desc" }).select({videos:0});
    res.json(pravachans);
  } catch (err) {
    res.status(404).json("not found");
  }
});

router.get("/pravachans/:slug", async (req, res) => {
  try {
    const pravachan = await Pravachana.findOne({ slug: req.params.slug }).sort({
      updatedAt: "desc",
    })

    res.json(pravachan);
  } catch (err) {
    res.status(404).json("not found");
  }
});

router.get("/pravachans/:slug/videos/:videoId", async (req, res) => {
  try {
    const { slug, videoId } = req.params;

    // fetch Pravachana document by ID
    const pravachana = await Pravachana.findOne({ slug });

    if (!pravachana) {
      return res.status(404).json({ error: "Pravachana not found" });
    }

    // find video in Pravachana document by ID
    const video = pravachana.videos.find(
      (v) => v.videoId.toString() === videoId
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // send response with video data
    res.json(video);
  } catch (err) {
    res.status(404).json("not found");
  }
});

module.exports = router;
