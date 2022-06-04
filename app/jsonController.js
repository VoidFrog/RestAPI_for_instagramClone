let model = require('./model.js');

function save_data_to_json(path, album, filename, original_filename, FILES){
    let time = get_timestamp()

    let history_record = {
        status: 'original',
        timestamp: time
    }
    
    
    let obj = {
        id: Date.now(),
        album: album,
        original_name: original_filename,
        current_filename: filename,
        url: path,
        last_change: 'original',
        history: [
            history_record
        ],
        tags: []
    }

    let add = true
    for(let file of FILES){
        if(file.url == obj.url){
            add = false 
        }
    }
    if(add == true){
        FILES.push(obj)
    }

}

function get_timestamp(){
    let date = new Date()
    let time = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + '-||-' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    return time
}

function get_file_id(url){
    let splitted = url.split('/')

    //console.log(splitted)
    //splitted[3] is number

    return parseInt(splitted[3])
}

function get_file_id_four_args(url){
    let splitted = url.split('/')

    //console.log(splitted)
    //splitted[4] is number

    return parseInt(splitted[4])
}

function get_file_by_id(id, FILES){
    for(let file of FILES){
        if(file.id == id){
            return file
        }
    }
}

function update_file(req, FILES){
    let body = ''
    req.on('data', function(data){
        body += data
    })

    req.on('end', function(){
        let data = JSON.parse(body)

        console.log(data)
        let file_id = data.id
        
        for(let file of FILES){
            if(file.id == file_id){
                file.last_change = data.status

                let update = {
                    status: data.status,
                    timestamp:  data.timestamp
                }

                file.history.push(update)
            }
        }
    })
}

function delete_json(file_id, FILES){
    for(let index in FILES){
        if(file_id == FILES[index].id){
            path = FILES[index].url

            console.log(FILES)
            FILES.splice(index, 1)
            
            return path
        }
    }
}

function update_tag(req, FILES){
    let body = ''
    req.on('data', function(data){
        body += data
    })

    req.on('end', function(){
        let data = JSON.parse(body)
        let file_id = data.id
        let tagname = data.name
        let popularity = data.popularity

        let file = get_file_by_id(file_id, FILES)
        let tag = {
            'name': tagname,
            'popularity': popularity
        }

        //add tag to img---------------
        let add = true 
        for(let tg of file.tags){
            if(tg.name == tag.name){
                add = false
            }
        }     
        if(add == true){
            file.tags.push(tag)
        }
        //-----------------------------

        //adding new tag to raw tags list
        let new_tag = true 
        for(let tg of model.rawTags){
            if(tg.name == tag.name){
                add = false
            }
        } 
        if(new_tag == true){
            model.rawTags.push(tag.name)

            let tg_cp = {
                'name': tag.name,
                'popularity': tag.popularity,
                'id': model.tags.length
            }
            model.tags.push(tg_cp)
        }
        //--------------------------------

    })
}

function add_tags_mass(req, FILES){
    let body = ''
    req.on('data', function(data){
        body += data
    })

    req.on('end', function(){
        let data = JSON.parse(body)
        let file_id = data.id
        let file = get_file_by_id(file_id, FILES)

        for(let tag of data.tags){
            
            let tagname = tag.name
            let popularity = tag.popularity

            let new_tag = {
                'name': tagname,
                'popularity': popularity
            }

            //add tag to img---------------
            let add = true 
            for(let tg of file.tags){
                if(tg.name == new_tag.name){
                    add = false
                }
            }     
            if(add == true){
                file.tags.push(new_tag)
            }
            //-----------------------------

            //adding new tag to raw tags list
            let is_new = true 
            for(let tg of model.rawTags){
                if(tg.name == new_tag.name){
                    is_new = false
                }
            } 
            if(is_new == true){
                model.rawTags.push(new_tag.name)

                let tg_cp = {
                    'name': new_tag.name,
                    'popularity': new_tag.popularity,
                    'id': model.tags.length
                }
                model.tags.push(tg_cp)
            }
            //--------------------------------
        }
    })
}

function update_file_history(id, FILES, filter_type, new_path){    
    for(let file of FILES){
        if(file.id == id){
            file.last_change = filter_type

            let update = {
                status: filter_type,
                timestamp:  get_timestamp(),
                url: new_path
            }

            file.history.push(update)
        }
    }

}

function get_file_id_and_filter(url){
    let splitted = url.split('/')

    //console.log(splitted)
    //splitted[4] is number
    //splitted[5] is filter
    let data = []
    data.push(parseInt(splitted[4]))
    data.push(splitted[5])
    console.log(splitted, data)
    return data
}



module.exports = { save_data_to_json, get_file_by_id, get_file_id, get_file_id_four_args, update_file, delete_json, update_tag, add_tags_mass, update_file_history, get_file_id_and_filter }