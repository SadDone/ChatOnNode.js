$(function () {
    // make connetction
    var socket = io.connect('http://localhost:3000')

    // buttons and input
    var message = $("#message")
    var username = $('#username')
    var send_message = $('#send_message')
    var send_username = $('#send_username')
    var chatroom = $('#chatroom')

    // Emit message
    send_message.click(function () {
        socket.emit('new_message', {
            message: message.val()
        })
    })

    // Listen on new_message
    socket.on('new_message', (data) => {
        console.log(data);
        let time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        chatroom.append(`<div class = 'mes'><span class = 'time'>${time}</span><p class = 'message'>${data.username}: ${data.message}</p></div>`)
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
        $(feedback).html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
    })
});