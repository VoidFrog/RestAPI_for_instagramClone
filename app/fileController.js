let fs = require('fs')
let jsonController = require('./jsonController.js')

function handle_file_upload(form, req, FILES){
    let filename;
    let path;
    let album;
    let original_filename;

    form.parse(req, function (err, fields, files) {
        //console.log('wszystkich bajtów w formularzu:' + form.bytesExpected + " / " + form.bytesReceived + " bytes");
        //console.log(files,fields)

        filename = Object.keys(files)[0]
        let file = files[filename]
        original_filename = file.name
        path = file.path
        album = fields.album
        
        //console.log(file, path, filename, fields.album)

        mkdir_and_rename_file(path, album, filename, original_filename, FILES)           
    })

}

function mkdir_and_rename_file(path, album, filename, original_filename, FILES){
    let new_path = `./uploads/${album}/${filename}.jpg`
    
    if(!fs.existsSync(`./uploads/${album}`)){
        fs.mkdirSync(`./uploads/${album}`)

        rename_file(path, album, filename)
        jsonController.save_data_to_json(new_path, album, filename, original_filename, FILES)
    }
    else {
        rename_file(path, album, filename)
        jsonController.save_data_to_json(new_path, album, filename, original_filename, FILES)
    }
}

function rename_file(path, album, filename){
    fs.rename(path, `./uploads/${album}/${filename}.jpg`, function(err){
        if (err) throw err 

    }) 
}

function delete_file(file_id, FILES){
    let path = jsonController.delete_json(file_id, FILES)

    if(path != undefined || path != null){
        fs.unlink(path, (err) => {
            if (err) throw err
        })
    }   
}

function get_file(req, url, id, filter, FILES){
    let file = jsonController.get_file_by_id(id, FILES)
    
    if(file){
        let history = file.history
        let searched_path;

        
        for(let record of history){
            if(record.status == filter){
                searched_path = record.url
            }
        }
        
        console.log(searched_path, filter)
        
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(searched_path, function (error, data) {
                    resolve(data);
                })
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = { handle_file_upload, delete_file, get_file }