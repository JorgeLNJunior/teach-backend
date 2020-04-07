'use strict'

const Like = use('App/Models/Like')
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/**
 * Resourceful controller for interacting with likes
 */
class LikeController {
  /**
   * Show a list of all user likes.
   * GET /users/:id/likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async userLikes ({ request, response, params }) {

    const { id } = params

    const user = await User.find(id)

    if(!user) {
      return response.status(404).json({ error: 'user not found' })
    }

    const likes = await user.likes().fetch()

    return response.json(likes);

  }

  /**
   * Show a list of all post likes.
   * GET /posts/:id/likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async postLikes ({ request, response, params }) {

    const { id } = params

    const post = await Post.find(id)

    if(!post) {
      return response.status(404).json({ error: 'post not found' })
    }

    const likes = await post.likes().fetch()

    return response.json(likes);

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

    if(! await Post.find(post_id)) {
      return response.status(404).json({ error: 'post not found' })
    }

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

    if(! await Post.find(post_id)) {
      return response.status(404).json({ error: 'post not found' })
    }

    let like = await Database.from('likes').where({user_id: user_id, post_id: post_id})

    if(like.length <= 0) {
      return response.status(404).json({ error: 'like not found' })
    }

    const like_id = like.map((data) => {
      return data.id
    })

    like = await Like.find(like_id)

    await like.delete()

    return response.json({ message: 'like removed' })

  }
}

module.exports = LikeController
