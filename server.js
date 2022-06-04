require('dotenv').config()

const http = require('http')
const imageRouter = require('./app/imageRouter.js')
const tagsRouter = require('./app/tagsRouter.js')
const filtersRouter = require('./app/filtersRouter.js')
const userRouter = require('./app/userRouter.js')

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
    else if(req.url.search('/api/filters') != -1){
        await filtersRouter.route(req, res, FILES)
    }
    else if(req.url.search('/api/user') != -1){
        await userRouter.route(req, res)
    }
})
.listen(process.env.APP_PORT, () => console.log(`server is running on port: ${process.env.APP_PORT}`))

