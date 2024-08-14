import express from 'express'
import { Port } from './Config.js'
import UserRouter from './DB/RegisterandSignInUser.js'
import Create_Update_Router from './DB/PostCreateandUpdate.js'

const App = express()

App.use(express.json())

App.use('/api/Users', UserRouter)
App.use('/api/Posts', Create_Update_Router)

App.listen(Port, () => {
  console.log(`RUNNING ON ${Port}`)
})
