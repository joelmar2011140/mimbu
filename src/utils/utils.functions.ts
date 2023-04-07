import { unlink } from 'fs'
import ApiError from './APIError'

export function deleteFile(filePath: string): void {
  unlink(filePath, function (err) {
    if (err) {
      console.error(err)
    }
    console.log('Temp File Delete')
  })
}

export function verificarImagem(mimetype: string, path: string) {
  if (!['image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/tiff',
    'image/svg+xml'].includes(mimetype)) {
    deleteFile(path)
    throw new ApiError('APIERROR', 'Forneça por favor uma imagem válida', 422)
  }
}