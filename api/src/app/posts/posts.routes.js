const express = require('express')
const uuidv4 = require('uuid/v4')
const passport = require('passport')
const code = require('http-status-codes').StatusCodes

const log = require('../../config/logger')
const imageValidation = require('./posts.validate').imageValidate
const postCreateValidation = require('./posts.validate').postCreateValidation
const {
  createPost,
  getPosts,
  getFeedPost,
  addLike,
  getPostByUser,
  getPostsByUser,
  saveImage
} = require('./posts.controller')
const handleErrors = require('../../handler/errors').process
const { idValidator } = require('../../libs/mongo')
const jwtAuthenticate = passport.authenticate('jwt', { session: false })

const postRouter = express.Router()

postRouter.get(
  '/',
  handleErrors(async (req, res) => {
    const posts = await getPosts()
    return res.status(code.OK).json(posts)
  })
)

postRouter.get(
  '/explore',
  handleErrors(async (req, res) => {
    const posts = await getPosts()
    return res.status(code.OK).json(posts)
  })
)

postRouter.get(
  '/feed',
  [jwtAuthenticate],
  handleErrors(async (req, res) => {
    const queryDate = req.query.date || new Date()
    log.info('Obteniendo posts del feed', queryDate)
    const posts = await getFeedPost(req.user.id, queryDate)
    return res.status(code.OK).json(posts)
  })
)

postRouter.get(
  '/user/:id',
  [jwtAuthenticate, idValidator],
  handleErrors(async (req, res) => {
    const id = req.params.id
    log.info(`Obteniendo posts del usuario ${id}`)
    const posts = await getPostsByUser(id)
    return res.status(code.OK).json(posts)
  })
)

postRouter.get(
  '/:id',
  [jwtAuthenticate, idValidator],
  handleErrors(async (req, res) => {
    const id = req.params.id
    log.info(`Obteniendo post ${id}`)
    const post = await getPostByUser(id, req.user.id)
    if (!post) {
      return res.status(code.NOT_FOUND).json({ message: 'Post not found' })
    }
    return res.status(code.OK).json(post)
  })
)

postRouter.post(
  '/',
  [jwtAuthenticate, postCreateValidation],
  handleErrors(async (req, res) => {
    const post = await createPost(req.body, req.user.id)
    log.info('Post agregada a la colección de posts', post)
    res.status(code.CREATED).json(post)
  })
)

postRouter.post(
  '/upload',
  [jwtAuthenticate, imageValidation],
  handleErrors(async (req, res) => {
    const { user } = req
    const filename = `${uuidv4()}.${req.extension}`
    const url = await saveImage(req.body, filename)
    log.info(`${user.username} uploaded image ${filename}`)

    res.status(code.CREATED).json({
      url
    })
  })
)

module.exports = postRouter
