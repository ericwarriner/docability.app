

## Overview

**docability.app** is designed to streamline document review using AI. This project is experimental and features a **Retrieval-Augmented Generation (RAG)** implementation that enhances search and retrieval capabilities by combining traditional query methods with advanced generative AI.

---


## 🖼️ Application Preview

Below is a preview of the application user interface.

![Application Preview](https://github.com/ericwarriner/docability.app/image.JPG


---

## 🚀 Live Demo

Check it out here:  ![Docability](https://docability.app)

---

## Features

- **AI-Powered Document Review:** Harness AI to enable swift and accurate document analysis.
- **Experimental RAG Implementation:** Combines retrieval methods and generative techniques to deliver improved review results.
- **Firebase Deployment:** Seamless deployment on Firebase with ease.

---

## ⚙️ Environment Variables

This project requires environment variables to deploy on [Firebase](https://firebase.google.com/). You must supply your own credentials. Here are some example variables:

```
VITE_APP_APIKEY=YOUR_VALUE_HERE
VITE_APP_AUTHDOMAIN=YOUR_VALUE_HERE
VITE_APP_PROJECTID=YOUR_VALUE_HERE
VITE_APP_STORAGEBUCKET=YOUR_VALUE_HERE
VITE_APP_APPID=YOUR_VALUE_HERE
VITE_APP_MEASUREMENTID=YOUR_VALUE_HERE
VITE_APP_MESSAGESENDERID=YOUR_VALUE_HERE
API_KEY=YOUR_VALUE_HERE
CHROMAURL=YOUR_VALUE_HERE
```
## 📦 Prerequisites

Ensure you deploy a [ChromaDB](https://github.com/chroma-core/chroma) instance to fully support the document retrieval features.

---

## Build & Deployment

### Build the Project

Before deploying, build the project using:

```bash
npm run build
```

### Firebase Deployment

Deploy the functions and hosting via Firebase:

```bash
firebase deploy --only functions
firebase deploy --only hosting
```

Alternatively, deploy both with:

```bash
firebase deploy
```

### View Functions Log

Monitor your functions with:

```bash
firebase functions:log
```

---

## Running Locally

To run and preview the project locally, use the following commands:

```bash
vite          # For development
vite build    # To build the project
vite preview  # To preview the build locally
```

---

## Package Updates

Keep your packages updated with:

```bash
npm-check-update
npm install
```
---

## 🙌 Contributing

Contributions are welcome!  
If you'd like to contribute, please fork the repo and submit a pull request. For major changes, open an issue first to discuss your ideas.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---










