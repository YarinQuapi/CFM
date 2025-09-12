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
      res.status(500).json({ error: 'Server error', detail: error  .message });
    }
  } else if (req.method === 'POST') {
    const { type, server } = req.body;
    const { name, host, port, status, description } = server;

    try {
      switch (type) {
        case "create":
          const uuid = randomUUID();

          const [result] = await pool.query(
            'INSERT INTO servers (id, name, host, status, description, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
          [uuid, name, host + ":" + port, status, description]);

          res.status(201).json({ ok: true });
          break;

        case "update":
          if (!server.id) {
            res.status(400).json({ error: 'Missing server ID for update' });
            return;
          }

          const [updateResult] = await pool.query(
            'UPDATE servers SET name = ?, host = ?, status = ?, description = ? WHERE id = ?',
            [name, host + ":" + port, status, description, server.id]
          );

          res.status(200).json({ ok: true });
          break;

        case "delete":
          if (!server.id) {
            res.status(400).json({ error: 'Missing server ID for delete' });
            return;
          }
          const [deleteResult] = await pool.query(
            'DELETE FROM servers WHERE id = ?',
            [server.id]
          );

          res.status(200).json({ ok: true });
          break;
          
        default:
          res.status(400).json({ error: 'Invalid type' });
      }

    } catch (error) {
      res.status(500).json({ error: 'DB insert failed', detail: error.message });
    }
  } else {
    res.end(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
