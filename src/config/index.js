const { v2: cloudinary } = require('cloudinary');

const port = 5000;
const mysqlConfig = {
    host: '127.0.0.1',
    user: 'modelfashion',
    password: 'WeT2LX4Xx2kFnkFZ',
    port: 3399,
    database: 'modelfashion',
};
cloudinary.config({
    cloud_name: 'cde',
    api_key: '537853312614449',
    api_secret: '__Rb7zY3SQzgNSdlzh3PLP0Jz8Y',
});

const accountSid = 'ACebdc9b532637233357c572d949d63d46';
const messagingServiceSid = 'MGb42c5ffe13027509ec12f596c3ef4971';
const authToken = 'f1cc9f1bbbe4a71029c51ce4e7a701ff';

const private_key = 'admin';
//Twilio
// khiemk31@gmail.com
// nguyenduykhiem171098
//Cloudinary
// ginhotaru282@gmail.com
// Matkhau123@
module.exports = { port, mysqlConfig, cloudinary, private_key, accountSid, messagingServiceSid, authToken };
