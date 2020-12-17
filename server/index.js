const express = require('express')
const cors = require('cors')
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

app.use('/chat', chatRoute)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))