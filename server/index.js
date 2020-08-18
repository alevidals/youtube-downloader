const fs = require('fs')
const ytdl = require('ytdl-core')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { getInfo } = require('ytdl-core')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  const url = req.body.url
  const format = req.body.format
  getInfo(url, (err, info) => {
    ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly',
    }).pipe(
      fs.createWriteStream(
        'downloads/' + info.videoDetails.title + '.' + format
      )
    )
  })

  return res.status(200).json({ success: true })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
