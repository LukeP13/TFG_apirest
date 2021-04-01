const path      = require('path')
const multer    = require('multer')

const fileExtensions = ['image/png', 'image/jpg', 'image/jpeg']

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

var upload = multer ({
    storage: storage,
    fileFilter: function(req, file, callback) {
        if(fileExtensions.some(f => f == file.mimetype)){
            callback(null, true)
        } else {
            console.log('Only JPG & PNG file supported!')
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

module.exports = upload