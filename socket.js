import { Server } from 'socket.io'
import { createServer } from 'http';
import { ModelMessages, ModelSid } from './mongoose/mongooseValidationPlusModelCreation.js'
import 'dotenv/config'
import cookie from 'cookie'
import signature from 'cookie-signature'
const map = new Map()
const httpServer = createServer((req, res) => {
    res.writeHead(200);
    res.end('Server is Online');
})
const io = new Server(httpServer,{
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET',"POST"],
        credentials: true
    }
})
io.use(async (socket, next) => {
    const header = socket.handshake.headers.cookie
    if (!header) {
        return next(new Error("Authentication error: No cookies found"))
    }
    const cookies = cookie.parse(header)
    const rawSid = cookies['sid'] || cookies['connect.sid']
    if (rawSid && rawSid.startsWith('s:')) {
        const unsignedSid = signature.unsign(rawSid.slice(2), process.env.SECRET);
        if (unsignedSid !== false) {
                    socket.userId = unsignedSid
                    map.set(unsignedSid,socket.id)
                    return next()
        }
    }
    next(new Error("Authentication error: Invalid signature"))
})
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} with Socket ID: ${socket.id}`)
    socket.on('chatMessage', async (msg) => {
        const { to, message } = msg
        const recipientDoc = await ModelSid.findOne({ someId: to })
        if (recipientDoc) {
            const receiverSocketId = map.get(String(recipientDoc._id))
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('message', {
                    message
                })    
            }
            console.log('here')
            await ModelMessages.create({message,to})
        }
        else{
            console.log('not herer')
            await ModelMessages.create({message,to})
        }
    })
    socket.on('disconnect', () => {
        if (socket.userId) {
            map.delete(socket.userId)
            console.log(`User ${socket.userId} removed from map`)
        }
    })
})
const PORT = process.env.PORT || 10000;
httpServer.listen(PORT,() => {
    console.log(`Server is running on http://${process.env.WEBSOCKETHOST}:${PORT}`)
})