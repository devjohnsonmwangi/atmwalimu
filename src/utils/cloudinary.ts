// Centralized Cloudinary config and upload helper
// NOTE: These values are intentionally hard-coded per project request.
export const CLOUDINARY_CLOUD_NAME = 'dw4hohfsr';
export const CLOUDINARY_UPLOAD_PRESET = 'johnson';

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed');
  }
  return data.secure_url;
}
