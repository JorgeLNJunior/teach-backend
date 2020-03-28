'use strict'

const Like = use('App/Models/Like')
const User = use('App/Models/User')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/**
 * Resourceful controller for interacting with likes
 */
class LikeController {
  /**
   * Show a list of all likes.
   * GET likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async index ({ request, response, auth }) {

    const user = await User.find(auth.user.id)

    const likes = user.likes().fetch()

    return likes;

  }

  /**
   * Create/save a new like.
   * POST likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store ({ request, response, auth, params }) {

    const { post_id } = params
    const user_id = auth.user.id

    let like = await Database.from('likes').where({user_id: user_id, post_id: post_id})

    if(like.length > 0) {
      return response.status(422).json({ error: 'you already liked this post' })
    }

    like = await Like.create({
      user_id: user_id,
      post_id: post_id
    })

    return response.status(201).json(like)

  }

  /**
   * Display a single like.
   * GET likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Delete a like with id.
   * DELETE likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async destroy ({ params, request, response, auth }) {

    const { post_id } = params
    const user_id = auth.user.id

    let like = await Database.from('likes').where({user_id: user_id, post_id: post_id})

    if(like.length <= 0) {
      return response.status(404).json({ error: 'like not found' })
    }

    console.log(like)

    const like_id = like.map((data) => {
      return data.id
    })

    console.log(like_id)

    like = await Like.find(like_id)

    await like.delete()

    return response.json({ message: 'like removed' })

  }
}

module.exports = LikeController
