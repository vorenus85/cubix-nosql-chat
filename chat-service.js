const chatService = {}

const loggedInUser = {
  id: 1,
  name: 'User 1'
}

let messages = [
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

chatService.getLoggedInUser = function () {
  return loggedInUser
}

chatService.getMessages = function () {
  return messages
}

chatService.login = function () {}

chatService.logout = function () {
  alert('logout')
}

chatService.disconnect = function () {}

module.exports = chatService
