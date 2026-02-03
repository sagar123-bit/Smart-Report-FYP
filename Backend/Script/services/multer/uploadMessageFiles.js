import multer from "multer";
import path from "path";
import fs from "fs";

const checkMessageFile = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files and PDF documents are allowed in chat"),
      false
    );
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.user;

    const folderPath = `./Script/uploads/${user?.userId}/chat-files`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, path.resolve(folderPath));
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadMessageFile = multer({
  storage,
  fileFilter: checkMessageFile,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadMessageFile;
