import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/helper'
import bcrypt from 'bcryptjs';

const isValid = async (password: string, token: string) => await bcrypt.compare(password, token);

interface User {
    token: string;
}

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

  switch (req.method) {
    case 'GET':
      try {
        switch (req.body.type) {
            case "list":
                const [rows] = await pool.execute('SELECT id, username, email, role, createdAt, lastLogin, isActive FROM users');
                res.status(200).json(rows);
                break;
            case "authorize":
                const { email } = req.body.user;

                const [ row ]= await pool.execute('SELECT token FROM users WHERE email = ?', [email]) as [User[], any];

                const token = row.length > 0 ? row[0].token : null;

                const valid = token ? await isValid(req.body.password, token) : false;

                valid ? res.end(200) : res.end(401);
                break;

            default:
                res.status(400).json({ error: 'Invalid request type' });
        }
        } catch (error) {
        res.status(500).json({ error: 'Server error', detail: error.message });
      }
    }
      
}

export default handler;
