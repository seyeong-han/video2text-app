<a id="readme-top"></a>

# Summarize your video with Pegasus V1's understanding tools!

## 👋 Introduction

I have developed a video understanding web page that leverages image APIs to generate textual content from videos. The platform allows users to create titles, topics, hashtags, summaries, chapters, and open-ended texts based on video content. This tool enhances video analysis by providing diverse text generation options, improving accessibility, and enabling more efficient content creation.

### Built With

- [Twelve Labs API](https://docs.twelvelabs.io/docs)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [React Query](https://tanstack.com/query/latest)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🔑 Getting Started

### Step 1. Generate Twelve Labs API Key

Visit [Twelve Labs Playground](https://playground.twelvelabs.io/) to generate your API Key

- Upon signing up, you'll receive free credits to index up to 10 hours of video content!

### Step 2 (Option 1). Start the App on Replit

1. Click the button below

   [![Run on Replit](https://replit.com/badge/github/mrnkim/generate-social-posts)](https://replit.com/new/github/mrnkim/generate-social-posts)

2. Add Secrets (equivalent to .env), which is located in the Tools pane

   ```
   REACT_APP_API_KEY=<YOUR API KEY>
   REACT_APP_INDEX_ID=<YOUR INDEX ID>
   ```

3. Run the Repl

### Step 2 (Option 2). Start the App Locally

1. Clone the current repo

   ```sh
   git clone git@github.com:seyeong-han/video2text-app.git
   ```

2. Create `.env` file in the root directory and provide the values for each key

   ```
    REACT_APP_API_KEY=<YOUR_API_KEY>
    REACT_APP_INDEX_ID=<YOUR_INDEX_ID>
    REACT_APP_SERVER_URL=<YOUR_SERVER_URL> //e.g., http://localhost
    REACT_APP_PORT_NUMBER=<YOUR_PORT_NUMBER> //e.g., 4001
   ```

3. Start the server

   ```sh
   node server.js
   ```

4. Install and start the client

   ```sh
   npm install
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📌 How did I build this project?

### Starting from Sample Apps

[Sample applications](https://docs.twelvelabs.io/docs/sample-applications)  
I wanted to deploy generate text (topics, titles, hashtags, summaries, chapters, highlights, and open-ended descriptions) features on my project by using Pegasus-1 model. I could start from scratch, but I always want to leverage open-source benefits by starting from other's base. Therefore, I can focus more on its features, stability and UI/UX. It can seem like a lack of creativity, but I believe integrating required features from various repositories is also a competent and creative way to build a new project.  
I could get example codes from each project and integrate them into my project. Here are the functions I used in each project.

- [Summarize YouTube Videos](https://docs.twelvelabs.io/docs/sample-apps-summarize-youtube-videos)
  - API for generating summaries, chapters, and highlights
- [Generate titles, topics, and hashtags](https://docs.twelvelabs.io/docs/sample-apps-generate-titles-topics-and-hashtags)
  - API for generating titles, topics, and hashtags
- [Generate social media posts for your videos](https://docs.twelvelabs.io/docs/generate-social-media-posts-for-your-videos)
  - API for enerating open-ended descriptions
  - Video uploading function

### API Implementation

[Generate text from video](https://docs.twelvelabs.io/docs/generate-text-from-video)  
Thankfully, TwelveLabs have already provided concise documentations with API playground!  
It was really easy to follow all the steps and their UI was intuitive.

### Challenges

- Starting from AWS Amplify project initialization
  AWS provides a full-stack development tool, [Amplify](https://docs.amplify.aws/). I already deployed a strong application using Amplify in my [AI startup, Resia](https://resia.design), so I am familiar with this platform. I started from their project initialization, but I got this error while using `twelvelabs-js`.

  ```
  ReferenceError: process is not defined at new TwelveLabs
  ```

  I found Amplify Gen2 was using `Vite` build tool, which provides faster startup times and hot module replacement. But `twelvelabs-js` was reading `REACT_APP_API_KEY` using `process.env.REACT_APP_API_KEY` internally. I knew that I could access the `.env` variables using `VITE` prefix, but I couldn't handle the inside of `twelvelabs-js` codes. Consequently, I gave up Amplify starting project.

- First programming using TypeScript
  While I have extensive experience with React-JS development, this was my first time working with TypeScript. As a result, I spent more time than anticipated figuring out the correct types. Most of the provided examples were implemented in JavaScript, so converting all of them took the longest. However, I believe the input and output stability gained by specifying types is well worth the effort. The process made me appreciate the added value that TypeScript brings to development.
