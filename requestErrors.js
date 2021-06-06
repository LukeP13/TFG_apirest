const JsonError = (message) => {
    return {
        status: 'error',
        message
    }
};

const HttpCodes = {
    //200
    Ok: 200,
    Created: 201,
    Accepted: 202,

    //Client error
    BadRequest: 400,
    Unauthorized: 401,
    NotFound: 404,
    MethodNotAllowed: 405,

    //Server error
    InternalServerError: 500,
    NotImplemented: 501
}


module.exports = {
    JsonError,
    HttpCodes
}