const express = require("express");
const Temple = require("../models/Temple");
const AppStats = require("../models/App");
const Pravachana = require("../models/pravachana");
const { contact_post } = require("../controllers/contactController");

const router = express.Router();

router.get("/", async (req, res) => {
  let appStats = await AppStats.find();
  appStats = appStats[0];
  const Temples = await Temple.find({ status: "Save and Publish" }).sort({
    updatedAt: "desc",
  });
  const pravachans = await Pravachana.find({ status: "Save and Publish" })
    .sort({ updatedAt: "desc" })
    .limit(4);
  res.render("./pages/home", { appStats, Temples, pravachans });
});

router.get("/temples", async (req, res) => {
  const Temples = await Temple.find({ status: "Save and Publish" }).sort({
    updatedAt: "desc",
  });
  res.render("./pages/temple", { Temples });
});

router.get("/pravachans", async (req, res) => {
  const pravachans = await Pravachana.find({ status: "Save and Publish" }).sort(
    { updatedAt: "desc" }
  );

  res.render("./pages/pravachan", { pravachans });
});

router.get("/pravachans/:slug", async (req, res) => {
  const { videos } = await Pravachana.findOne({ slug: req.params.slug })
    .sort({ updatedAt: "desc" })
    .select({ videos: 1 });

  res.render("./pages/pravachanaPage", { pravachans: videos, slug: req.params.slug });
});

// fetch particular video from Pravachana document
router.get("/pravachans/:slug/videos/:videoId", async (req, res) => {
  try {
    const { slug, videoId } = req.params;

    // fetch Pravachana document by ID
    const pravachana = await Pravachana.findOne({ slug });

    if (!pravachana) {
      return res.status(404).json({ error: "Pravachana not found" });
    }

    // find video in Pravachana document by ID
    const video = pravachana.videos.find((v) => v.videoId.toString() === videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // send response with video data
    res.render("./pages/Video", { video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/team", async (req, res) => {
  res.render("./pages/team");
});

router.get("/about", async (req, res) => {
  res.render("./pages/about");
});

router.get("/templecontent/:slug", async (req, res) => {
  const slug = req.params.slug;
  const temple = await Temple.findOne({ slug });
  const latestTemple = await Temple.find().limit(5);
  res.render("./pages/templepage", { temple, latestTemple });
});

router.post("/contact", contact_post);

module.exports = router;
