import axios, { CanceledError } from "axios";

type UploadFileToStorageParams = {
  file: File;
  onProgress: (sizeInBytes: number) => void;
};

type UploadFileToStorageConfig = {
  signal?: AbortSignal;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_UPLOAD_ENDPOINT =
  import.meta.env.VITE_UPLOAD_ENDPOINT || "/uploads";
const API_UPLOAD_FIELD = import.meta.env.VITE_UPLOAD_FIELD || "file";

export async function uploadFileToStorage(
  { file, onProgress }: UploadFileToStorageParams,
  config?: UploadFileToStorageConfig
): Promise<{ url: string }> {
  const formData = new FormData();
  // Field name can vary across backends; make it configurable
  formData.append(API_UPLOAD_FIELD, file);

  try {
    const response = await axios.post(
      `${API_URL}${API_UPLOAD_ENDPOINT}`,
      formData,
      {
        signal: config?.signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const uploadedBytes = Math.min(
              progressEvent.loaded,
              progressEvent.total
            );
            onProgress(uploadedBytes);
          }
        },
      }
    );

    return {
      url: response.data.url,
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new CanceledError("Upload canceled");
    }
    throw error;
  }
}