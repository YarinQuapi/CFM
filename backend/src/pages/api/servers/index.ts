import type { NextApiRequest, NextApiResponse } from 'next'

// This should be replaced by your DB logic
let servers = [
  { id: '1', name: 'Main Server', host: 'localhost', port: 25565, status: 'online' }
]

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(200).json(servers)
  } else if (req.method === 'POST') {
    const newServer = { ...req.body, id: String(Date.now()) }
    servers.push(newServer)
    res.status(201).json(newServer)
  } else {
    res.status(405).end()
  }
}

export default handler
