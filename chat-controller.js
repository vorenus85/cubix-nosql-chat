// const _ = require('lodash')
const chatService = require('./chat-service.js')
const chatController = {}

chatController.renderMessages = function (messages) {
  const messagesPanel = document.getElementById('messages')
  messagesPanel.innerHTML = ''
  messages.forEach(message => {
    messagesPanel.insertAdjacentHTML(
      'beforeEnd',
      `<div class="message-item mb-3"><p class="mb-1"><strong>${message.name}:</strong> ${message.message}</p><small><i>${message.datetime.toLocaleString()}</i></small></div>`
    )
  })
}

chatController.sendMessage = function () {
  const loggedInUser = chatService.getLoggedInUser()
  const messages = chatService.getMessages()
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
  const messages = chatService.getMessages()
  chatController.renderMessages(messages)
}
module.exports = chatController
