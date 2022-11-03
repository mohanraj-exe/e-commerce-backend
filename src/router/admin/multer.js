const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/files')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);

        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        //   console.log(path.extname(file.originalname))
        //   cb(null,( file.fieldname + '-' + uniqueSuffix+ path.extname(file.originalname)))
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "jpg" || "webp" || "jpeg" || "img") {
        cb(null, true);
    } else {
        cb(new Error("Not a PDF File!!"), false);
    }
};

const upload = multer({ storage: multerStorage, limits: { fileSize: 1024 * 1024 }, fileFilter: multerFilter })

module.exports = upload;