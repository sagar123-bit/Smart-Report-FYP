

export const uploadChatFile = async (req, res) => {
  try {

    const authUser = req.user;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const fileUrl = `${authUser?.userId}/chat-files/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl,
    });

  } catch (error) {
    console.error("Error uploading chat file:", error);

    if (error.message.includes("Only image files and PDF documents")) {
      return res.status(400).json({
        success: false,
        message: "Only image files (PNG, JPG, JPEG, GIF, WEBP) and PDF are allowed",
      });
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message,
    });
  }
};

export default uploadChatFile;
