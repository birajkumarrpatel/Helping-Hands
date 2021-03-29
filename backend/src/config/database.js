const mongoose = require('mongoose')
const logger = require('../middlewares/logger')
const { initialize } = require('mongoose-auto-increment')

const URL = process.env.MONGO_URL;
const OPEN_EVENT = 'open';
const ERROR_EVENT = 'error';

(async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
            poolSize: 10
        });
    } catch (e) {
        logger.error(`Error while mongo connect: %j %s`, e, e)
    }
})();

const db = mongoose.connection;
initialize(db);
db.once(OPEN_EVENT, () => {
    logger.info(`Successfully connected to db`)
});
db.on(ERROR_EVENT, () => {
    logger.error(`db connection error`)
});
