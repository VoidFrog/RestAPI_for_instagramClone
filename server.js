const http = require('http')
const PORT = 3000
const imageRouter = require('./app/imageRouter.js')
const tagsRouter = require('./app/tagsRouter.js')

const FILES = []

let server = http.createServer(async (req, res) => {
    console.log(`METHOD: ${req.method}\n URL: ${req.url}`) 

    //router for imgs
    if(req.url.search('/api/photos') != -1){
        await imageRouter.route(req, res, FILES)
    }
    //router for img tags
    else if(req.url.search('/api/tags') != -1){
        await tagsRouter.route(req, res, FILES)
    }
})
.listen(PORT, () => console.log(`server is running on port: ${PORT}`))