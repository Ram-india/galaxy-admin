import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

import * as authApi from "../../services/authService";
import UserAvatar from "../team/UserAvatar";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

/** Avatar with a hover overlay that opens the file picker and uploads. */
const AvatarUploader = ({ user, onUploaded, onError }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Local preview so the new photo appears before Cloudinary responds
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please choose an image file.");
      return;
    }

    if (file.size > MAX_BYTES) {
      onError("That image is larger than 2 MB. Please choose a smaller one.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const res = await authApi.updateAvatar(file);
      onUploaded(res.data.admin);
    } catch (err) {
      onError(err?.response?.data?.message || "Could not upload that photo.");
      setPreviewUrl("");
    } finally {
      setIsUploading(false);
      // Reset so re-picking the same file still fires a change event
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <UserAvatar
          name={user?.name}
          src={previewUrl || user?.avatar}
          size="lg"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-label="Change profile photo"
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white transition-colors hover:bg-blue-700 disabled:opacity-60 dark:ring-slate-900"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          Profile photo
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          JPG, PNG or GIF. Maximum 2 MB.
        </p>
      </div>
    </div>
  );
};

export default AvatarUploader;
