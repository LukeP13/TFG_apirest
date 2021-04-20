const Joi           = require('joi')

const { JsonError, HttpCodes } = require('../../../requestErrors');


const validate = (schema, req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if(error) {
        return res.status(HttpCodes.BadRequest)
                .json(JsonError(error.details[0].message))
    }

    next()
}

const registerValidation = validate.bind(null, Joi.object({
    username: Joi.string().min(5).max(255).required(),
    email:    Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(200).required(),
    phone:    Joi.string(),
}))

const loginValidation = validate.bind(null, Joi.object({
    username: Joi.string(),
    email:    Joi.string().email(),
    password: Joi.string().required(),
}).xor('username', 'email'));

module.exports = {
    registerValidation,
    loginValidation
}