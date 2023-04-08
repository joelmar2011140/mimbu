import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { listarUmaNoticiaHttp, atualizarNoticiaHttp, eliminarUmaNoticiaHttp } from "@/services/noticias/noticias.controller";

const handler = nc({
  onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
    console.error('here', err);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end("Page is not found");
  },
})
  .get(listarUmaNoticiaHttp)
  .patch(atualizarNoticiaHttp)
  .delete(eliminarUmaNoticiaHttp)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler;