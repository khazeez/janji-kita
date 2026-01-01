/**
 * Convert image file (PNG/JPG/JPEG) to WebP format with compression
 * @param file - The image file to convert
 * @param quality - Quality of WebP output (0-1), default 0.8
 * @param maxWidth - Maximum width for compression, default 1920
 * @param maxHeight - Maximum height for compression, default 1080
 * @returns Promise<string> - Base64 string of WebP image
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > height) {
            width = Math.min(width, maxWidth);
            height = width / aspectRatio;
          } else {
            height = Math.min(height, maxHeight);
            width = height * aspectRatio;
          }
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas with compression
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

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
 * Convert image file with custom resize option
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

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

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
 * Batch convert multiple images to WebP with compression
 * @param files - Array of image files
 * @param quality - Quality of WebP output (0-1), default 0.8
 * @param maxWidth - Maximum width for compression, default 1920
 * @param maxHeight - Maximum height for compression, default 1080
 * @returns Promise<string[]> - Array of base64 strings
 */
export async function batchConvertToWebP(
  files: File[],
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<string[]> {
  const promises = files.map((file) =>
    convertToWebP(file, quality, maxWidth, maxHeight)
  );
  return Promise.all(promises);
}

/**
 * Compress image aggressively for thumbnails
 * @param file - The image file to convert
 * @param maxWidth - Maximum width, default 400
 * @param maxHeight - Maximum height, default 400
 * @param quality - Quality of WebP output (0-1), default 0.6
 * @returns Promise<string> - Base64 string of compressed WebP image
 */
export async function compressImageToThumbnail(
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 400,
  quality: number = 0.6
): Promise<string> {
  return convertToWebP(file, quality, maxWidth, maxHeight);
}

/**
 * Get file size information before and after compression
 * @param originalFile - Original file
 * @param compressedBase64 - Compressed base64 string
 * @returns Object with size info and compression ratio
 */
export function getCompressionInfo(
  originalFile: File,
  compressedBase64: string
): {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  savedBytes: number;
  savedPercentage: number;
} {
  const originalSize = originalFile.size;

  // Calculate compressed size from base64
  // Remove data:image/webp;base64, prefix
  const base64String = compressedBase64.split(',')[1];
  const compressedSize = Math.ceil((base64String.length * 3) / 4);

  const savedBytes = originalSize - compressedSize;
  const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(2);
  const compressionRatio = (originalSize / compressedSize).toFixed(2);

  return {
    originalSize,
    compressedSize,
    compressionRatio: parseFloat(compressionRatio),
    savedBytes,
    savedPercentage: parseFloat(savedPercentage),
  };
}

/**
 * Format bytes to human readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places, default 2
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
