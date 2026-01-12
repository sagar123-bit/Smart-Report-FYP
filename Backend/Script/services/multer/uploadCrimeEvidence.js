import multer from "multer";
import path from "path";
import fs from "fs";


const checkEvidence = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "video/mp4",
    "video/quicktime",
    "audio/mpeg",
    "audio/mp3",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, videos, audio, and PDF allowed."), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.user;
    const folderPath = `./Script/uploads/${user?.userId}/crime-evidence`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, path.resolve(folderPath));
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadCrimeEvidence = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: checkEvidence,
});

export default uploadCrimeEvidence;
