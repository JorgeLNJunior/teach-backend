'use strict'

const Comment = use('App/Models/Comment')
const Post = use('App/Models/Post')
const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  /**
   * Show a list of all comments on a post.
   * GET comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, params }) {

    const { post_id } = params

    const post = await Post.find(post_id)

    if(!post) {
      return response.status(404).json({ error: 'post not found' })
    }

    const comments = await post.comments().fetch()

    return response.json(comments)

  }

  /**
   * Create/save a new comment.
   * POST comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store ({ params, request, response, auth }) {

    const { post_id } = params
    const { content } = request.body
    const user_id = auth.user.id

    const rules = {
      content: 'required|min:1|max:800'
    }

    const validation = await validate(request.body, rules)

    if(validation.fails()) {
      return response.status(422).json({ errors: validation.messages() })
    }

    if(!await Post.find(post_id)) {
      return response.status(404).json({ error: 'post not found' })
    }

    const comment = await Comment.create({
      user_id: user_id,
      post_id: post_id,
      content: content
    })

    return response.status(201).json({
      message: 'comment created',
      comment: comment
    })
  }

  /**
   * Display a single comment.
   * GET comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {

    const { post_id, comment_id } = params

    const post = await Post.find(post_id)

    if(!post) {
      return response.status(404).json({ error: 'post not found' })
    }

    const comment = await post.comments().where('id', comment_id).fetch()

    if(comment.rows.length <= 0) {
      return response.status(404).json({ error: 'comment not found' })
    }

    return response.json(comment)

  }

  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async update ({ params, request, response, auth }) {

    const { id } = params
    const { content } = request.body
    const user_id = auth.user.id

    const rules = {
      content: 'required|min:1|max:800'
    }

    const validation = await validate(request.body, rules)

    if(validation.fails()) {
      return response.status(422).json({ errors: validation.messages() })
    }

    const comment = await Comment.find(id)

    if(!comment) {
      return response.status(404).json({ error: 'comment not found' })
    }

    if(comment.user_id != user_id) {
      return response.status(403).json({ error: 'unauthorized' })
    }

    comment.content = content

    await comment.save()

    return response.json({
      message: 'comment updated',
      comment: comment
    })

  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async destroy ({ params, request, response, auth }) {

    const { id } = params
    const user_id = auth.user.id

    const comment = await Comment.find(id)

    if(!comment) {
      return response.status(404).json({ error: 'comment not found' })
    }

    if(comment.user_id != user_id) {
      return response.status(403).json({ error: 'unauthorized' })
    }

    await comment.delete()

    return response.json({ message: 'comment deleted' })

  }
}

module.exports = CommentController
