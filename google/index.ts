import fs from "fs";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
// import { validations } from "./validations";
// const filePath = '/path/to/local/pdf';
const projectId = "YOUR_PROJECT_ID";
const location = "us"; // Format is 'us' or 'eu'
const idProcessorId = "YOUR_PROCESSOR_ID"; // ID processor in Cloud Console
const paySlipsProcessorId = "YOUR_PROCESSOR_ID"; // payslip processor in Cloud Console
const IMAGE_FILE_PATH = "./fakeDL.png";
// Identify the sensitive information
const sensitiveData = ["Tax file number"];
enum Classification {
  Identity,
  PaySlips,
}
export async function processDocument(classificationData: any) {
  const result = await getImageData(classificationData);
  console.log("result:", result);
  const { document } = result;
  // Get all of the document text as one big string
  const text = document?.text;

  // run validations
  const flag = true;
  if (!flag) throw Error("Something wrong with image data");

  // Implement redaction logic
  const redactedText = text?.replace(
    new RegExp(sensitiveData.join("|"), "gi"),
    "REDACTED"
  );

  const filename = `${classificationData?.firstname}-${classificationData.type}`;

  // Generate a file with redacted data
  fs.writeFileSync(filename, redactedText!);
}
// sample: https://github.com/googleapis/google-cloud-node/blob/main/packages/google-cloud-documentai/samples/generated/v1/document_processor_service.process_document.js
async function getImageData(classificationData: any) {
  const client = new DocumentProcessorServiceClient();

  const name = `projects/${projectId}/locations/${location}/processors/${
    classificationData.classification === Classification.Identity
      ? idProcessorId
      : paySlipsProcessorId
  }`;
  console.log("name:", name);
  // Read the file into memory.
  // const fs = require("fs").promises;
  const encodedImage = Buffer.from(fs.readFileSync(IMAGE_FILE_PATH));
  // Convert the image data to a Buffer and base64 encode it.
  // const encodedImage = Buffer.from(imageFile).toString("base64");
  console.log(encodedImage);

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
    },
  };

  const [result] = await client.processDocument(request);
  return result;
}

processDocument({ classification: Classification.Identity });
