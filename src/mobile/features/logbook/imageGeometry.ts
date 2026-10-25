export type CropRect = { x: number; y: number; width: number; height: number };
export const FULL_CROP: CropRect = { x: 0, y: 0, width: 1, height: 1 };
const finite = (n: number, fallback: number) => (Number.isFinite(n) ? n : fallback);
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export function clampCrop(c: CropRect): CropRect {
  const width = clamp(finite(c.width, 1), 0.001, 1),
    height = clamp(finite(c.height, 1), 0.001, 1);
  return {
    x: clamp(finite(c.x, 0), 0, 1 - width),
    y: clamp(finite(c.y, 0), 0, 1 - height),
    width,
    height,
  };
}
export function pixelCrop(c: CropRect, width: number, height: number): CropRect {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1)
    throw Error('Dimensi gambar tidak valid.');
  const bounded = clampCrop(c);
  const w = clamp(Math.round(bounded.width * width), 1, width),
    h = clamp(Math.round(bounded.height * height), 1, height);
  return {
    x: clamp(Math.round(bounded.x * width), 0, width - w),
    y: clamp(Math.round(bounded.y * height), 0, height - h),
    width: w,
    height: h,
  };
}
export function rotatedSize(width: number, height: number, rotation: number) {
  return Math.abs(rotation % 180) === 90 ? { width: height, height: width } : { width, height };
}
