import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import pool from '@/lib/helper';
import { MongoClient, GridFSBucket, ObjectId, Db } from 'mongodb';
import formidable from 'formidable';

export const config = {
  api: { bodyParser: false },
};

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

const cachedDb: Db | null = null;

async function connectToMongo() : Promise<Db> {
      try {
        await client.connect(); // Await the connection
        // Now you can safely interact with the database
        const db = client.db("cfm");

		return db;
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
		throw error; // Rethrow the error after logging it
      } finally {
      }
    }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
  	}

	if (req.method === 'GET') {
		const db = await connectToMongo();
		const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
		const files = await bucket.find().toArray();
		return res.status(200).json({ files, ok: true });
	}
		

	if (req.method === 'POST') {


		// res.end(403).json({ ok: false, error: 'Not implemented' });

		console.group("Handling file upload");

		const db = await connectToMongo();
		const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

		const form = formidable({ 
			multiples: false,
			keepExtensions: true,
			maxFileSize: 16 * 1024 * 1024, // 16MB
		 });

		//  console.log(form);

		console.groupEnd();

		console.log("Parsing form data...");
		console.log(req.body);

		form.parse(req.body.formData, async (err, fields, files) => {
			if (err) {
				return res.status(500).json({ error: 'Error parsing form data' });
			}
			
			console.log(fields);
			console.log(files);


			const uploaderUserId = Array.isArray(fields.uploaderUserId)
			? fields.uploaderUserId[0]
			: fields.uploaderUserId;

			let serverId = Array.isArray(fields.serverId)
			? fields.serverId[0]
			: fields.serverId;

			const path = Array.isArray(fields.path)
			? fields.path[0]
			: fields.path;


			if (!uploaderUserId) {
				return res.status(400).json({ error: 'Uploader user ID is required' });
			}

			if (!serverId) {
				serverId = 'shared';
			}

			if (!path) {
				return res.status(400).json({ error: 'Path is required' });
			}

			if (!files.file) {
				return res.status(400).json({ error: 'No file uploaded' });
			}

			const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];
			const insertedFiles = [];

			try {
			for (const file of uploadedFiles) {
				const readStream = fs.createReadStream(file.filepath);
				const gridFsFileId = new ObjectId();
				const filename = file.originalFilename || file.newFilename || 'unknown';

				await new Promise((resolve, reject) => {
					const uploadStream = bucket.openUploadStreamWithId(gridFsFileId, filename, {
						metadata: { uploaderUserId },
					});

				readStream
					.pipe(uploadStream)
					.on('error', reject)
					.on('finish', resolve);
				});

				// Store metadata in MySQL database
				await pool.execute(
					'INSERT INTO files (id, name, path, uploader, createdAt) VALUES (?, ?, ?, ?, NOW())',
					[gridFsFileId, filename, `/uploads/${serverId}/${path}/${filename}`, uploaderUserId]
				);

				insertedFiles.push({
					id: gridFsFileId,
					name: filename,
					path: `/uploads/${serverId}/${path}/${filename}`,
				});
			}

			return res.status(200).json({ uploadedFiles: insertedFiles, ok: true });
			} catch (uploadError) {
			return res.status(500).json({ error: 'Uploading failed', detail: uploadError instanceof Error ? uploadError.message : uploadError });
			}
		});	
	};
}

export default handler;
