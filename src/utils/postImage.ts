import axios from "axios";

export const postImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("key", "1c611875f6706fbb73909bc6c876e775"); // ImgBB API key
  formData.append("image", file); // Binary file for upload

  try {
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const result = response.data;
    if (result.success && result.data?.url) {
      return result.data.url; // Return the direct image URL
    } else {
      throw new Error(result.error?.message || "Failed to upload image");
    }
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
