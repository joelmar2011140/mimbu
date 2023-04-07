import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { listarUmaEdicaoHttp, atualizarEdicaoHttp, eliminarUmaEdicaoHttp } from "@/services/edicoes/edicoes.controller";

const handler = nc({
  onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
    console.error('here', err);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end("Page is not found");
  },
})
  .get(listarUmaEdicaoHttp)
  .patch(atualizarEdicaoHttp)
  .delete(eliminarUmaEdicaoHttp)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler;