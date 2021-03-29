'use strict'
const crypto = require('crypto')
const { transport } = require('./transport')
const cryptoRandomString = require('crypto-random-string');
const key = process.env.CIPHER_CRYPTO_KEY;
let IV = crypto.randomBytes(16)
const algorithm = 'aes-128-cbc';
const inputEncoding = 'utf8';
const outputEncoding = 'hex';
const logger = require('../middlewares/logger')
const bcrypt = require('bcryptjs')

module.exports.msgCons = require('../constants/msg-constant')
module.exports.httpStatusCodes = require('http-status-codes')
module.exports.httpContext = require('express-http-context')
module.exports._lodash = require('lodash')
module.exports.logger = logger

module.exports.generateRandomString = (len) => {
    if (!len) len = 8
    return cryptoRandomString(len);
}

module.exports.createMD5Hash = (data) => {
    const md5Hash = crypto.createHash('md5')
    return md5Hash.update(data).digest('hex')
}

module.exports.encyptData = function (data) {
    const mykey = crypto.createCipheriv(algorithm, key, IV);
    let mystr = mykey.update(data, inputEncoding, outputEncoding);
    mystr += mykey.final('hex');
    return mystr;
}

module.exports.decryptData = function (data) {
    const mykey = crypto.createDecipheriv(algorithm, key, IV);
    let mystr = mykey.update(data, outputEncoding, inputEncoding);
    mystr += mykey.final('utf8');
    return mystr;
}

module.exports.generateHashedPassword = async password => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

module.exports.comparePassword = async (enteredPassword, hashPassword) => {
    const passwordMatch = await bcrypt.compare(enteredPassword, hashPassword)
    return passwordMatch
}

module.exports.responseGenerators = function (responseData, responseStatusCode, msg, responseErrors) {
    var responseJson = {}
    responseJson['data'] = responseData
    responseJson['status_code'] = responseStatusCode
    responseJson['message'] = msg

    // errors
    if (responseErrors === undefined) {
        responseJson['error'] = []
    } else {
        responseJson['error'] = responseErrors
    }

    return responseJson
}

module.exports.checkValidEmail = function (email) {
    // eslint-disable-next-line no-useless-escape
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

module.exports.swapJsonKeyToValue = (json) => {
    const response = {}
    for (let key in json) {
        response[json[key]] = key
    }
    return response
}

module.exports.mergeJsons = function (a, b) {
    if (a && b) {
        for (var key in b) {
            a[key] = b[key]
        }
    }
    return a
}

module.exports.errorObjectGenrator = function (code, msg) {
    var responseJson = {}
    // CODE
    if (typeof code === 'undefined') {
        responseJson['error_code'] = 500
    } else {
        responseJson['error_code'] = code
    }

    // MSG
    if (msg === undefined) {
        responseJson['error_message'] = this.msgCons.MSG_ERROR_SERVER_ERROR
    } else {
        responseJson['error_message'] = msg
    }

    return responseJson
}

module.exports.isEmpty = (object) => {
    for (var key in object) {
        // eslint-disable-next-line no-prototype-builtins
        if (object.hasOwnProperty(key)) {
            return false
        }
    }
    return true
}

module.exports.convertIntoArray = function (jsonObject) {
    if (!Array.isArray(jsonObject)) {
        return [jsonObject]
    }
    return jsonObject
}

module.exports.joiValidatorHandler = (joiSchema, dataToValidate) => {
    const joiResult = joiSchema.validate(dataToValidate);
    if (joiResult && joiResult.error) {
        let msg = joiResult.error.message || joiResult.error.details[0].message;
        msg = msg.replace(new RegExp(/[\\"]*/, "gm"), "");
        const code = this.httpStatusCodes.BAD_REQUEST;
        throw { msg, code };
    }
    return joiResult.value;
};

module.exports.sendEmail = async function (mailOptions) {
    try {
        // to, from, subject, text, html, attachments
        if (!('from' in mailOptions)) mailOptions.from = process.env.EMAIL_FROM
        await transport.sendMail(mailOptions, (error, _info) => {
            if (error) {
                logger.error(`Error while sending mail: %j %s`, error, error)
                return false
            }
            logger.info(`Mail sent successfully to user: ${mailOptions.to}`)
            return true
        });
    } catch (error) {
        return false
    }
}

module.exports.checkValidIP = (ip) => {
    if (ip.includes(':')) ip = ip.split(':')[0]
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return regex.test(ip)
}

module.exports.getOptionsJson = (extraParams) => {
    const json = {}
    if (extraParams && extraParams.limit) {
        json.limit = Number(extraParams.limit)
    }
    if (extraParams && extraParams.offset) {
        json.skip = Number(extraParams.offset)
    }
    if (extraParams && extraParams.sort) {
        json.sort = extraParams.sort
    }
    return json
}

module.exports.addTemplateDataToElasticSearch = (data) => {

    /**
     * Sample Data:
     *  {
            "editor_template_id": "15a34026-b88e-4f93-8e79-6f125208c690",
            "speciality": [
                "HPI",
                "Card",
                "DOC"
            ],
            "topics": [
                "topic1"
            ],
            "type": "medicine",
            "name": "medicine",
            "page_id": "Test.Test3",
            "page_name": "This is Test Page By Vipul",
            "section_1": [
                "Topic1",
                "Topic 2",
                "Topic 3",
                "Topic 4"
            ],
            "section_2": [
                "Disease",
                "Diagnostic",
                "Treatment",
                "Risk Factors",
                "Complications",
                "Associations",
                "Classification",
                "Differential Diagnosis (DDx)",
                "Histopathology",
                "Additional Explanation",
                "Images",
                "Other Resources",
                "References"
            ]
        }
     */

    if (!data || !data.editor_template_id) {
        return {}
    }

    const finalJson = {}
    finalJson.editor_template_id = data.editor_template_id
    finalJson.id = data.editor_template_id
    if ('speciality' in data && Array.isArray(data.speciality) && data.speciality.length > 0) {
        finalJson.speciality = data.speciality
    }
    if ('topics' in data && Array.isArray(data.topics) && data.topics.length > 0) {
        finalJson.topics = data.topics
    }
    if ('type' in data) {
        finalJson.type = data.type
    }
    if ('version' in data) {
        finalJson.version = data.version
    }
    if ('name' in data) {
        finalJson.name = data.name
    }
    if ('page_id' in data) {
        finalJson.page_id = data.page_id
    }
    if ('page_name' in data) {
        finalJson.page_name = data.page_name
    }
    if ('section_1' in data && Array.isArray(data.section_1) && data.section_1.length > 0) {
        const titles = []
        const description = []
        for (const elem of data.section_1) {
            if (elem && 'title' in elem) titles.push(elem.title)
            if (elem && 'description' in elem && elem.description.length > 0) description.push(elem.description)
        }
        finalJson.section_1 = titles
        finalJson.section_1_description = description
    }
    if ('media' in data && Array.isArray(data.media) && data.media.length > 0) {
        const titles = []
        for (const elem of data.media) {
            if (elem && 'title' in elem) titles.push(elem.title)
        }
        finalJson.media = titles
    }
    if ('section_2' in data && Array.isArray(data.section_2) && data.section_2.length > 0) {
        const titles = []
        const explanations = []
        for (const elem of data.section_2) {
            if (elem && 'title' in elem) titles.push(elem.title)
            if (elem && 'explanation' in elem && elem.explanation.length > 0) explanations.push(elem.explanation)
        }
        finalJson.section_2 = titles
        finalJson.section_2_explanation = explanations
    }
    logger.info('\n finalJson to add into es \n', finalJson)
    return finalJson
}