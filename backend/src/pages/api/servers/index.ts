import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/helper'
import { randomUUID } from 'crypto';


const getServers = async () => {
  const [rows] = await pool.execute('SELECT * FROM servers');
  return rows;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const servers = await getServers();
      res.status(200).json({ ok: true, servers });
    } catch (error) {
      res.status(500).json({ error: 'Server error', detail: error.message });
    }
  } else if (req.method === 'POST') {
    const { name, host, port, status, description } = req.body;

    console.log(req.body);

    try {
      const uuid = randomUUID();

      console.log("Inserting server with ID:", uuid);

      console.group("server insert")
      console.log(uuid, name, host, status, description);
      console.groupEnd();

      const [result] = await pool.query(
        'INSERT INTO servers (id, name, host, status, description, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
        [uuid, name, host + ":" + port, status, description]
      );

      res.status(201).json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: 'DB insert failed', detail: error.message });
    }
  } else {
    res.end(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
