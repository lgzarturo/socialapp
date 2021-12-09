const express = require('express')
const uuidv4 = require('uuid/v4')
const passport = require('passport')
const code = require('http-status-codes').StatusCodes

const log = require('../../config/logger')
const imageValidation = require('./posts.validate').imageValidate
const postCreateValidation = require('./posts.validate').postCreateValidation
const saveImage = require('./posts.controller').saveImage
const createPost = require('./posts.controller').createPost
const handleErrors = require('../../handler/errors').process
const jwtAuthenticate = passport.authenticate('jwt', { session: false })

const postRouter = express.Router()

postRouter.post(
  '/',
  [jwtAuthenticate, postCreateValidation],
  handleErrors(async (req, res) => {
    const post = await createPost(req.body, req.user.id)
    log.info('Post agregada a la colección de posts', post)
    res.status(code.CREATED).json(post)
  })
)

postRouter.get(
  '/feed',
  [jwtAuthenticate],
  handleErrors(async (req, res) => {
    const queryDate = req.query.date || new Date()
    log.info('Obteniendo posts del feed', queryDate)
    const posts = await req.user.getFeed(req.user.id, queryDate)
    res.status(code.OK).json(posts)
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
