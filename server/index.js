const fs = require('fs')
const ytdl = require('ytdl-core')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mime = require('mime-types')
const { getInfo } = require('ytdl-core')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.post('/', (req, res) => {
  const url = req.body.url
  const format = req.body.format
  let name = ''
  getInfo(url, (err, info) => {
    name = (info.videoDetails.title + '.' + format).replace(' ', '_')
    ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly',
    })
      .pipe(fs.createWriteStream('downloads/' + name))
      .on('close', () => {
        const file = 'downloads/' + name
        const mimetype = mime.lookup(file)
        res.setHeader(
          'Content-Disposition',
          `      attachment; filename=${file}`
        )
        res.setHeader('Content-Type', mimetype)
        res.download(file)
        setTimeout(() => {
          fs.unlinkSync(file)
        }, 10000)
        // res.status(200).json({ success: true })
      })
  })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
