import { FULL_CROP, pixelCrop, rotatedSize, type CropRect } from './imageGeometry';
export async function decodeImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw Error('Dimensi gambar tidak valid.');
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}
/** Decode full-resolution source only; never export until explicit confirmation. */
export async function transformImage(
  file: File,
  crop: CropRect = FULL_CROP,
  rotation = 0,
): Promise<File> {
  if (!Number.isFinite(rotation) || rotation % 90 !== 0) throw Error('Rotasi harus kelipatan 90°.');
  const turn = ((rotation % 360) + 360) % 360;
  const image = await decodeImage(file);
  if (!turn && crop.x === 0 && crop.y === 0 && crop.width === 1 && crop.height === 1) return file;
  const size = rotatedSize(image.naturalWidth, image.naturalHeight, turn);
  const region = pixelCrop(crop, size.width, size.height);
  // Draw the original directly into the final crop canvas: no thumbnail, intermediate re-encoding or resize.
  const canvas = document.createElement('canvas');
  canvas.width = region.width;
  canvas.height = region.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw Error('Canvas tidak tersedia. Gunakan file asli.');
  ctx.translate(-region.x, -region.y);
  ctx.translate(size.width / 2, size.height / 2);
  ctx.rotate((turn * Math.PI) / 180);
  ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
  // Preserve PNG transparency; WebP edits use lossless PNG. JPEG exports once at quality 1, never size-driven.
  const jpeg = file.type === 'image/jpeg' || (!file.type && /\.jpe?g$/i.test(file.name));
  const type = jpeg ? 'image/jpeg' : 'image/png';
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) =>
        b && b.size && b.type === type
          ? resolve(b)
          : reject(Error('Ekspor gambar gagal. File asli tetap tersedia.')),
      type,
      1,
    ),
  );
  return new File(
    [blob],
    `${file.name.replace(/\.[^.]+$/, '') || 'gambar'}.${jpeg ? 'jpg' : 'png'}`,
    { type, lastModified: file.lastModified },
  );
}
