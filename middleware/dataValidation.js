const Joi           = require('@hapi/joy')

const { JsonError, HttpCodes } = require('../requestErrors');


const validate = (schema, req, res, next) => {

    const { error } = Joi.validate(req.body, schema);

    if(error) {
        return res.status(HttpCodes.BadRequest)
                .json(JsonError(error.details[0].message))
    }

    next()
}

const registerValidation = validate.bind(null, {
    username: Joi.string().min(6).max(255).required(),
    email:    Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(200).required(),
    phone:    Joi.string().phone(),
})

module.exports = {
    registerValidation
}