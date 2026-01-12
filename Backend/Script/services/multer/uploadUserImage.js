import multer from "multer";
import path from "path";
import fs from "fs";

const checkImage = (req, file, cb) => {
  const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.user;
    const folderPath = `./Script/uploads/${user?.userId}/user-image`;

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

const uploadUserImage = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: checkImage,
});

export default uploadUserImage;
