const fs = require('fs')
const ytdl = require('ytdl-core')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
// const ffmpeg = require('ffmpeg-static')
// const ffmpeg = require('ffmpeg')
const ffmpeg = require('fluent-ffmpeg')
const { getInfo } = require('ytdl-core')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('downloads'))
app.use(morgan('dev'))

app.post('/', (req, res) => {
  const url = req.body.url
  const format = req.body.format
  let name = ''
  if (format == 'mp3') {
    getInfo(url, (err, info) => {
      name = info.videoDetails.title + '.' + format
      ytdl(url, {
        quality: 'highestaudio',
        filter: 'audioonly',
      })
        .pipe(fs.createWriteStream('./downloads/' + name))
        .on('close', () => {
          res.status(200).json({
            success: true,
            filename: name,
            info: info,
          })
        })
    })
  } else {
    getInfo(url, (err, info) => {
      name = info.videoDetails.title
      ytdl(url, {
        quality: 'highestaudio',
        filter: 'audioonly',
      }).pipe(fs.createWriteStream('./downloads/' + name + '.mp3'))
      ytdl(url, {
        quality: 'highestvideo',
        filter: 'videoonly',
      })
        .pipe(fs.createWriteStream('./downloads/' + name + '.mp4'))
        .on('close', () => {
          new ffmpeg()
            .addInput('./downloads/' + name + '.mp3')
            .addInput('./downloads/' + name + '.mp4')
            .on('error', function (err) {
              console.log('An error occurred: ' + err.message)
            })
            .on('end', function () {
              console.log('Processing finished !')
              fs.unlinkSync('./downloads/' + name + '.mp4')
              fs.unlinkSync('./downloads/' + name + '.mp3')
              fs.renameSync(
                './downloads/' + name + '1.mp4',
                './downloads/' + name + '.mp4'
              )
              res.status(200).json({
                success: true,
                filename: name,
                info: info,
              })
            })
            .saveToFile('./downloads/' + name + '1.mp4')
        })
    })
  }
})

app.post('/download', (req, res) => {
  const name = req.body.name
  const file = 'downloads/' + name
  res.download(file)
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
