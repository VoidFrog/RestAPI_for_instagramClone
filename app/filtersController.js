const sharp = require('sharp')
const model = require('./model.js')
const jsonController = require('./jsonController')

function get_filters_info(){
    return model.objFilters
}

async function get_metadata(url, FILES){
    let id = jsonController.get_file_id_four_args(url)
    let file = jsonController.get_file_by_id(id, FILES)
    let path = file.url

    let metadata = await serve_metadata(path)

    return metadata
}

async function serve_metadata(path){
    console.log(path)
    return new Promise(async (resolve, reject) => {
        try {
            if(path){
                let metadata = await sharp(path).metadata()
                resolve(metadata)
            }
            else{
                resolve('url/path not found')
            }
        } catch (err) {
            reject(err.message)
        }
    })
}

async function apply_filter(url, req, FILES){
    let body = ""
    req.on('data', function(data){
        body += data
    })

    req.on('end', async function(){
        let data = JSON.parse(body)
        let file = jsonController.get_file_by_id(data.id, FILES)
        let path = file.url

        let filter_type = data.name
        let args = data.args
        await choose_filter(filter_type, args, path, data.id, FILES)

    })
}

async function choose_filter(filter_type, args, path, id, FILES){
    if(filter_type == "flip" || filter_type == "flop"){
        filter_type = "flip"
    }
    
    let new_path = path.substring(0, path.length-4)
    switch(filter_type){
        case "rotate":
            let angle = args[0]
            new_path += `-rotated.jpg`

            await sharp(path)
                  .rotate(angle)
                  .toFile(new_path)
            jsonController.update_file_history(id, FILES, filter_type, new_path)
            break

        case "resize":
            let width = args[0]
            let height = args[1]
            new_path += `-resized.jpg`
            await sharp(path)
                  .resize({
                      width:width,
                      height:height
                  })
                  .toFile(new_path)
            jsonController.update_file_history(id, FILES, filter_type, new_path)
            break

        case "reformat":
            let format = args[0]
            new_path += `-reformatted.${format}`
            await sharp(path)
                  .toFormat(format)
                  .toFile(new_path)
            jsonController.update_file_history(id, FILES, filter_type, new_path)
            break

        case "crop":
            let w = args[0]
            let h = args[1]
            let left = args[2]
            let right = args[3]
            new_path += `-cropped.jpg`
            await sharp(path)
                  .extract({width:w, height:h, left: left, right:right})
                  .toFile(new_path)
            jsonController.update_file_history(id, FILES, filter_type, new_path)
            break

        case "grayscale":
            new_path += `-grayscale.jpg`
            await sharp(path)
                  .grayscale()
                  .toFile(new_path)
            jsonController.update_file_history(id, FILES, filter_type, new_path)
            break

        case "flip":
            new_path += `-flipped.jpg`
            await sharp(path)
                  .flip()
                  .toFile(new_path)
            jsonController.update_file_history(id, FILES, filter_type, new_path)
            break

        case "negate":
            new_path += `-negate.jpg`
            await sharp(path)
                  .negate()
                  .toFile(new_path)
            jsonController.update_file_history(id, FILES, filter_type, new_path)
            break

        case "tint":
            let r = args[0]
            let g = args[1]
            let b = args[2]
            new_path += `-tint.jpg`
            await sharp(path)
                  .tint({r:r, g:g, b:b})
                  .toFile(new_path)
            jsonController.update_file_history(id, FILES, filter_type, new_path)
            break
    }
}

module.exports = { get_filters_info, get_metadata, apply_filter }