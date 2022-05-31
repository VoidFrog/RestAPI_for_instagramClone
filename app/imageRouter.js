let formidable = require('formidable')
const fileController = require('./fileController.js')
const jsonController = require('./jsonController.js')

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
    if(url == '/api/photos'){
        res.end(JSON.stringify(FILES))
    }
    // /api/photos/[number]
    else if(url.match(/\/api\/photos\/([0-9]+)/)){
        let file_id = jsonController.get_file_id(url)
        let json = jsonController.get_file_by_id(file_id, FILES)

        res.end(JSON.stringify(json))
    }
}

function route_post(url, req, res, FILES){
    if(url == '/api/photos'){
        const form = formidable({multiples: true})
        form.uploadDir = 'uploads/'
        
        fileController.handle_file_upload(form, req, FILES)
    }
}

function route_delete(url, req, res, FILES){
    // /api/photos/[number]
    if(url.match(/\/api\/photos\/([0-9]+)/)){
        let file_id = jsonController.get_file_id(url)
        
        fileController.delete_file(file_id, FILES)
    }
}

function route_patch(url, req, res, FILES){
    if(url == '/api/photos'){
        jsonController.update_file(req, FILES)        
    }
}




module.exports = { route } 
