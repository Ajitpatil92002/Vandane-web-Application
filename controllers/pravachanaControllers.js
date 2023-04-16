const Pravachana = require("../models/pravachana");
const convertToSlug = require("../utils/slug");
const Cloudinary = require("../utils/cloudinary");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

module.exports.addPravachana_get = async (req, res) => {
  res.render("./adminpages/addPravachana");
};

module.exports.addPravachana_post = async (req, res) => {
  try {
    // set up YouTube API request parameters
    const channelId = req.body.channelId;
    const apiKey = process.env.YT_API_KEY;
    const maxResults = 50; // maximum number of videos per page
    let pageToken; // token for fetching next page of results

    // fetch videos using YouTube API paginated results
    const videos = [];
    do {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            channelId,
            key: apiKey,
            part: "snippet",
            type: "video",
            maxResults,
            pageToken,
          },
        }
      );

      // extract video details from API response
      const videoData = response.data.items.map((item) => ({
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails,
        videoId: item.id.videoId,
      }));

      console.log(response.data.items);
      // add videos to array
      videos.push(...videoData);

      // set token for next page of results
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: "vandane/pravachana",
    });

    // save videos to Pravachana model
    const pravachana = new Pravachana({
      name: req.body.name,
      discription: req.body.discription,
      thumbnail: result.secure_url,
      ytChannelId: req.body.channelId,
      status: req.body.status,
      slug: convertToSlug(req.body.name),
      cloudinary_id: result.public_id,
      videos: videos.map((video) => ({
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        videoId: video.videoId,
      })),
    });

    await pravachana.save();

    // send response with saved Pravachana document
    res.redirect("/admin/Pravachana");
  } catch (error) {
    console.error(error);
    res.status(404).render("./error/404");
  }
};

module.exports.updatePravachana_get = async (req, res) => {
  const pravachana = await Pravachana.findOne({ slug: req.params.slug });
  res.render("./adminpages/editPravachana", pravachana);
};

module.exports.updatePravachana_post = async (req, res) => {
  try {
    const pravachanaId = req.params.id;

    // fetch existing Pravachana document
    const pravachana = await Pravachana.findById(pravachanaId);

    if (!pravachana) {
      res.status(404).render("./error/404");
    }

    // extract updated data from request body
    const { name, slug, description, thumbnail, status } = req.body;

    // upload new thumbnail to Cloudinary if present
    let cloudinaryId = pravachana.cloudinary_id;
    if (thumbnail) {
      await Cloudinary.uploader.destroy(pravachana.cloudinary_id);
      const uploadedImage = await Cloudinary.uploader.upload(thumbnail);
      cloudinaryId = uploadedImage.public_id;
      thumbnail = uploadedImage.secure_url;
    }

    // update Pravachana document with new data
    pravachana.name = name || pravachana.name;
    pravachana.slug = slug || pravachana.slug;
    pravachana.discription = description || pravachana.discription;
    pravachana.thumbnail = thumbnail || pravachana.thumbnail;
    pravachana.status = status || pravachana.status;
    pravachana.cloudinary_id = cloudinaryId || pravachana.cloudinary_id;

    // save updated Pravachana document to MongoDB
    const updatedPravachana = await pravachana.save();

    // send response with updated Pravachana document
    res.redirect("/admin/Pravachana");
  } catch (error) {
    console.error(error);
    res.status(404).render("./error/404");
  }
};

module.exports.deletePravachana = async (req, res) => {
  try {
    const oldPravachans = await Pravachana.findOne({ slug: req.params.slug });
    await Cloudinary.uploader.destroy(oldPravachans.cloudinary_id);
    const pravachana = await Pravachana.findOneAndDelete({
      slug: req.params.slug,
    });
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

module.exports.fetchRemainingVideos = async (req, res) => {
  try {
    const pravachana = await Pravachana.findById(req.params.pravachanaId);
    if (!pravachana) {
      console.log(pravachana);
      res.status(404).render("404");
    }
    const channelId = pravachana.ytChannelId;
    const apiKey = process.env.YT_API_KEY;
    const maxResults = 50; // maximum number of videos per page
    let pageToken;

    const videos = [];
    do {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            channelId,
            key: apiKey,
            part: "snippet",
            type: "video",
            maxResults,
            pageToken,
          },
        }
      );

      // extract video details from API response
      const videoData = response.data.items.map((item) => ({
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails,
        videoId: item.id.videoId,
      }));

      const savedVideoIds = pravachana.videos.map((video) => video.videoId);
      const newVideos = videoData.filter(
        (video) => !savedVideoIds.includes(video.videoId)
      );

      // add new videos to array
      videos.push(...newVideos);

      // set token for next page of results
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    // update Pravachana with new videos
    pravachana.videos.push(
      ...videos.map((video) => ({
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        videoId: video.videoId,
      }))
    );

    await pravachana.save();
    // send response with updated Pravachana document
    res.redirect("/admin/Pravachana");
  } catch (err) {
    res.status(404).render("./error/404");
  }
};
