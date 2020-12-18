const config = {
  serverIP: 'http://ip.janpfeiffer.de:1337'
}

const messagesContainer = document.getElementById('messages')
const formEl = document.getElementById('form')

new window.EventSource(`${config.serverIP}/chat/sse`).onmessage = function (event) {
  addMessage(JSON.parse(event.data))
}

function addMessage(message) {
  const date = new Date(message.createdAt)
  const formattedTimestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  const messageEl = document.createElement('div')
  messageEl.className = 'message'
  messageEl.style.backgroundColor = message.color || '#303D4E'
  messageEl.innerHTML = message.name ? `<span class="name">${message.name ? message.name + ': ' : ''}</span>` : ''
  messageEl.innerHTML += `
    <span class="message">${message.message}</span>
    <span class="timestamp">${formattedTimestamp}</span>
  `
  messagesContainer.appendChild(messageEl)
  messagesContainer.scrollTop = messagesContainer.scrollHeight

}

formEl.addEventListener('submit', (event) => {
  evt.preventDefault()
  submitMessage()
})

window.addEventListener('resize', () => messagesContainer.scrollTop = messagesContainer.scrollHeight)

function submitMessage() {
  if (!window.input.value) {
    return alert('Message is required!')
  }
  window.fetch(`${config.serverIP}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: window.input.value, color: window.color.value, name: window.chatName.value })
  })
  window.input.value = ''
}

window.color.addEventListener('change', () => {
  localStorage.setItem('chat-color', window.color.value);
})

window.chatName.addEventListener('change', () => {
  localStorage.setItem('chat-name', window.chatName.value);
})

window.submitBtn.addEventListener('click', () => {
  submitMessage()
})

document.addEventListener('DOMContentLoaded', () => {
  const localColor = localStorage.getItem('chat-color')
  const localName = localStorage.getItem('chat-name')
  if (localColor) window.color.value = localColor
  if (localName) window.chatName.value = localName
  window.fetch(`${config.serverIP}/chat`).then(async res => {
    const messages = await res.json();
    return messages
  }).then(messages => {
    messages.forEach(msg => {
      addMessage(msg)
    })
    setTimeout(() => {
      window.messages.scrollTop = window.messages.scrollHeight
    }, 100);
  })
})