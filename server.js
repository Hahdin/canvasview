import express from 'express'
const path = require('path')
const port = 4555
const app = express()
app.use(express.static('dist'))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'), function (err) {
    if (err) {
     res.status(500).send(err)
    }
  })
})
app.listen(port, () =>{
  console.log(`Server listening on port ${port}`)
})