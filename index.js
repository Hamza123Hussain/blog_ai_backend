import express from 'express'
import { Port } from './Config.js'
import UserRouter from './DB/RegisterandSignInUser.js'
import UserPosts from './DB/GettingPostForUser.js'
import Create_Get_Router from './DB/GettingandCreatingPost.js'
import Updated_Delete_Router from './DB/UpdateandDeleteDoc.js'
import CommentRouter from './DB/PostingComment.js'
import cors from 'cors'
import ResetPass from './DB/PaswordReset.js'
import AI_Router from './DB/CreatingAndUpdateWithAI.js'
const App = express()

App.use(express.json())
App.use(cors())
App.use('/api/Users', UserRouter)
App.use('/api/Posts', Create_Get_Router)
App.use('/api/User', UserPosts)
App.use('/api/Update&Delete', Updated_Delete_Router)
App.use('/api/Comments', CommentRouter)
App.use('/api/ResetPass', ResetPass)
App.use('/api/AI', AI_Router)
App.listen(Port, () => {
  console.log(`RUNNING ON ${Port}`)
})
