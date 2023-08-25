import { logger } from "firebase-functions/v2";
import { onCall } from "firebase-functions/v2/https";
import { RetrievalQAChain } from "langchain/chains";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GooglePaLM } from "langchain/llms/googlepalm";
import { Chroma } from "langchain/vectorstores/chroma";
import { GooglePaLMEmbeddings } from "langchain/embeddings/googlepalm";
//import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { ChromaClient } from "chromadb";

const { onSchedule } = require("firebase-functions/v2/scheduler");
require('dotenv').config()
console.log(process.env) // remove this after you've confirmed it is working

const firebaseConfig = {
  apiKey: process.env.VITE_APP_APIKEY,
  authDomain: process.env.VITE_APP_AUTHDOMAIN,
  projectId: process.env.VITE_APP_PROJECTID,
  storageBucket: process.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VITE_APP_MESSAGESENDERID,
  appId: process.env.VITE_APP_APPID
};
const app = initializeApp(firebaseConfig);

const storage = getStorage(app, "gs://docability");

const runtimeOpts = {
  minInstances: 1,
  maxInstances: 3,
  memory: '1GiB' as '1GiB',
};

let key = process.env.API_KEY;
let chromaUrl = process.env.CHROMAURL;

const palmembedmodel = new GooglePaLMEmbeddings({
  apiKey: key, 
  modelName: "models/embedding-gecko-001", // OPTIONAL
});

const palmmodel = new GooglePaLM({
  apiKey: key, 
  temperature: 1, // OPTIONAL
  modelName: "models/text-bison-001", // OPTIONAL
});

// const openaiembeddings = new OpenAIEmbeddings({
//   openAIApiKey: key, // In Node.js defaults to process.env.OPENAI_API_KEY
//   maxConcurrency: 3
// });


//param1==unique hash param2==url to pdf param3==query param4==querystring
exports.newPDF = onCall(runtimeOpts, async (request) => {
  let param1 = request.data?.param1;
  let param2 = request.data?.param2;
  let param3 = request.data?.param3;
  let param4 = request.data?.param4;

  logger.log(
    `✅Param 1 =` + param1
  );
  logger.log(
    `✅Param2 =` + param2
  );
  logger.log(
    `✅Param3 =` + param3
  );
  logger.log(
    `✅Param4 =` + param4
  );

  //This is a query as opposed to a new PDF
  if (param3 == "query") {


    // Initialize a retriever wrapper around the vector store
    const chroma = new Chroma(palmembedmodel, { url: chromaUrl, collectionName: param1 });
    // Initialize a retriever wrapper around the vector store
    let vectorStoreRetriever = chroma.asRetriever(3);

    let results = await chroma?.similaritySearchWithScore(param1, 3);

    logger.log(
      `✅Vector Store results =` + JSON.stringify(results)
    );

    const palmchain = RetrievalQAChain.fromLLM(palmmodel, vectorStoreRetriever, {
      returnSourceDocuments: true, // Can also be passed into the constructor
    });

    const palmres = await palmchain.call({
      query: param4,
    });

    logger.log(
      `✅Source Documents used are  =` + JSON.stringify(palmres?.sourceDocuments[0])
    );
    logger.log(
      `✅Source Documents used are  =` + JSON.stringify(palmres?.sourceDocuments[1])
    );
    logger.log(
      `✅Source Documents used are  =` + JSON.stringify(palmres?.sourceDocuments[2])
    );
    logger.log(
      `✅Reponse from PALM  =` + JSON.stringify(palmres?.text)
    );
    return palmres?.text;
  } else {
    logger.log(
      `✅This is a save pdf request=` + param2
    );
    const response = await fetch(param2);
    if (!response.ok) {
      logger.error(
        `🔥🔥🔥Unable to get PDF`
      );
      throw new Error('Network response was not ok');
    }
    const blob = await response.blob();
    const loader = new PDFLoader(blob, {
      splitPages: true,
      pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js"),
    });
    const docs = await loader.load();
    logger.log(
      `✅This is a save pdf request docs.length=` + docs.length
    );
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 5000,
      chunkOverlap: 300,
    });


    const splitdocOutput = await splitter.splitDocuments(docs);

    const modifiedOutput = splitdocOutput.map((doc, index) => {
      const newText = `  --UNIQUE HASH ID IS -- ` + param1;
      return { ...doc, pageContent: doc.pageContent.replace(/\n/g, " ") + newText };
    });

    const chroma = new Chroma(palmembedmodel, { url: chromaUrl, collectionName: param1 });
    let result = await chroma.addDocuments(modifiedOutput);

    return "Save Completed " + result.length
  }
  return;
});


exports.accountcleanup = onSchedule("every hour", async (event: any) => {

  const client = new ChromaClient({ path: chromaUrl });
  const collections = await client.listCollections();
  logger.log(
    `✅Collection length=` + collections.length
  );

  const currentDate = new Date();
  const threeDaysAgo = new Date(currentDate);
  threeDaysAgo.setDate(currentDate.getDate() - 3);


  for (const item of collections) {

    logger.log(
      `✅ Item name = ` + item.name
    );
    // Split the string by hyphen
    const parts = item.name.split('-');

    // Extract valid date components
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);

    // Create the Date object
    const date = new Date(year, month - 1, day);

    if (date < threeDaysAgo) {
      logger.log(
        `✅ The parsed date is older than 3 days. `
      );
      await client.deleteCollection({ name: item.name })

      const deleteref = ref(storage, item.name);

      // Delete the file
      deleteObject(deleteref).then(() => {

        logger.log(
          `✅ file item deleted. ` + item.name
        );
      }).catch((error) => {
        logger.error(
          `🔥🔥🔥Error deleting item`
        );
      });
      logger.log("✅  User cleanup finished");


    } else {
      //do nothing
      logger.log(
        `✅ The parsed date is not older than 3 days.. `
      );
    }
  }
});