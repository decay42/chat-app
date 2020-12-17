new window.EventSource('http://ip.janpfeiffer.de:1337/chat/sse').onmessage = function (event) {
  addMessage(JSON.parse(event.data))
}

function addMessage(message) {
  const date = new Date(message.createdAt)
  const formattedTimestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  window.messages.innerHTML += `<pre style="background-color: ${message.color || '#303D4E'};"><span class="name">${message.name ? message.name + ': ' : ''}</span><span class="message">${message.message}</span><span class="timestamp">${formattedTimestamp}</span></pre>`
  window.messages.scrollTop = window.messages.scrollHeight

}

window.form.addEventListener('submit', (event) => {
  evt.preventDefault()
  submitMessage()
})

function submitMessage() {
  if (!window.input.value) {
    return alert('Message is required!')
  }
  window.fetch('http://ip.janpfeiffer.de:1337/chat', {
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
  window.fetch('http://ip.janpfeiffer.de:1337/chat').then(async res => {
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