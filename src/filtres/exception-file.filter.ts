import { ALLOWED_FILE_EXTENSIONS } from "../modules/certificates/certificates.constants";

export function fileFilter(req: any, file: any, cb: any) {
  try {
    const ext = file.mimetype.split('/')[1];
    const isAllowedFileExt = isAllowedFileExtension(ext);
    if (!isAllowedFileExt) {
      return cb(new Error('Extension file not allowed'), false);
    }

    return cb(null, true);
  } catch (e) {
    return cb(new Error('Transmitted image is not supported'), false);
  }
}

function isAllowedFileExtension(extension: string): boolean {
  return ALLOWED_FILE_EXTENSIONS.includes(extension);
}
