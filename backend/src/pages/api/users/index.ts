import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/helper'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import handleError from '@/lib/errorhandler';

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

  // console.log(req);
  switch (req.method) {

    case 'GET':
        const [rows] = await pool.execute('SELECT id, displayName, firstName, lastName, email, role, createdAt, lastLogin, isActive FROM users');
        return res.status(200).json({ ok: true, users: rows });
    case 'POST':
      try {
        switch (req.body.type) {
            case "authorize":

            // console.group("Authorize Request");
            //     console.log(req);
            // console.group("Authorize Request");

                const { username, password } = req.body.credentials;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const row = await pool.query('SELECT * FROM users WHERE email = ?', username) as [User[], []];

                console.log(row);
                const user = row[0][0];
                console.log(user);

                if (!user) return res.end(401).json({ error: 'Username or password incorrec' });
                const token = user.token;

                const valid = token ? await isValid(password, token) : false;

                const sessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

                user.token = sessToken;

                return valid ? res.status(200).json({user: user, token: sessToken}) : res.end(401);
            case "create":
              console.log(req.body);

                const { firstName, lastName, displayName, email, role } = req.body.user;
                const plainPassword = req.body.user.password;
                const hashedPassword = await bcrypt.hash(plainPassword, 10);

                const [result] = await pool.execute(
                    'INSERT INTO users (id, firstName, lastName, displayName, email, role, token, createdAt, lastLogin, isActive) VALUES (uuid(), ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)',
                    [firstName, lastName, displayName, email, role, hashedPassword]
                );
                res.status(201).json({ id: (result as { insertId: number }).insertId, ...req.body.user, token: undefined });
                break;
            case "update":
                const { id, firstName: uFirstName, lastName: uLastName, displayName: uDisplayName, email: uEmail, role: uRole, isActive } = req.body.user;

                if (!id) {
                  res.status(400).json({ error: 'Missing user ID for update' });
                  return;
                }
                const [updateResult] = await pool.execute(
                    'UPDATE users SET firstName = ?, lastName = ?, displayName = ?, email = ?, role = ?, isActive = ? WHERE id = ?',
                    [uFirstName, uLastName, uDisplayName, uEmail, uRole, isActive ? 1 : 0, id]
                );

                res.status(200).json({ ok: true });
                break;
            default:
                res.status(400).json({ error: 'Invalid request type' });
        }
        } catch (error) {
        res.status(500).json({ error: 'Server error', detail: handleError(error)});
      }
    }
      
}

export default handler;