const express = require('express')
const app = express()


// set the template engine ejs
app.set('view engine', 'ejs')

// middlewares
app.use(express.static('public'))

// routes
app.get('/', (req, res) => {
    res.render('index')
})

// Listen on port 3000
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io").listen(server);

var arrayInfoUsername = new Array();

// listen on every connetction
io.on('connection', (socket) => {
    console.log('New user connected. ID:' + socket.id);

    // default username
    socket.username = 'Anonymous'


    socket.join('allUser');

    socket.join(socket.id);

    arrayInfoUsername.push([socket.id, socket.username]);

    // var arr = new Array();
    // Object.keys(socket.nsp.adapter.rooms['allUser'].sockets).map(i => arr.push(i)); //берем все подключенные к комнате сокеты 
    socket.emit('connectUserList', {
        allUser: arrayInfoUsername
    })

    // var infoForAnyUser = new Array();
    // socket.on('io', (data) => {
    //     infoForAnyUser.push([data.info, socket.username]);
    // })
    // console.log(infoForAnyUser);
    socket.on('disconnect', () => {
        for(let i = 0; i < arrayInfoUsername.length; i++) {
            if(socket.id == arrayInfoUsername[i][0]) {
                arrayInfoUsername.splice(i,1);
            }
        }
        socket.emit('connectUserList', {
            allUser: arrayInfoUsername
        })
    })

    // listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username;
        for(let i = 0; i < arrayInfoUsername.length; i++) {
            if(socket.id == arrayInfoUsername[i][0]) {
                arrayInfoUsername[i][1] = data.username + '';
                console.log(1);
            }
            console.log(arrayInfoUsername[i][1])
        }
        socket.emit('connectUserList', {
            allUser: arrayInfoUsername
        })
    })

    socket.on('message_on', (data) => {
        socket.to(data.roomID).emit('message_on', {
            mes: data.message
        })
    })


    // Listen on new_message
    socket.on('new_message', (data) => {
        var room;
        // broadcast the new message
        if(data.roomID != 'allUser') {
            for(let i = 0; i < arrayInfoUsername.length; i++) {
                if(data.roomID == arrayInfoUsername[i][0]) {
                    room = arrayInfoUsername[i][1];
                }
            }
        } else {
            room = 'allUser';
        }
        socket.to(data.roomID).emit('new_message', {
            roomID: room,
            message: data.message,
            username: socket.username
        });
    })

    // listen on typing
    socket.on('typing', (data) => {
        if(data.count.length > 0){
            socket.broadcast.emit('typing', {
                username: socket.username,
                length: data.count.length
            })
        }
    })
})