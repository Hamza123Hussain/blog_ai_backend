import express from 'express'
import { CodeController } from '../Controllers/GeneratingCode.js'
const CodeRouter = express.Router()

CodeRouter.post('/', CodeController)

export default CodeRouter
