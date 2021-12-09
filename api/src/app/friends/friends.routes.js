const express = require('express')
const passport = require('passport')

const code = require('http-status-codes').StatusCodes
const log = require('../../config/logger')
const { idValidator } = require('../../libs/mongo')
const friendController = require('./friends.controller')
const handleErrors = require('../../handler/errors').process
const jwtAuthenticate = passport.authenticate('jwt', { session: false })

const friendRouter = express.Router()

friendRouter.get(
  '/',
  jwtAuthenticate,
  handleErrors(async (req, res) => {
    const friends = await friendController.getFriends()
    res.status(code.OK).json(friends)
  })
)

friendRouter.get(
  '/:id/follow',
  [jwtAuthenticate, idValidator],
  handleErrors(async (req, res) => {
    const friend = await friendController.getFriend(req.user.id, req.params.id)
    log.info(`${req.user.id} is following ${req.params.id}`)
    res.status(code.OK).json({ follower: !!friend })
  })
)

friendRouter.post(
  '/:id/following',
  [jwtAuthenticate, idValidator],
  handleErrors(async (req, res) => {
    const friend = await friendController.createFriend(
      req.user.id,
      req.params.id
    )
    log.info(`${req.user.id} is following ${req.params.id}`)
    res.status(code.CREATED).json(friend)
  })
)

friendRouter.delete(
  '/:id/delete',
  [jwtAuthenticate, idValidator],
  handleErrors(async (req, res) => {
    const friend = await friendController.deleteFriend(
      req.user.id,
      req.params.id
    )
    log.info(`${req.user.id} is not following ${req.params.id}`)
    res.status(code.OK).json(friend)
  })
)

module.exports = friendRouter
