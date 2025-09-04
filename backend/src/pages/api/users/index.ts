import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/helper'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || "";

const isValid = async (password: string, token: string) => await bcrypt.compare(password, token);


interface User {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  role: '0' | '1' | '2';
  token: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
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
                return res.status(200).json(rows);
            case "authorize":
                const { username, password } = req.body.credentials;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const row = await pool.query('SELECT token FROM users WHERE email = ?', [username]) as [User[], any];

                const user = row[0][0];

                const token = row.length > 0 ? user.token : null;

                const valid = token ? await isValid(password, token) : false;

                const sessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

                user.token = sessToken;

                return valid ? res.status(200).json({user: user}) : res.end(401);
            case "create":
                const { first_name, last_name, display_name, email, role, isActive } = req.body.user;
                const plainPassword = req.body.user.password;
                const hashedPassword = await bcrypt.hash(plainPassword, 10);

                const [result] = await pool.execute(
                    'INSERT INTO users (id, first_name, last_name, display_name, email, role, token, createdAt, isActive) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)',
                    [randomUUID(), first_name, last_name, display_name, email, role, hashedPassword, isActive]
                );
                res.status(201).json({ id: (result as { insertId: number }).insertId, ...req.body.user, token: undefined });

            default:
                res.status(400).json({ error: 'Invalid request type' });
        }
        } catch (error) {
        res.status(500).json({ error: 'Server error', detail: error instanceof Error ? error.message : "unknown error" });
      }
    }
      
}

export default handler;
