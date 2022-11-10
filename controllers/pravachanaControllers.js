const Pravachana = require("../models/pravachana");
const convertToSlug = require("../utils/slug");
const Cloudinary = require("../utils/cloudinary");

module.exports.addPravachana_get = async (req, res) => {
  res.render("./adminpages/addPravachana");
};

module.exports.addPravachana_post = async (req, res) => {
  try {
    const result = await Cloudinary.uploader.upload(req.file.path,{folder:"vandane/pravachana"});
    const pravachana = await new Pravachana({
      name: req.body.name,
      discription: req.body.discription,
      thumbnail: result.secure_url,
      status: req.body.status,
      slug: convertToSlug(req.body.name),
      cloudinary_id: result.public_id,
    });
    await pravachana.save();
    res.redirect("/admin/Pravachana");
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};


module.exports.updatePravachana_get = async (req, res) => {
  const pravachana = await Pravachana.findOne({ slug: req.params.slug });
  res.render("./adminpages/editPravachana", pravachana);
};

module.exports.updatePravachana_post = async (req, res) => {
  try {
    const oldTemple = await Pravachana.findOne({ slug: req.params.slug });
    await Cloudinary.uploader.destroy(oldTemple.cloudinary_id);
    const result = await Cloudinary.uploader.upload(req.file.path);
    const temple = await Pravachana.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $set: {
          name: req.body.name,
          discription: req.body.discription,
          thumbnail: result.secure_url,
          status: req.body.status,
          slug: convertToSlug(req.body.name),
          cloudinary_id: result.public_id,
        },
      }
    );
    res.redirect("/admin/Pravachana");
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};

module.exports.deletePravachana = async (req, res) => {
  try {
    const oldPravachans = await Pravachana.findOne({ slug: req.params.slug });
    await Cloudinary.uploader.destroy(oldPravachans.cloudinary_id);
    const pravachana = await Pravachana.findOneAndDelete({ slug: req.params.slug });
    res.redirect("/admin/Pravachana");
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};

module.exports.Pravachana_getAll = async (req, res) => {
  try {
    const Pravachanas = await Pravachana.find().sort({
      updatedAt: "desc",
    });
    res.render("./adminpages/allPravachanas", { Pravachanas });
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};

module.exports.Pravachana_getOne = async (req, res) => {
  try {
    const temple = await Pravachana.findById(req.params.id);
    const latestTemple = await Pravachana.find().limit(5);
    res.json({ temple, latestTemple });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};
