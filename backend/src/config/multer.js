import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure "uploads/customer" folder exists
const customerDir = path.join("uploads", "customer");
if (!fs.existsSync(customerDir)) {
  fs.mkdirSync(customerDir, { recursive: true });
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📂 Saving file to:", customerDir); // Debugging
    cb(null, customerDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + path.extname(file.originalname);

    console.log("📸 Generating filename:", fileName); // Debugging
    cb(null, fileName);
  },
});

// File Filter (Only Images Allowed)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPG, PNG) are allowed!"), false);
  }
};

// Multer Upload Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
});

export default upload;
