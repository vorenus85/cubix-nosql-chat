// const _ = require('lodash')
const chatService = require('./chat-service.js')
const chatController = {}

let selectedRoom = null

chatController.renderMessage = function (message) {
  const messagesPanel = document.getElementById('messages')
  messagesPanel.insertAdjacentHTML(
    'beforeEnd',
    `<div class="message-item mb-3 bg-light"><p class="mb-1"><strong>${message.user}:</strong> ${message.content}</p><small><i>${message.date.toLocaleString()}</i></small></div>`
  )
}

chatController.renderRooms = function () {
  const roomsPanel = document.getElementById('rooms-list')
  roomsPanel.innerHTML = ''
  chatService.getRooms(function (rooms) {
    rooms.forEach(room => {
      roomsPanel.insertAdjacentHTML(
        'beforeend',
        `<li class="list-group-item room-item" role="button" data-id="${room.id}" onclick="chatController.renderRoomMessages('')">${room.name}</li>`
      )
    })
  })
}

document.addEventListener('click', function (event) {
  const target = event.target.closest('.room-item')

  if (target) {
    const room = { _id: target.getAttribute('data-id'), name: target.innerHTML }
    selectedRoom = room
    chatController.renderRoomMessages(room)
  }
})

chatController.setSelectedRoom = function (room) {
  selectedRoom = chatService.getRoom(room)
}

chatController.renderRoomMessages = function (room) {
  const messagesPanel = document.getElementById('messages')
  messagesPanel.innerHTML = ''
  selectedRoom = room
  chatController.renderSelectedRoomLabel({ name: room.name })
  chatService.getMessages({ room }, function (messages) {
    // console.log(messages)
    messages.forEach(message => {
      chatController.renderMessage(message)
    })
  })
}

chatController.renderSelectedRoomLabel = function (room) {
  const roomLabel = document.getElementById('selectedRoom')
  roomLabel.innerHTML = room.name
}

chatController.addNewRoom = async function () {
  const roomInput = document.getElementById('roomInput')

  if (!roomInput.value) {
    return false
  }

  await chatService.addNewRoom({ name: roomInput.value }, function () {
    roomInput.value = ''
    chatController.renderRooms()
  })
}

chatController.sendMessage = function () {
  const loggedInUser = chatService.getLoggedInUser()
  const messageInput = document.getElementById('messageInput')
  if (!messageInput.value) {
    return
  }
  if (!selectedRoom) {
    console.error('No room selected!')
    return
  }

  const newMessage = {
    room: selectedRoom._id,
    content: messageInput.value,
    user: loggedInUser.name,
    date: new Date()
  }

  chatService.sendMessage({
    options: { ...newMessage }
  })
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
    const config = {
      username: usernameInput.value,
      serverAddress: serverInput.value
    }

    chatService.login(
      config,
      function () {
        loginScreen.style.display = 'none'
        loggedInScreen.style.display = 'flex'
        chatController.renderRooms()
        chatService.getDefaultRoom(function (room) {
          chatController.renderRoomMessages(room)
        })

        usernameInput.value = ''
        serverInput.value = ''
        passwordInput.value = ''
      },
      function (err) {
        console.log('Failed to connect database', err)
      }
    )
  }
}

chatController.logout = function () {
  const loginScreen = document.getElementById('login-screen')
  const loggedInScreen = document.getElementById('logged-in-screen')
  loginScreen.style.display = 'flex'
  loggedInScreen.style.display = 'none'
  chatService.logout()
}
module.exports = chatController
