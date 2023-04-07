import { IErro, ISucesso } from '@/global.types'
import { formidableInst } from '@/lib/formidableInst'
import { unlink, unlinkSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

export async function registarArtistaHttp(req: NextApiRequest, res: NextApiResponse<ISucesso | IErro>): Promise<any> {
  formidableInst.parse(req, (err: any, fields: any, files: any) => {
    try {
      console.log(err, fields, files)
      // restringir para à imagem
      if (files.imagem == null) {
        Object.values(files).forEach((file: any) => {
          unlink(file.filepath, (err) => {
            if (err) console.error(err);
          });
        });
        return res.status(400).json({
          status: 400,
          message: 'Forneça por favor uma imagem'
        })
      } if (!['image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
        'image/tiff',
        'image/svg+xml'].includes(files.imagem.mimetype)) {
          unlink(files.imagem.filepath, (err) => {
            if (err) console.error(err);
          });
          return res.status(400).json({
            status: 400,
            message: 'Forneça por favor uma imagem válida'
          })
      }
      
    } catch (err: any) {
      console.error(err)
    }
  })
}