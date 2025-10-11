import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises';
import { IncomingForm } from 'formidable';
import { randomUUID } from 'crypto';
import pool from '@/lib/helper';

export const config = {
	api: {
		bodyParser: false,
	},
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
  	}
	
	const uploadDir = path.join(process.cwd(), '../uploads');

	if (req.method === "POST") {

		try {
			await fs.access(uploadDir);
		} catch {
			await fs.mkdir(uploadDir);
		}

		const form = new IncomingForm({ uploadDir, keepExtensions: true });

		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.statusCode = 500;
				res.end(JSON.stringify({ error: String(err) }));
				return;
			}
			// files.file is your uploaded file (if you appended as 'file')

			const file = Array.isArray(files.file) ? files.file[0] : files.file;
			if (file === undefined) { res.end(500).json({ok: false, error: "No file selected"}); return; }
			const tempPath = file.filepath;
			const newPath = path.join(uploadDir, file?.originalFilename ?? randomUUID());

			try {
				await fs.rename(tempPath, newPath); // Move from temp to final location
				res.status(200).json({ message: 'File uploaded successfully!' });
			} catch (err) {
				res.status(500).json({ error: 'Saving file failed' });
			}
		});
	}

	// {
    //     id: '2',
    //     name: 'server-icon.png',
    //     path: '/server-icon.png',
    //     type: 'file',
    //     size: 4096,
    //     uploadedBy: '1',
    //     uploadedAt: '2024-02-12T14:30:00Z',
    //     sharedWith: ['1', '2'],
    //     syncStatus: 'pending'
    //   }

	if (req.method === "GET") {
		switch (req.body.type) {
			case "list":
				const [listResult] = await pool.query("SELECT * FROM files");

				
				break;
		}

	}
}

async function listFiles(dirPath : string) {
  try {
    const files = await fs.readdir(dirPath);
    return files; 
  } catch (err) {
    console.error('Error listing files:', err);
    return [];
  }
}

export default handler;
