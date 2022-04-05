import express from 'express';
import { Server } from 'socket.io';
import Archivos from '../archivos.js';

import __dirname from './utils.js';

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));

const server = app.listen(PORT, () => console.log('Listening on 8080'));
const io = new Server(server);
const arch = new Archivos("messages.txt");

const productLog = [];
const messageLog = await arch.leer();

io.on('connection', socket => {
    io.emit('chatLog', messageLog);
    socket.on('newProduct', data => {
        productLog.push(data);
        io.emit('productLog', productLog);
    });
    socket.on('newMessage', async data => {
        await arch.guardar(data);
        messageLog.push(data);
        io.emit('chatLog', messageLog);
    });
});