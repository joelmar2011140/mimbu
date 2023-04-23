import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { login } from "@/services/auth/login.controller";

const handler = nc({
  onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
    console.error('here', err.name);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end("Page is not found");
  },
})
  .post(login)

export default handler;