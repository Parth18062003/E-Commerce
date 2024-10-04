import React, { useState, useCallback, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateProfileImageUrl } from "@/store/authSlice";
import sha1 from "sha1"; // Import sha1

interface ProfileImageUploadProps {
  defaultImageUrl: string;
  userId: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ defaultImageUrl, userId }) => {
  const [previewUrl, setPreviewUrl] = useState<string>(defaultImageUrl);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>(defaultImageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const dispatch = useDispatch();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

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
        setShowConfirmation(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "HypeHouse_User_Profile");
    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
      return response.data.secure_url;
    } catch (error) {
      throw new Error("Image upload failed.");
    }
  };

  const handleDeleteImage = async (publicId: string) => {
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
    
    // Generate the signature using sha1
    const signature = sha1(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`);
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

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

  const updateProfileImage = async () => {
    if (!newImageUrl) return;

    setIsLoading(true);
    setError(null);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    try {
      const fileInput = document.getElementById("imageUploadInput") as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (!file) return;

      // Upload the new image
      const uploadedImageUrl = await uploadImageToCloudinary(file);
      const publicId = getPublicIdFromUrl(originalImageUrl); // Extract the public ID for deletion

      if (publicId) {
        // Delete the old image from Cloudinary
        await handleDeleteImage(publicId);
      }

      const url = `http://localhost:8081/api/v1/users/upload-profile-image/${userId}`;
      const response = await axios.post(url, { imageUrl: uploadedImageUrl }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Profile image updated:", response.data);
      setPreviewUrl(uploadedImageUrl);
      dispatch(updateProfileImageUrl(uploadedImageUrl));
      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to update profile image on the server:", error);
      setError("Failed to update profile image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel action in the dialog
  const handleCancel = () => {
    setShowConfirmation(false);
    setPreviewUrl(originalImageUrl); // Revert to original image
    setNewImageUrl(null); // Clear new image URL
  };

  return (
    <>
      <div className="relative mb-4">
        <CldImage
          src={previewUrl}
          alt="Profile Picture"
          width={100}
          height={100}
          className="w-24 h-24 rounded-full object-contain border-2 border-zinc-800 dark:border-zinc-200"
        />
        <input
          type="file"
          id="imageUploadInput"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute right-0 bottom-0 hidden" // Keep hidden
        />
        <Button
          onClick={() => document.getElementById("imageUploadInput")?.click()}
          className="absolute right-0 bottom-0 rounded-full p-1"
          size="icon"
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Profile Picture Update</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to update your profile picture?
          </DialogDescription>
          <div className="flex justify-center">
            {newImageUrl && (
              <CldImage
                src={newImageUrl}
                alt="New Profile Picture"
                width={200}
                height={200}
                className="w-36 h-36 rounded-full object-contain border-2 border-zinc-800 dark:border-zinc-200"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={updateProfileImage} disabled={isLoading}>
              {isLoading ? "Updating..." : "Confirm Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileImageUpload;
