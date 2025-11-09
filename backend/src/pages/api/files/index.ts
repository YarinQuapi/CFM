import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises';
import { IncomingForm } from 'formidable';
import { randomUUID } from 'crypto';
import pool from '@/lib/helper';
import { RowDataPacket } from 'mysql2';

export const config = {
	api: {
		bodyParser: false,
	},
};


const uploadDir = path.join(process.cwd(), '../uploads');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
  	}
	

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

			const file = Array.isArray(files.file) ? files.file[0] : files.file;
			if (file === undefined) { res.end(500).json({ok: false, error: "No file selected"}); return; }
            
            const dir: string = Array.isArray(fields.path) ? fields.path[0] : fields.path ?? "/";

			const tempPath = file.filepath;
            const directory = path.join(uploadDir, dir);
			const newPath = path.join(directory, file?.originalFilename ?? randomUUID());
			const size = file.size;



			// console.log(files);

			await pool.query("INSERT INTO files (id, name, path, size, uploader, createdAt) VALUES (uuid(), ?, ?, ?, ?, now())", [file?.originalFilename, fields.path, size, fields.userId]);

			try {
				await fs.rename(tempPath, newPath); // Move from temp to final location
				res.status(200).json({ message: 'File uploaded successfully!' });
			} catch (err) {
				res.status(500).json({ error: err });
			}


		});
	}

	interface FileProps extends RowDataPacket {
		id: string;
		name: string;
		path: string;
		uploader: string;
        size: number;
        sharedWith: [];
        syncStatus: string;
		createdAt: string;
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
		const [listResult] = await pool.query<FileProps[]>("SELECT * FROM files;");
		
        // console.log("yes " + listResult)

		const retArr: FileProps[] = [];

		for (const result of listResult) {
			const {id, name, path, uploader, size, createdAt} = result;

            const type = size == -1 ? "directory" : "file";

            if (size == 0) {}

			retArr.push({id: id, name: name, path: path, type: type, size: size, uploader: uploader, createdAt: createdAt, sharedWith: [], syncStatus: 'pending'} as FileProps)
		}

		// console.dir(retArr, {depth: 10})

		res.status(200).json({ ok: true, files: retArr})
	}
}


// async function listFiles(dirPath : string) {
//   try {
//     const files = await fs.readdir(path.join(uploadDir, dirPath));
//     return files;
//   } catch (err) {
//     console.error('Error listing files:', err);
//     return [];
//   }
// }

export default handler;
