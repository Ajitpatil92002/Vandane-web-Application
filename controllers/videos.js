const axios = require("axios");
const dotenv = require("dotenv");
const Pravachana = require("../models/pravachana");

dotenv.config();

module.exports.addVideo = async (req, res) => {
  try {
    // set up YouTube API request parameters
    const channelId = req.params.channelId;
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
            key: process.env.YT_API_KEY,
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
        thumbnail: item.snippet.thumbnails.default.url,
        videoId: item.id.videoId,
      }));

      // add videos to array
      videos.push(...videoData);

      // set token for next page of results
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    // save videos to Pravachana model
    const pravachana = new Pravachana({
      name: "Example Pravachana",
      slug: "example-pravachana",
      description: "Example Pravachana description",
      thumbnail: "https://example.com/thumbnail.jpg",
      status: "published",
      videos: videos.map((video) => ({
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        videoId: video.videoId,
      })),
    });

    await pravachana.save();

    // send response with saved Pravachana document
    res.status(200).json(pravachana);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
