import {
  TextractClient,
  DetectDocumentTextCommand,
} from "@aws-sdk/client-textract";
import fs from "fs";
const region = "ap-southeast-2";
const IMAGE_FILE_PATH = "./fakeSalrySlip.png";
const imageBuffer = Buffer.from(fs.readFileSync(IMAGE_FILE_PATH));
const textractClient = new TextractClient({ region });
async function processImage() {
  try {
    const params = {
      Document: {
        Bytes: imageBuffer,
      },
    };
    const analyzeImage = new DetectDocumentTextCommand(params);
    const response = await textractClient.send(analyzeImage);
    // console.log("response:", JSON.stringify(response, undefined, 2));
    // console.log("response:", response);
    fs.writeFileSync("ocr-salary.json", JSON.stringify(response, undefined, 2));
    return response;
  } catch (error) {
    console.log(error);
  }
}

processImage();
