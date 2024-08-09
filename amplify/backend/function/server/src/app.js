const express = require("express");
const multer = require("multer");
const app = express();
const upload = multer();
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const serverless = require("serverless-http");

/** Define constants and configure TL API endpoints */
const TWELVE_LABS_API_KEY = process.env.TWELVE_LABS_API_KEY;
const API_BASE_URL =
  process.env.API_BASE_URL || "https://api.twelvelabs.io/v1.2";

/** Set up middleware for Express */
const corsOptions = {
  origin:
    process.env.CORS_ORIGIN || "https://main.d2a7uk4042n8z4.amplifyapp.com",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/** Define error handling middleware */
const errorLogger = (error, request, response, next) => {
  console.error(error);
  next(error);
};

const errorHandler = (error, request, response, next) => {
  return response
    .status(error.status || 500)
    .json(error || "Something Went Wrong...");
};

app.use(errorLogger, errorHandler);

process.on("uncaughtException", function (exception) {
  console.log(exception);
});

/** Define your routes */
/** Get videos */
app.get("/indexes/:indexId/videos", async (request, response, next) => {
  const params = {
    page_limit: request.query.page_limit,
  };

  try {
    const options = {
      method: "GET",
      url: `${API_BASE_URL}/indexes/${request.params.indexId}/videos`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TWELVE_LABS_API_KEY,
      },
      data: { params },
    };
    const apiResponse = await axios.request(options);
    response.json(apiResponse.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Error Getting Videos";
    return next({ status, message });
  }
});

/** Get a video of an index */
app.get(
  "/indexes/:indexId/videos/:videoId",
  async (request, response, next) => {
    const indexId = request.params.indexId;
    const videoId = request.params.videoId;

    try {
      const options = {
        method: "GET",
        url: `${API_BASE_URL}/indexes/${indexId}/videos/${videoId}`,
        headers: { ...HEADERS },
      };
      const apiResponse = await axios.request(options);
      response.json(apiResponse.data);
    } catch (error) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Error Getting a Video";
      return next({ status, message });
    }
  }
);

/** Generate open-ended text of a video */
app.post("/videos/:videoId/generate", async (request, response, next) => {
  const videoId = request.params.videoId;
  let prompt = request.body.data;
  try {
    const options = {
      method: "POST",
      url: `${API_BASE_URL}/generate`,
      headers: { ...HEADERS, accept: "application/json" },
      data: { ...prompt, video_id: videoId, temperature: 0.3 },
    };
    const apiResponse = await axios.request(options);
    response.json(apiResponse.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Error Generating Text";
    return next({ status, message });
  }
});

/** Index a video and return a task ID */
app.post(
  "/index",
  upload.single("video_file"),
  async (request, response, next) => {
    const formData = new FormData();

    // Append data from request.body
    Object.entries(request.body).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const blob = new Blob([request.file.buffer], {
      type: request.file.mimetype,
    });

    formData.append("video_file", blob, request.file.originalname);

    const options = {
      method: "POST",
      url: `${API_BASE_URL}/tasks`,
      headers: {
        "x-api-key": TWELVE_LABS_API_KEY,
        accept: "application/json",
        "Content-Type":
          "multipart/form-data; boundary=---011000010111000001101001",
      },
      data: formData,
    };
    try {
      const apiResponse = await axios.request(options);
      response.json(apiResponse.data);
    } catch (error) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Error indexing a Video";
      return next({ status, message });
    }
  }
);

/** Check the status of a specific indexing task */
app.get("/tasks/:taskId", async (request, response, next) => {
  const taskId = request.params.taskId;

  try {
    const options = {
      method: "GET",
      url: `${API_BASE_URL}/tasks/${taskId}`,
      headers: { ...HEADERS },
    };
    const apiResponse = await axios.request(options);
    response.json(apiResponse.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Error getting a task";
    return next({ status, message });
  }
});

/** Summarize a video */
app.post("/videos/:videoId/summarize", async (request, response, next) => {
  const videoId = request.params.videoId;
  let type = request.body.data;

  try {
    const options = {
      method: "POST",
      url: `${API_BASE_URL}/summarize`,
      headers: { ...HEADERS, accept: "application/json" },
      data: { ...type, video_id: videoId },
    };
    const apiResponse = await axios.request(options);
    response.json(apiResponse.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Error Summarizing a Video";
    return next({ status, message });
  }
});

/** Generate gist of a video */
app.post("/videos/:videoId/gist", async (request, response, next) => {
  const videoId = request.params.videoId;
  let types = request.body.data;
  try {
    const options = {
      method: "POST",
      url: `${API_BASE_URL}/gist`,
      headers: { ...HEADERS, accept: "application/json" },
      data: { ...types, video_id: videoId },
    };
    const apiResponse = await axios.request(options);
    response.json(apiResponse.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Error Generating Gist of a Video";
    return next({ status, message });
  }
});

module.exports.handler = serverless(app);
