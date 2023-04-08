import formidable from "formidable";
import { resolve } from "path";

export const formidableInst = formidable({
  uploadDir: resolve('public', 'uploads', 'capasEdicoes'),
  keepExtensions: true,
  maxFiles: 1, 
  allowEmptyFiles: false
})

export const formidableInstArtista = formidable({
  uploadDir: resolve('public', 'uploads', 'imagensArtistas'),
  keepExtensions: true,
  maxFiles: 1, 
  allowEmptyFiles: false
})

export const formidableInstNoticias = formidable({
  uploadDir: resolve('public', 'uploads', 'imagensNoticias'),
  keepExtensions: true,
  maxFiles: 1, 
  allowEmptyFiles: false
})