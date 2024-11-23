const chatService = {}
let mongoose = require('mongoose')

const Message = mongoose.model(
  'Message',
  new mongoose.Schema({
    user: String,
    date: Date,
    content: String,
    room: String
  })
)

const Room = mongoose.model('Room', new mongoose.Schema({ name: String, default: Boolean }))

const defaultRoom = { default: true, name: 'Townhall' }

// Create a default room if it does not exist
Room.findOneAndUpdate(
  { default: true }, // Search for a room marked as default
  { $set: defaultRoom }, // Update fields using $set
  {
    upsert: true, // Insert if no document matches
    new: true, // Return the new document after update
    setDefaultsOnInsert: true // Apply defaults if a new document is created
  }
)
  .then(room => {
    // console.log('Default room:', room)
  })
  .catch(error => {
    console.error('Error creating default room:', error)
  })

let loggedInUser = {
  id: 1,
  name: 'User 1'
}

let rooms = [
  { id: 'room1', name: 'Room 1' },
  { id: 'room2', name: 'Room 2' }
]

let messages = {
  room1: [
    {
      id: 1,
      name: 'User 1',
      message: 'Hello',
      datetime: new Date('2024-11-22 14:13:22')
    },
    {
      id: 2,
      name: 'User 2',
      message: 'Hello there',
      datetime: new Date('2024-11-22 14:15:22')
    },
    {
      id: 3,
      name: 'User 3',
      message: 'I am here too!',
      datetime: new Date('2024-11-22 14:18:22')
    }
  ]
}

chatService.getRoom = function (roomId) {
  return rooms.find(room => room.id === roomId)
}

chatService.defaultRoom = function () {
  return defaultRoom
}

chatService.getLoggedInUser = function () {
  return loggedInUser
}

chatService.getMessages = function (options, cb) {
  const { room } = options
  Message.find({ room: room._id }).then(result => {
    cb(result)
  })
}

chatService.sendMessage = function ({ options }) {
  let newMessage = new Message({ ...options })
  newMessage.save()
}

chatService.getRooms = function (cb) {
  Room.find().then(result => {
    cb(result)
  })
  return rooms
}

chatService.addNewRoom = async function (room, successCb) {
  const { name } = room
  let newRoom = new Room({ name, default: false })
  await newRoom.save()
  successCb()
}

chatService.getDefaultRoom = function (cb) {
  Room.findOne({ default: true }).then(result => {
    cb(result)
  })
}

chatService.login = function (options, successCb, failCb) {
  loggedInUser = { id: 1, name: options.username }
  mongoose
    .connect('mongodb://' + options.serverAddress + ':27017/cubixchat?authSource=admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(function () {
      successCb()
    }, failCb)

  console.log('login')
}

chatService.logout = function () {
  loggedInUser = {}
}

// disconnect from db
chatService.disconnect = function () {}

module.exports = chatService
