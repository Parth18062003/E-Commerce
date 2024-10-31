import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import sha1 from "sha1";
import { set } from "zod";

interface ImageUploadProps {
  defaultImageUrl: string;
  onImageUpdate: (newUrl: string) => void;
  onCancel: () => void;
}

const ProductImageUpdate: React.FC<ImageUploadProps> = ({
  defaultImageUrl,
  onImageUpdate,
  onCancel,
}) => {
  const [originalImageUrl, setOriginalImageUrl] = useState<string>(defaultImageUrl);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cloudname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  // Store original image URL on mount
  useEffect(() => {
    setOriginalImageUrl(defaultImageUrl);
  }, [defaultImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "HypeHouse_Products");

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, formData);
      setUploaded(true);
      return response.data.secure_url;
    } catch (error) {
      setUploaded(false);
      throw new Error("Image upload failed.");
    }
  };

  const handleDeleteImage = async (publicId: string) => {
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    const signature = sha1(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`);
    const url = `https://api.cloudinary.com/v1_1/${cloudname}/image/destroy`;

    try {
      await axios.post(url, {
        public_id: publicId,
        signature: signature,
        api_key: apiKey,
        timestamp: timestamp,
      });
      console.log("Old image deleted successfully.");
    } catch (error) {
      console.error("Failed to delete old image from Cloudinary:", error);
    }
  };

  const getPublicIdFromUrl = (url: string) => {
    const regex = /\/upload\/v\d+\/(.*)\.\w{3,4}$/;
    const match = url.match(regex);
    return match ? match[1] : null; // Returns the public ID or null if not found
  };

  const handleImageUpdate = async () => {
    if (!newImageUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const fileInput = document.getElementById("imageUploadInput") as HTMLInputElement | null;
      if (!fileInput || !fileInput.files) return;

      const file = fileInput.files[0];
      if (!file) return;

      // Upload the new image
      const uploadedImageUrl = await uploadImageToCloudinary(file);
      const publicId = getPublicIdFromUrl(originalImageUrl); // Extract the public ID for deletion

      if (publicId) {
        // Delete the old image from Cloudinary
        await handleDeleteImage(publicId);
      }

      // Update the parent component with the new image URL
      onImageUpdate(uploadedImageUrl);
      setPreviewUrl(uploadedImageUrl);
      
    } catch (error) {
      console.error("Failed to update profile image on the server:", error);
      setError("Failed to update profile image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-gray-500">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="rounded-lg w-full h-auto" />
        ) : (
          <p>Upload an image</p>
        )}
      </div>
      <Input
        id="imageUploadInput" // Ensure the ID is set
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-end space-x-3">
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleImageUpdate}  disabled={isLoading || uploaded}>
          {isLoading && !uploaded? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default ProductImageUpdate;
