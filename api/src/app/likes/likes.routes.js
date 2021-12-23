const express = require('express')
const passport = require('passport')
const log = require('../../config/logger')
const code = require('http-status-codes').StatusCodes
const likesController = require('./likes.controller')
const handleErrors = require('../../handler/errors').process
const { idValidator } = require('../../libs/mongo')
const jwtAuthenticate = passport.authenticate('jwt', { session: false })

const likeRouter = express.Router()

likeRouter.get(
  '/',
  handleErrors(async (req, res) => {
    const likes = await likesController.getLikes()
    return res.status(code.OK).json(likes)
  })
)

likeRouter.get(
  '/:id/ledilike',
  [jwtAuthenticate, idValidator],
  handleErrors(async (req, res) => {
    const postId = req.params.id
    log.info(`Obteniendo todos los likes de la publicación ${postId}`)
    const like = await likesController.getLikesByPostAndUser(
      postId,
      req.user.id
    )
    return res.status(code.OK).json({ ledilike: !!like })
  })
)

likeRouter.get(
  '/:id/by-user',
  [jwtAuthenticate, idValidator],
  handleErrors(async (req, res) => {
    const postId = req.params.id
    log.info(`Obteniendo todos los likes de la publicación ${postId}`)
    const likes = await likesController.getLikes(postId)
    return res.status(code.OK).json(likes)
  })
)

likeRouter.post(
  '/:id',
  [jwtAuthenticate, idValidator],
  handleErrors(async (req, res) => {
    const postId = req.params.id
    log.info(`Creando like para la publicación ${postId}`)
    const like = await likesController.addLike(postId, req.user.id)
    log.info(`Like creado: ${like}`)
    return res.status(code.CREATED).json(like)
  })
)

likeRouter.delete(
  '/:id',
  [jwtAuthenticate, idValidator],
  handleErrors(async (req, res) => {
    const postId = req.params.id
    log.info(`Eliminando like para la publicación ${postId}`)
    const like = await likesController.removeLike(postId, req.user.id)
    log.info(`Like eliminado: ${like}`)
    return res.status(code.ACCEPTED).json(like)
  })
)

module.exports = likeRouter
