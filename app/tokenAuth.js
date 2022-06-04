const jwt = require('jsonwebtoken');

async function create_token(user){
    let token = await jwt.sign(
        {
            email: user.email,
            user_id: user.id
        },
        process.env.VERYSECRETKEY,
        {
            expiresIn: "1h" // "1m", "1d", "24h"
        }
    );

    return token
}

async function verify_token(token){
    try{
        let decoded = await jwt.verify(token, process.env.VERYSECRETKEY)
        return decoded
    } catch(ex) {
        console.log(ex.message)
    }
}


module.exports = { create_token, verify_token }