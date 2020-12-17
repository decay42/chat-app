const router = require('express').Router()
const messageModel = require('../models/message')
const chatEmitter = require('../chatEmitter')
const format = require('date-fns/format');

router.get('/', async (req, res) => {
  const messages = await messageModel.find({}).lean()

  try {
    res.send(messages)
  } catch (err) {
    res.status(500).send(err);
  }
})

router.post('/', async (req, res) => {
  const message = new messageModel(req.body);

  try {
    await message.save();
    chatEmitter.emit('message', JSON.stringify(message))
  } catch (err) {
    console.error(err)
    res.status(500);
  }
  res.end()
})

router.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  })
  const onMessage = msg => res.write(`data: ${msg}\n\n`)
  chatEmitter.on('message', onMessage)
  res.on('close', function () {
    chatEmitter.off('message', onMessage)
  })
})

module.exports = router