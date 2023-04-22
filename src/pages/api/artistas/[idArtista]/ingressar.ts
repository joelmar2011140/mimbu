import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { ingressarEmEdicaoHttp } from "@/services/artistas/artistas.controller";

const handler = nc({
  onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
    console.error('here', err);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end("Page is not found");
  },
})
  .patch(ingressarEmEdicaoHttp)

export default handler;