export function isValidImageUrl(url?: string | null): boolean {
  return !!url && /\.(jpe?g|png|webp|avif|gif)$/i.test(url);
}
