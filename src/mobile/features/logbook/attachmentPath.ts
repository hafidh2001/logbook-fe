/** Validate transport syntax only; backend checks tenant, content and actual file. */
export function isServerAttachmentPath(path: string): boolean {
  return /^_file\/[A-Za-z0-9.%_()/-]+$/.test(path) && path.split('/').every(segment => {
    try {
      const decoded = decodeURIComponent(segment);
      return !!decoded && decoded !== '.' && decoded !== '..' &&
        !decoded.includes('/') && !decoded.includes('\\') && !decoded.includes('%') &&
        [...decoded].every(character => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127);
    } catch { return false; }
  });
}
