// const _ = require('lodash')
const chatService = require('./chat-service.js')
const chatController = {}

let selectedRoom = chatService.defaultRoom()

chatController.renderMessages = function (messages) {
  const messagesPanel = document.getElementById('messages')
  messagesPanel.innerHTML = ''
  messages.forEach(message => {
    messagesPanel.insertAdjacentHTML(
      'beforeEnd',
      `<div class="message-item mb-3 bg-light"><p class="mb-1"><strong>${message.name}:</strong> ${message.message}</p><small><i>${message.datetime.toLocaleString()}</i></small></div>`
    )
  })
}

chatController.renderRooms = function () {
  const roomsPanel = document.getElementById('rooms-list')
  roomsPanel.innerHTML = ''
  const rooms = chatService.getRooms()
  rooms.forEach(room => {
    roomsPanel.insertAdjacentHTML(
      'beforeend',
      `<li class="list-group-item" onclick="chatController.selectRoom('${room.id}')">${room.name}</li>`
    )
  })
}

chatController.setSelectedRoom = function (room) {
  selectedRoom = chatService.getRoom(room)
}

chatController.selectRoom = function (room) {
  const messages = chatService.getMessages({ options: { room } })

  chatController.setSelectedRoom(room)
  chatController.renderSelectedRoomLabel()
  chatController.renderMessages(messages)
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
  const messages = chatService.getMessages({ options: { room: selectedRoom.id } })
  const messageInput = document.getElementById('messageInput')
  if (!messageInput.value) {
    return
  }
  const newMessage = {
    ...loggedInUser,
    message: messageInput.value,
    datetime: new Date()
  }
  messages.push(newMessage)
  chatController.renderMessages(messages)
  messageInput.value = ''
}

chatController.logout = function () {
  chatService.logout()
}

chatController.init = function () {
  chatController.selectRoom(selectedRoom.id)
  chatController.renderRooms()
}
module.exports = chatController
