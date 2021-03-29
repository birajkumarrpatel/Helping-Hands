'use strict'
const paymentsSchema = require('../models/payments')


const findData = async (query, projection, options) => {
    const dbOperation = await paymentsSchema.find(query, projection, options).lean()
    return dbOperation
}

const findDataV2 = async (query, projection, options) => {
    const dbOperation = await paymentsSchema.find(query, projection, options)
    return dbOperation
}

const createData = async (data) => {
    let dbOperation = new paymentsSchema(data)
    dbOperation = await dbOperation.save(data)
    return dbOperation
}

const updateData = async (query, updateJson) => {
    const dbOperation = await paymentsSchema.update(query, updateJson)
    return dbOperation
}

module.exports = {
    findData,
    createData,
    updateData,
    findDataV2
}