
$(function(){
   	//make connection
	var socket = io.connect('http://localhost:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var finalize = $("#send_finalize")

	//Emit message
	send_message.click(function(){
		if(message.val == undefined || message.val() == ''){
			alert("Preencha o campo de mensagem!")
			return
		}
		socket.emit('new_message', {message : message.val()})
	})

	finalize.click(function(){
		socket.emit('finalize')
	})

	//Listen on new_message
	socket.on("finalize", (data) => {
		chatroom.html('');
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});


