import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config folder se one level back: server/.env
const envPath = path.resolve(__dirname, "../.env");

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ .env file load nahi hui:", result.error.message);
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("Cloudinary ENV check:", {
  envPath,
  cloudNameLoaded: Boolean(cloudName),
  apiKeyLoaded: Boolean(apiKey),
  apiSecretLoaded: Boolean(apiSecret),
});

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Cloudinary environment variables are missing. Check server/.env"
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;