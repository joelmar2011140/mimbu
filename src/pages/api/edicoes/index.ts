import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { listarEdicoesHttp, criarEdicaoHttp } from "@/services/edicoes/edicoes.controller";

const handler = nc({
  onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
    console.error('here', err);
    if (err.name === 'ApiError') {
      return res.status(500).end("Something brokdddde!");
    }
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end("Page is not found");
  },
})
  .get(listarEdicoesHttp)
  .post(criarEdicaoHttp)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler;