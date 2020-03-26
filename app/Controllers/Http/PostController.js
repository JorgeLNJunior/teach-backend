'use strict'

const Post = use('App/Models/Post')
const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {

    const posts = await Post.all()

    return response.json(posts)

  }

  /**
   * Create/save a new post.
   * POST posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store ({ request, response, auth }) {

    const { title, content } = request.body

    const rules = {
      title: 'min:5|max:80',
      content: 'min:10|max:2500'
    }

    const validation = await validate(request.body, rules)

    if(validation.fails()) {
      return response.status(422).json({ errors: validation.messages() })
    }

    const post = await Post.create({
      user_id: auth.user.id,
      title: title,
      content: content
    })

    return response.status(201).json(post)

  }

  /**
   * Display a single post.
   * GET posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {

    const { id } = params

    const post = await Post.find(id)

    return response.json(post)

  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async update ({ params, request, response, auth }) {

    const { title, content } = request.body
    const { id } = params

    const post = await Post.find(id)

    if(!post) {
      return response.status(404).json({ error: 'post not found '})
    }

    if(auth.user.id != post.user_id) {
      return response.status(403).json({ error: 'unauthorized' })
    }

    const rules = {
      title: 'min:5|max:80',
      content: 'min:10|max:2500'
    }

    const validation = await validate(request.body, rules)

    if(validation.fails()) {
      return response.status(422).json({ errors: validation.messages() })
    }

    if(title) {
      post.title = title
    }
    if(content) {
      post.content = content
    }

    await post.save()

    return response.json({
      message: 'post updated',
      post: post
    })

  }

  /**
   * Delete a post with id.
   * DELETE posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {

    const { id } = params

    const post = await Post.find(id)

    if(!post) {
      return response.status(404).json({ error: 'post not found '})
    }

    if(auth.user.id != post.user_id) {
      return response.status(403).json({ error: 'unauthorized' })
    }

    await post.delete()

    return response.json({ message: 'post deleted' })

  }
}

module.exports = PostController
