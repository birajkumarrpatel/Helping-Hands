const { responseGenerators } =  require('../utils/utils')
const logger =  require('./logger')

const rbacMapper = {
    GET: {
    },
    POST: {
    }
}

const authorizationMiddleware = async (req, res, next) => {
    const currentUser = req['currentUser'];
    if (currentUser) {
        const usersRole = currentUser.user_role
        let hostname = req.originalUrl
        hostname = hostname.split('?')[0]
        const method = req.method
        try {
            if (!rbacMapper[method][hostname].includes(usersRole)) {
                throw new Error();
            }
            next();
            return;
        } catch (e) {
            logger.error(`path: ${req.originalUrl} \nError while doing authorization from middleware: %j %s`, e, e)
            return res.status(401).send(responseGenerators([], 'err_129', true, ''))
        }
    }
    return res.status(401).send(responseGenerators([], 'err_129', true, ''))
};

module.exports = {
    authorizationMiddleware
}