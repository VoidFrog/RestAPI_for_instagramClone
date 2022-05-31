let fileController = require('./fileController.js');

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
        url: path,
        last_change: 'original',
        history: [
            history_record
        ]
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

module.exports = { save_data_to_json, get_file_by_id, get_file_id, update_file, delete_json }