// const _ = require('lodash')
const chatService = require('./chat-service.js')
const chatController = {}

let selectedRoom = chatService.defaultRoom()

chatController.renderMessage = function (message) {
  const messagesPanel = document.getElementById('messages')
  messagesPanel.insertAdjacentHTML(
    'beforeEnd',
    `<div class="message-item mb-3 bg-light"><p class="mb-1"><strong>${message.name}:</strong> ${message.message}</p><small><i>${message.datetime.toLocaleString()}</i></small></div>`
  )
}

chatController.renderRooms = function () {
  const roomsPanel = document.getElementById('rooms-list')
  roomsPanel.innerHTML = ''
  const rooms = chatService.getRooms()
  rooms.forEach(room => {
    roomsPanel.insertAdjacentHTML(
      'beforeend',
      `<li class="list-group-item room-item" role="button" onclick="chatController.renderRoomMessages('${room.id}')">${room.name}</li>`
    )
  })
}

chatController.setSelectedRoom = function (room) {
  selectedRoom = chatService.getRoom(room)
}

chatController.renderRoomMessages = function (room) {
  const messages = chatService.getMessages({ options: { room } })
  const messagesPanel = document.getElementById('messages')
  messagesPanel.innerHTML = ''
  chatController.setSelectedRoom(room)
  chatController.renderSelectedRoomLabel()
  messages.forEach(message => {
    chatController.renderMessage(message)
  })
}

chatController.renderSelectedRoomLabel = function () {
  const roomLabel = document.getElementById('selectedRoom')
  roomLabel.innerHTML = selectedRoom.name
}

chatController.addNewRoom = function () {
  const roomInput = document.getElementById('roomInput')

  if (!roomInput.value) {
    return false
  }

  chatService.addNewRoom({ id: 'adasds', name: roomInput.value })
  chatController.renderRooms()
  roomInput.innerHTML = ''
}

chatController.sendMessage = function () {
  const loggedInUser = chatService.getLoggedInUser()
  const messageInput = document.getElementById('messageInput')
  if (!messageInput.value) {
    return
  }
  const newMessage = {
    ...loggedInUser,
    message: messageInput.value,
    datetime: new Date()
  }
  chatService.sendMessage({ options: { room: selectedRoom.id, message: newMessage } })
  chatController.renderMessage(newMessage)
  messageInput.value = ''
}

chatController.login = function () {
  const loginScreen = document.getElementById('login-screen')
  const loggedInScreen = document.getElementById('logged-in-screen')

  const usernameInput = document.getElementById('username')
  const serverInput = document.getElementById('server')
  const passwordInput = document.getElementById('password')

  const loginError = document.getElementById('loginError')
  loginError.innerHTML = ''

  if (!usernameInput.value || !serverInput.value || !passwordInput.value) {
    loginError.innerHTML = 'Please give Username, server and password!'
    return
  } else {
    loginScreen.style.display = 'none'
    loggedInScreen.style.display = 'flex'

    const user = {
      name: usernameInput.value
    }
    usernameInput.value = ''
    serverInput.value = ''
    passwordInput.value = ''
    chatService.login(user)
  }
}

chatController.logout = function () {
  const loginScreen = document.getElementById('login-screen')
  const loggedInScreen = document.getElementById('logged-in-screen')
  loginScreen.style.display = 'flex'
  loggedInScreen.style.display = 'none'
  chatService.logout()
}

chatController.init = function () {
  chatController.renderRoomMessages(selectedRoom.id)
  chatController.renderRooms()
}
module.exports = chatController
