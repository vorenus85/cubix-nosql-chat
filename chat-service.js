const chatService = {}

const defaultRoom = { id: 'room1', name: 'Room 1' }

const loggedInUser = {
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

chatService.getMessages = function ({ options }) {
  const { room } = options
  return messages?.[room] || []
}

chatService.sendMessage = function ({ options }) {
  const { room, message } = options

  // Ensure the room exists in messages; initialize it as an empty array if not
  messages[room] = messages[room] || []

  // Push the new message into the room's message array
  messages[room].push(message)
}

chatService.getRooms = function () {
  return rooms
}

chatService.addNewRoom = function (room) {
  rooms.push(room)
}

chatService.login = function () {}

chatService.logout = function () {
  alert('logout')
}

chatService.disconnect = function () {}

module.exports = chatService
