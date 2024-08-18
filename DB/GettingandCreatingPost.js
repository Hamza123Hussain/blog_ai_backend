import express from 'express'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { db, Storage } from '../FireBaseConfig.js'
import multer from 'multer'
import { ref, uploadBytes } from 'firebase/storage'

const Create_Get_Router = express.Router()

// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() })

Create_Get_Router.post('/', upload.single('BlogImage'), async (req, res) => {
  const randomId = uuidv4()

  try {
    const { text, Name, title, email, UserImage } = req.body
    const BlogImage = req.file
    let BlogImageURL = ''

    if (BlogImage) {
      const imagePath = `BLOGIMAGES/${email}/${BlogImage.originalname}`
      const BlogImageRef = ref(Storage, imagePath)
      const imageBuffer = BlogImage.buffer
      await uploadBytes(BlogImageRef, imageBuffer)
      BlogImageURL = await getDownloadURL(BlogImageRef)
    }

    const docRef = doc(db, 'Posts', randomId)

    await setDoc(docRef, {
      Title: title,
      CreatedBy: email,
      UserName: Name,
      PostID: randomId,
      Text: text,
      comments: [],
      CreatedAt: Date.now(),
      UserImage,
      BlogImageURL: BlogImageURL || '',
      // likes: [], future work
    })

    res.status(201).json(true)
  } catch (error) {
    console.error('Error adding post:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    })
  }
})

Create_Get_Router.get('/GetAll', async (_, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'Posts'))

    const posts = []
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() })
    })

    if (posts.length > 0) {
      return res.status(200).json(posts)
    } else {
      return res.status(404).json({ message: 'No data exists' })
    }
  } catch (error) {
    console.error('Error retrieving posts:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    })
  }
})

export default Create_Get_Router
