import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import pool from '@/lib/helper';
import path from 'path';

const uploadDir = path.join(process.cwd(), '../uploads');


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
  	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
  	}
	

	if (req.method === "POST") {

        console.log(req.body)

        if (req.body.type === "post-action") {
            switch (req.body.action) {
                case "create-directory":
                    const name = req.body.name;
                    const path = req.body.path;

                    const uploader = req.body.uploader;

                    await createDirectory(path, name);
                    await pool.query("INSERT INTO files (id, name, path, size, uploader, createdAt) VALUES  (uuid(), ?, ?, -1, ?, now())", [name, path, uploader]);

                    res.status(201).json({ok: true})
                    break;
            }
        }
    }
}


async function createDirectory(dir: string, name: string) {
    const finPath = path.join(dir, name);
    const finPath2 = path.join(uploadDir, finPath);

    try {
        await fs.access(finPath2);
    } catch {
        await fs.mkdir(finPath2);
    }
}

export default handler;