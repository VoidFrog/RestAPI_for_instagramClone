function parse_raw_tags_to_json(raw_tags){
    let object_tags = []
    for(let index in raw_tags){
        let tag = {
            'id': index,
            'name': raw_tags[index],
            'popularity': Math.round(Math.random()*1000)
        }

        object_tags.push(tag)
    }

    return object_tags    
}

function get_tag_id(url){
    let splitted = url.split('/')

    //console.log(splitted)
    //splitted[3] is number

    return parseInt(splitted[3])
}

function get_tag_by_id(id, raw_tags){
    if(id > raw_tags.length-1){
        return "id out of boundary"
    }
    
    let obj_arr = parse_raw_tags_to_json([raw_tags[id]])
    let tag_obj = obj_arr[0]

    tag_obj.id = id
    return tag_obj
    
}

function add_tag(RAW_TAGS, OBJ_TAGS, req){
    let body = ''
    req.on('data', function(data){
        body += data
    })

    req.on('end', function(){
        let data = JSON.parse(body)       
        let id = RAW_TAGS.length
        
        let new_tag = {
            'id': id,
            'name': data.name,
            'popularity': data.popularity
        }

        for(let tag of RAW_TAGS){
            if(tag == data.name){
                return
            }
        }

        RAW_TAGS.push(data.name)
        OBJ_TAGS.push(new_tag)
    })
}

module.exports = { parse_raw_tags_to_json, get_tag_id, get_tag_by_id, add_tag }