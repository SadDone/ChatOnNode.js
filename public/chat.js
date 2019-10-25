$(function () {
    // make connetction
    var socket = io.connect('http://localhost:3000')

    // console.log(id);
    // buttons and input
    var message = $("#message")
    var username = $('#username')
    var send_message = $('#send_message')
    var send_username = $('#send_username')
    var chatroom = $('#chatroom')
    var userList = $('#userList')
    var button = new Array();

    console.log(socket);

    socket.emit('io', {
        info: socket.id
    })

    var room = 'allUser';

    socket.on('connectUserList', (data) => {
        userList.html('');
        for(let i = 0; i < data.allUser.length; i++) {
            // let name = '';
            // // console.log(data.allUser[i])
            // // console.log(data.sockets[0].username);
            // for(let j = 0; j < data.sockets.length; j++) {
            //     if(data.sockets[j].id == data.allUser[i]) {
            //         name = data.sockets[j].username;
            //     }
            // }
            if(data.allUser[i][0] != socket.id) {
                userList.append(`<p id="nameUser">${data.allUser[i][1]}</p> <button class = "button" id="${data.allUser[i][0]}">Написать сообщение</button>`);
            }
            button.push($('#' + data.allUser[i][0]));
        }
    })

    $('#userList').click(function(event)  {
        let target = event.target;
        if(target.id != 'div') {
            
        }

        room = target.id + '';
        // console.log(room);

        // socket.emit('message_on', {
        //     roomID: target.attr('id'),
        // })
    })

    // Emit message
    send_message.click(function () {
        socket.emit('new_message', {
            roomID: room,
            message: message.val()
        })
    })

    //Emit message on room


    // Listen on new_message
    socket.on('new_message', (data) => {
        console.log(data);
        let time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        console.log(time);
        chatroom.append(`<div class = 'mes'><span class = 'time'>${time}</span><p class = 'chat'>Из чата c ${data.roomID}</p><p class = 'message'>${data.username}: ${data.message}</p></div>`)
    })

    // Emit a username
    send_username.click(function () {
        console.log(username.val())
        socket.emit('change_username', {
            username: username.val()
        })
    })

    // Emit typing
    message.bind('keypress', () => {
        socket.emit('typing', {count: message.val()});
    })

    // Listen on typing
    socket.on('typing', (data) => {
        $(feedback).html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
    })
});