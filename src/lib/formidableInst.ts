import formidable from "formidable";
import { join } from "path";

export const formidableInst = formidable({
  uploadDir: join(__dirname, '..', '..', '..', '..', 'public', 'uploads'),
  keepExtensions: true,
  maxFiles: 1, 
  allowEmptyFiles: false
})