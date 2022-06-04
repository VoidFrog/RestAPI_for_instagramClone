let formidable = require('formidable')
const fileController = require('./fileController.js')
const jsonController = require('./jsonController.js')

async function route(req, res, FILES){
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

async function route_get(url, req, res, FILES){
    if(url == '/api/photos'){
        res.end(JSON.stringify(FILES))
    }
    // /api/photos/[number]
    else if(url.match(/\/api\/photos\/([0-9]+)/)){
        let file_id = jsonController.get_file_id(url)
        let json = jsonController.get_file_by_id(file_id, FILES)

        res.end(JSON.stringify(json))
    }
    else if(url.match(/\/api\/photos\/tags\/([0-9]+)/)){
        let file_id = jsonController.get_file_id_four_args(url)
        let file = jsonController.get_file_by_id(file_id, FILES)

        let json = {
            id: file.id,
            tags: file.tags
        }

        res.end(JSON.stringify(json))
    }
    // /api/photos/uploads/[id:number]/[filter]
    else if(url.search('/api/photos/uploads/') != -1){
        let id_and_filter = jsonController.get_file_id_and_filter(url)
        let id = id_and_filter[0]
        let filter = id_and_filter[1]

        let file = await fileController.get_file(req, url, id, filter, FILES)
        if(file){
            res.writeHead(200, {'Content-Type':`image/jpg`})
            res.write(file)
            res.end()
        }
        else {
            console.error('photo not found');
            res.writeHead(404, { 'Content-Type': "text/html" });
            res.write("Not found");
            res.end();
        }

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
    else if(url == '/api/photos/tags'){
        //gets id, tagname, popularity
        jsonController.update_tag(req, FILES)
    }
    else if(url == '/api/photos/tags/mass'){
        //gets id, array<tags>[]
        jsonController.add_tags_mass(req, FILES)
    }
}




module.exports = { route } 
