const tagsController = require('./tagsController.js')

let rawTags = [
    "#love",
    "#instagood",
    "#fashion",
    "#photooftheday",
    "#beautiful",
    "#art",
    "#photography",
    "#happy",
    "#picoftheday",
    "#cute",
    "#follow",
    "#tbt",
    "#followme",
    "#nature",
    "#like4like",
    "#travel",
    "#instagram",
    "#style",
    "#repost",
    "#summer",
    "#instadaily",
    "#selfie",
    "#me",
    "#friends",
    "#fitness",
    "#girl",
    "#food",
    "#fun",
    "#beauty",
    "#instalike",
    "#smile",
    "#family",
    "#photo",
    "#life",
    "#likeforlike",
    "#music",
    "#follow4follow",
    "#makeup",
    "#amazing",
    "#igers",
    "#nofilter",
    "#dog",
    "#model",
    "#sunset",
    "#beach",
    "#instamood",
    "#motivation"
]
let tags = tagsController.parse_raw_tags_to_json(rawTags)

let rawFilters = [
    "metadata",
    "rotate",
    "resize",
    "reformat",
    "crop",
    "grayscale",
    "flip or flop",
    "negate",
    "tint"
]

let objFilters = parse_filters_to_obj(rawFilters)

function parse_filters_to_obj(arr){
    let index = 0
    let filter_obj_arr = []

    for(let filter of arr){
        let new_obj = {
            'id': index,
            'name': filter,
            'method': ((filter == 'metadata') ? 'GET' : 'PATCH'),
            'args': 'for info what data to provide check out --> https://sharp.pixelplumbing.com/',
            'data': 'besides data, also provide image name as an id parameter in json'
        }

        filter_obj_arr.push(new_obj)
        index += 1
    }

    return filter_obj_arr
}

let user_list = []

class User {
    constructor(name, lastName, email, password){
        Object.assign(this, { name, lastName, email, password })
        this.confirmed = false 
        this.id = Date.now()

        user_list.push(this)
        console.log(user_list)
    }

}

module.exports = { rawTags, tags, rawFilters, objFilters, User, user_list }