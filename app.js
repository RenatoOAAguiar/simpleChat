const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;

//Start connection with mongodb
let database;
MongoClient.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true }, function(err, db){
    database = db.db()
})


let allData = []


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(3000)



//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
	console.log('New user connected')

	//default username
	socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        allData.push({message : data.message, username : socket.username})
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on new_message
    socket.on('finalize', (data) => {
        //broadcast the new message
        console.log(allData)
        //Send Mongo
        io.sockets.emit('finalize', {"message": "oi?"})

        database.collection("mensagens").insertOne({
            mensagens: allData
        })

        allData = []
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})
