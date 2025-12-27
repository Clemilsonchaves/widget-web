interface CompressImageParams {
  file: File;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

function convertToWebp(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return `${filename}.webp`;
  }

  return `${filename.substring(0, lastDotIndex)}.webp`;
}

export function compressImage({
  file,
  maxWidth = Number.POSITIVE_INFINITY,
  maxHeight = Number.POSITIVE_INFINITY,
  quality = 1,
}: CompressImageParams) {
  const allowedFileTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedFileTypes.includes(file.type)) {
    throw new Error("Image format not supported");
  }

  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const compressed = new Image();

      compressed.onload = () => {
        const canvas = document.createElement("canvas");
        const originalWidth = compressed.width;
        const originalHeight = compressed.height;

        // Preserve aspect ratio while fitting within max dimensions
        const widthRatio = maxWidth / originalWidth;
        const heightRatio = maxHeight / originalHeight;
        const ratio = Math.min(1, widthRatio, heightRatio);

        const targetWidth = Math.round(originalWidth * ratio);
        const targetHeight = Math.round(originalHeight * ratio);

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        context.drawImage(compressed, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image."));
              return;
            }

            const compressedFile = new File([blob], convertToWebp(file.name), {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/webp",
          quality
        );
      };

      compressed.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}