'use strict'

const express = require('express')
const cors = require('cors')
const requestId = require('./src/middlewares/requestId')
const logger = require('./src/middlewares/logger')
const app = express()
const fileUpload = require('express-fileupload')
const port = process.env.PORT

require('./src/config/database')

app.use(cors())
app.use(express.json())
app.use(requestId())

app.use(fileUpload({
    useTempFiles: true,
    createParentPath: true,
    limits: { fileSize: 2000 * 1024 * 1024 }
}))

require('./src/routes')(app)

app.use(function (req, res) {
    res.status(404).send({ data: [], mesage: 'The request you are looking for us to serve, is not available at our end', error: true, description: '' });
})


app.listen(port, (err) => {
    if (err) {
        logger.error(`Error while listening on port: %s`, port)
    } else {
        logger.info(`Service is running on port: %s`, port)
    }
})

module.exports = app