const express = require('express')
const cors = require('cors')
const serveStatic = require('serve-static')
const path = require('path')
const mongoose = require('mongoose')
const chatRoute = require('./routes/chat')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 1337

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to mongodb'))
  .catch((err) => console.error(err));

app.use(cors())
app.use(express.json())

app.use('/api/chat', chatRoute)

app.use(serveStatic(path.join(__dirname, '../', 'client')))

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))