const nodemailer = require('nodemailer')
const logger = require('../middlewares/logger')

var transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transport.verify((error, _success) => {
  if (error) {
    logger.error(`Error while verifying transporter connection %j %s`, error, error)
  } else {
    logger.info(`SMTP transporter verification success`)
  }
});

module.exports = {
  transport
}
