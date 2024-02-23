import multer from "multer";
import { s3Storage } from "../config/multerConfig";
import path from "path";
import AppError from "../ultis/appError";

function sanitizeFile(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

  const isAllowedExt = fileExts.includes(
    path.extname(file.originalname.toLowerCase())
  );

  const isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true);
  } else {
    cb(new AppError('File type not allowed!', 400));
  }
}

export const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
      sanitizeFile(file, callback)
  },
  limits: {
    fileSize: 1024 * 1024 * 2
  }
})
