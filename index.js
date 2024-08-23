import express from 'express'
import { Port } from './Config.js'
import cors from 'cors'
import AI_Router from './DB/CreatingAndUpdateWithAI.js'
import UserRouter from './DB/RegisterandSignInUser.js'
import ResetPass from './DB/PaswordReset.js'
import CommentRouter from './DB/PostingComment.js'
import Create_Get_Router from './DB/GettingandCreatingPost.js'
import Get_router from './DB/GettingDoc.js'
import Updated_Delete_Router from './DB/UpdateandDeleteDoc.js'
import UserPosts from './DB/GettingPostForUser.js'

const App = express()

App.use(express.json())
App.use(cors())
App.use('/api/AI', AI_Router)
App.use('/api/Users', UserRouter)
App.use('/api/User', UserPosts)
App.use('/api/ResetPass', ResetPass)
App.use(`/api/Posts`, Create_Get_Router)
App.use('/api/Comments', CommentRouter)
App.use('/Api/Get', Get_router)
App.use('/api/Update&Delete', Updated_Delete_Router)
App.listen(Port, () => {
  console.log(`RUNNING ON ${Port}`)
})
