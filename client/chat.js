const config = {
  serverIP: 'http://ip.janpfeiffer.de:1337'
}

const messagesContainer = document.getElementById('messages')
const formEl = document.getElementById('form')
const inputEl = document.getElementById('input')
const nameEl = document.getElementById('chatName')
const colorEl = document.getElementById('color')
const submitEl = document.getElementById('submitBtn')

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
  scrollBottom()
}

function submitMessage() {
  if (!inputEl.value) {
    return alert('Message is required!')
  }
  fetch(`${config.serverIP}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: inputEl.value, color: colorEl.value, name: nameEl.value })
  })
  inputEl.value = ''
}

function scrollBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

formEl.addEventListener('submit', (event) => {
  event.preventDefault()
  submitMessage()
})

window.addEventListener('resize', scrollBottom)

colorEl.addEventListener('change', () => {
  localStorage.setItem('chat-color', colorEl.value);
})

nameEl.addEventListener('change', () => {
  localStorage.setItem('chat-name', nameEl.value);
})

submitEl.addEventListener('click', () => {
  submitMessage()
})

document.addEventListener('DOMContentLoaded', () => {
  const localColor = localStorage.getItem('chat-color')
  const localName = localStorage.getItem('chat-name')
  if (localColor) colorEl.value = localColor
  if (localName) nameEl.value = localName
  fetch(`${config.serverIP}/chat`).then(async res => {
    const messages = await res.json();
    return messages
  }).then(messages => {
    messages.forEach(msg => {
      addMessage(msg)
    })
    setTimeout(scrollBottom, 100);
  })

  new EventSource(`${config.serverIP}/chat/sse`).onmessage = function (event) {
    addMessage(JSON.parse(event.data))
  }
})