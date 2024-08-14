import express from 'express'
import { Port } from './Config.js'
import UserRouter from './DB/RegisterandSignInUser.js'
import UserPosts from './DB/GettingPostForUser.js'
import Create_Get_Router from './DB/GettingandCreatingPost.js'

const App = express()

App.use(express.json())

App.use('/api/Users', UserRouter)
App.use('/api/Posts', Create_Get_Router)
App.use('/api/User', UserPosts)

App.listen(Port, () => {
  console.log(`RUNNING ON ${Port}`)
})
