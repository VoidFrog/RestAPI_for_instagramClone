const bcrypt = require('bcrypt');

async function encryptPassword(password){
    let encryptedPassword = await bcrypt.hash(password, 10)
    return encryptedPassword
} 

async function decryptPassword(user_password, encrypted_password){
    let decrypted = await bcrypt.compare(user_password, encrypted_password)
    return decrypted
} 

module.exports = { encryptPassword, decryptPassword }