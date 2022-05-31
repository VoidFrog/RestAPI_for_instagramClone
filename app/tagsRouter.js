const fileController = require('./fileController.js')
const jsonController = require('./jsonController.js')
const tags = require('./model.js')

function route(req, res, FILES){
    let url = req.url 
    let method = req.method

    console.log(FILES)

    if(method == 'GET'){
        route_get(url, req, res, FILES)
    }
    else if(method == 'POST'){
        route_post(url, req, res, FILES)
    }
    else if(method == 'DELETE'){
        route_delete(url, req, res, FILES)
    }   
    else if(method == 'PATCH'){
        route_patch(url, req, res, FILES)
    }
}

function route_get(url, req, res, FILES){
    if(url == '/api/tags/raw'){
        res.end(JSON.stringify(tags.rawTags))
    }
}

function route_post(url, req, res, FILES){

}

function route_delete(url, req, res, FILES){

}

function route_patch(url, req, res, FILES){

}





module.exports = { route }