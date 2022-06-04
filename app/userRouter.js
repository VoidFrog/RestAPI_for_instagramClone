const userController = require('./userController.js');
const tokenAuth = require('./tokenAuth');
const model = require('./model.js')

async function route(req, res, FILES){
    let url = req.url 
    let method = req.method

    if(method == 'GET'){
        route_get(url, req, res, FILES)
    }
    else if(method == 'POST'){
        await route_post(url, req, res, FILES)
    }
}

async function route_get(url, req, res, FILES){
//                              regex tokena
    if(url.match(/\/api\/user\/confirm\/.*/)){
        let token = userController.get_token(url)
        console.log('\n\n\n\n\n\n\n\n\n\n', token)
        let decrypted = await tokenAuth.verify_token(token)
        console.log(decrypted)

        if(userController.process_token(decrypted) == true){
            userController.confirm_account(decrypted.email)

            res.end('<h1>ACCOUNT CONFIRMED</h1>')
        }
        else{
            res.end('<h1>LINK EXPIRED</h1>')
        }
    }
    else if(url == '/api/user'){
        res.end(JSON.stringify(model.user_list))
    }
}

async function route_post(url, req, res){
    if(url == '/api/user/register'){
        await userController.register(req, res)
    }
    else if(url == '/api/user/login'){
        await userController.login(req, res)
    }
}

module.exports = { route }