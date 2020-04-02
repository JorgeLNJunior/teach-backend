'use strict'

const Follow = use('App/Models/Follow')
const User = use('App/Models/User')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/**
 * Resourceful controller for interacting with follows
 */
class FollowController {
  /**
   * Show a list of all follows.
   * GET follows
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async index ({ request, response, params, auth }) {

    const { user_id } = params

    const user = await User.find(user_id)

    if(!user) {
      return response.status(404).json({ error: 'user not found' })
    }

    const follows = await user.follows().fetch()

    return response.json(follows)

  }

  /**
   * Create/save a new follow.
   * POST follows
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store ({ request, response, auth, params }) {

    const { followed_user_id } = params
    const user_id = auth.user.id

    if(followed_user_id == user_id) {
      return response.status(422).json({ error: 'impossible to follow yourself' })
    }

    const followed_user_exists = await User.find(followed_user_id)

    if(!followed_user_exists) {
      return response.status(422).json({ error: 'user not found' })
    }

    let follow = await Database.from('follows').where({
      user_id: user_id,
      followed_user_id: followed_user_id
    })

    if(follow.length > 0) {
      return response.status(422).json({ error: 'you already follow this user' })
    }

    follow = await Follow.create({
      user_id: user_id,
      followed_user_id: followed_user_id
    })

    return response.status(201).json(follow)

  }

  /**
   * Display a single follow.
   * GET follows/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Delete a follow with id.
   * DELETE follows/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async destroy ({ params, request, response, auth }) {

    const { followed_user_id } = params
    const user_id = auth.user.id

    const result = await Database.table('follows').where({
      user_id: user_id,
      followed_user_id: followed_user_id
    }).delete()


    if(result === 0) {
      return response.status(422).json({ error: `you don't follow this user` })
    }

    return response.json({ mesage: 'you are no longer following this user' })

  }
}

module.exports = FollowController
