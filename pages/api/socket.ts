import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/lib/socket'
import { Server as SocketIOServer } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('🚀 Initializing Socket.io server...')

    const httpServer: NetServer = res.socket.server as any
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })

    io.on('connection', (socket) => {
      console.log('✅ Client connected:', socket.id)

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id)
      })
    })

    res.socket.server.io = io
    console.log('✅ Socket.io server initialized')
  } else {
    console.log('Socket.io already running')
  }

  res.end()
}

export default ioHandler
