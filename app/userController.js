const dataEncryption = require('./dataEncryption.js');
const mailHandler = require('./mailHandler');
const tokenAuth = require('./tokenAuth.js')
const model = require('./model.js');


async function register(req, res){
    let data = await collect_data(req) 

    let data_not_null = false
    if(data != null){
        data_not_null = true
    }
    if(data_not_null && check_user_data(data)){
        let pass = await dataEncryption.encryptPassword(data.password)
        let user = new model.User(data.name, data.lastName, data.email, pass)
        //user added to user_list 
        mailHandler.send_mail(user)

        res.writeHead(201, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({message: 'user created'}))
    }
}

async function login(req, res){
    let data = await collect_data(req) 

    let data_not_null = false
    if(data != null){
        data_not_null = true
    }
    if(data_not_null && data.email && data.password){
        let user = find_user(data.email)
        if(user != null){
            let decrypted_pass = await dataEncryption.decryptPassword(data.password, user.password)
            
            if(decrypted_pass){
                let token = await tokenAuth.create_token(user)
    
                res.setHeader('Authorization', 'Bearer '+token)
                res.end(JSON.stringify(token))
            }   
            else{
                res.end('incorrect password')
            }
        }
        else {
            res.end('user doesnt exist')
        }

        
    }
}

async function collect_data(req){
    return new Promise((resolve, reject) => {
        let body = ''
        req.on('data', function(data){
            body += data
        })
    
        req.on('end', function(){
            if(body != null){
                resolve(JSON.parse(body))
            }
            else {
                console.log('something went terribly wrong')
                reject(null)
            } 
        })
    })  
}

function check_user_data(data){
    if(data.name && data.lastName && data.email && data.password){
        return true
    }
    return false
}

function get_token(url){
    //splitted[4] is tokenx 
    let splitted = url.split('/')
    return splitted[4]
}

function process_token(decrypted){
    if(decrypted != null){
        if(decrypted.iat < decrypted.exp){
            return true
        }
    }
    return false
}

function confirm_account(email){
    for(let user of model.user_list){
        if(email == user.email){
            user.confirmed = true

            mailHandler.send_confirmation(user)
        }
    }
}

function find_user(email){
    for(let user of model.user_list){
        if(user.email == email){
            return user
        }
    }
}

module.exports = { register, get_token, process_token, confirm_account, login }