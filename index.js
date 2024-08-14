import express from 'express'
import { Port } from './Config.js'
import UserRouter from './DB/RegisterandSignInUser.js'

const App = express()

App.use(express.json())

App.use('/api/Users', UserRouter)

App.listen(Port, () => {
  console.log(`RUNNING ON ${Port}`)
})
