import express from 'express'
import { Port } from './Config.js'

const App = express()

App.use(express.json())

App.listen(Port, () => {
  console.log(`RUNNING ON ${Port}`)
})
