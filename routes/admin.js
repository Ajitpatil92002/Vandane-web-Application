const express = require("express");
const {
  dasboard_get,
  changeUserRole,
  deleteUsers,
  stats_get,
  stats_post,
  userStatus,
  stats_create,
  contact_get,
  contact_delete,
} = require("../controllers/dashboardContollers");

const {
  addPravachana_get,
  addPravachana_post,
  Pravachana_getAll,
  deletePravachana,
  updatePravachana_get,
  updatePravachana_post,
  fetchRemainingVideos,
} = require("../controllers/pravachanaControllers");

const {
  temple_getAll,
  addTemple_get,
  addTemple_post,
  updateTemple_get,
  updateTemple_post,
  deletetemple,
} = require("../controllers/templeControllers");
const ImageUpload = require("../utils/imgUpload");

const router = express.Router();

router.get("/dashboard", dasboard_get);

router.get("/temples", temple_getAll);

router.get("/addTemple", addTemple_get);

router.post("/addTemple", ImageUpload.single("thumbnail"), addTemple_post);

router.get("/updateTemple/:slug", updateTemple_get);

router.put(
  "/updateTemple/:slug",
  ImageUpload.single("thumbnail"),
  updateTemple_post
);

router.get("/deletetemple/:slug", deletetemple);

router.get("/changeUserRole", changeUserRole);
router.get("/deleteUser", deleteUsers);

router.get("/stats", stats_get);
router.post("/stats/:id", stats_post);
router.get("/StatsCreate", stats_create);

router.get("/userStatus", userStatus);
router.get("/contact", contact_get);
router.get("/contactdelete/:id", contact_delete);

// pravachana
router.get("/addPravachana", addPravachana_get);
router.post(
  "/addPravachana",
  ImageUpload.single("thumbnail"),
  addPravachana_post
);
router.get("/Pravachana", Pravachana_getAll);
router.get("/updatePravachana/:slug", updatePravachana_get);
router.post(
  "/updatePravachana/:slug",
  ImageUpload.single("thumbnail"),
  updatePravachana_post
);
router.get("/deletePravachana/:slug", deletePravachana);
router.get("/fetch-remaining-videos/:pravachanaId", fetchRemainingVideos);

module.exports = router;
