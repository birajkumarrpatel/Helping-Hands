'use strict'
const favWorkSchema = require('../models/favorite_work')


const findData = async (query, projection, options) => {
    const dbOperation = await favWorkSchema.find(query, projection, options).lean()
    return dbOperation
}

const createData = async (data) => {
    let dbOperation = new favWorkSchema(data)
    dbOperation = await dbOperation.save(data)
    return dbOperation
}

const updateData = async (query, updateJson) => {
    const dbOperation = await favWorkSchema.update(query, updateJson)
    return dbOperation
}

module.exports = {
    findData,
    createData,
    updateData
}