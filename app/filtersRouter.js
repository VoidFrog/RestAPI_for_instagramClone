const filtersController = require('./filtersController.js');

async function route(req, res, FILES){
    url = req.url
    method = req.method

    if(method == "GET"){
        await route_get(url, res, FILES)
    }
    else if(method == "PATCH"){
        route_patch(url, req, res, FILES)
    }
}

async function route_get(url, res, FILES){
    if(url == '/api/filters'){

        let json = filtersController.get_filters_info()
        res.end(JSON.stringify(json))
    }
    else if(url.match(/\/api\/filters\/metadata\/([0-9]+)/)){
        
        let json = await filtersController.get_metadata(url, FILES)
        res.end(JSON.stringify(json))
    }
    
    //TODO: route getting img with filter by id
}

function route_patch(url, req, res, FILES){
    if(url == '/api/filters'){
        filtersController.apply_filter(url, req, FILES)
    }
}

module.exports = { route }