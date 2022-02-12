require('dotenv').config();


// create one object and to access the global variables we use process.env
module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME
}





