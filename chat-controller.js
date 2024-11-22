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
      `<li class="list-group-item" onclick="chatController.renderRoomMessages('${room.id}')">${room.name}</li>`
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

chatController.logout = function () {
  chatService.logout()
}

chatController.init = function () {
  chatController.renderRoomMessages(selectedRoom.id)
  chatController.renderRooms()
}
module.exports = chatController
