import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/helper";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    console.log(req.body);

    switch (req.body.type) {
      case "share-file":
        const { fileId, serverId, userId } = req.body;

        await pool.query(
          "INSERT INTO fileAccess (id, file, server, authorizer, createdAt) VALUES (uuid(), ?, ?, ?, now())",
          [fileId, serverId, userId]
        );

        res.status(201).json({ ok: true });
        break;
    }
  }
};

export default handler;
