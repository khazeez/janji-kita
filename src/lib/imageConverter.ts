/**
 * Convert image file (PNG/JPG/JPEG) to WebP format
 * @param file - The image file to convert
 * @param quality - Quality of WebP output (0-1), default 0.8
 * @returns Promise<string> - Base64 string of WebP image
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image'));
              return;
            }

            // Convert blob to base64
            const blobReader = new FileReader();
            blobReader.onloadend = () => {
              resolve(blobReader.result as string);
            };
            blobReader.onerror = () => {
              reject(new Error('Failed to read blob'));
            };
            blobReader.readAsDataURL(blob);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Convert image file with resize option
 * @param file - The image file to convert
 * @param maxWidth - Maximum width (optional)
 * @param maxHeight - Maximum height (optional)
 * @param quality - Quality of WebP output (0-1), default 0.8
 * @returns Promise<string> - Base64 string of WebP image
 */
export async function convertToWebPWithResize(
  file: File,
  maxWidth?: number,
  maxHeight?: number,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions if max width/height provided
        if (maxWidth && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (maxHeight && height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas with new dimensions
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Draw resized image on canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image'));
              return;
            }

            // Convert blob to base64
            const blobReader = new FileReader();
            blobReader.onloadend = () => {
              resolve(blobReader.result as string);
            };
            blobReader.onerror = () => {
              reject(new Error('Failed to read blob'));
            };
            blobReader.readAsDataURL(blob);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Batch convert multiple images to WebP
 * @param files - Array of image files
 * @param quality - Quality of WebP output (0-1), default 0.8
 * @returns Promise<string[]> - Array of base64 strings
 */
export async function batchConvertToWebP(
  files: File[],
  quality: number = 0.8
): Promise<string[]> {
  const promises = files.map((file) => convertToWebP(file, quality));
  return Promise.all(promises);
}
