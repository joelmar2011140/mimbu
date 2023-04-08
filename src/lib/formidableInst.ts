import formidable from "formidable";
import { resolve } from "path";

export const formidableInst = formidable({
  uploadDir: resolve('public', 'uploads'),
  keepExtensions: true,
  maxFiles: 1, 
  allowEmptyFiles: false
})