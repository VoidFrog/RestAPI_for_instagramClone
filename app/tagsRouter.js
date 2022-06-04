const tagsController = require('./tagsController.js')
const tags = require('./model.js')

//tags in object format


function route(req, res, FILES){
    let url = req.url 
    let method = req.method

    console.log(FILES)

    if(method == 'GET'){
        route_get(url, res)
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

function route_get(url, res){
    if(url == '/api/tags/raw'){
        res.end(JSON.stringify(tags.rawTags))
    }
    else if(url == '/api/tags'){
        res.end(JSON.stringify(tags.tags))
    }
    else if(url.match(/\/api\/tags\/([0-9]+)/)){
        let tag_id = tagsController.get_tag_id(url)
        let json = tags.tags[tag_id]

        res.end(JSON.stringify(json))
    }
}

function route_post(url, req, res, FILES){
    if(url == '/api/tags'){
        tagsController.add_tag(tags.rawTags, tags.tags, req)
    }
}

function route_delete(url, req, res, FILES){

}

function route_patch(url, req, res, FILES){

}





module.exports = { route }