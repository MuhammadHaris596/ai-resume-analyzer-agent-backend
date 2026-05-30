import multer from "multer";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

// Wraps multer so multer errors surface as proper Express errors
const uploadResume = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "File too large. Maximum size is 5 MB"
          : err.message;
      res.status(400);
      return next(new Error(message));
    }

    // fileFilter rejection or unexpected error
    res.status(400);
    next(err);
  });
};

export default uploadResume;
