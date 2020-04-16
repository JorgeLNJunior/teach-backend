'use strict'

const Post = use('App/Models/Post')
const User = use('App/Models/User')
const Drive = use('Drive')
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
   * Show a list of all user posts.
   * GET /users/:id/posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async userPosts ({ request, response, params }) {

    const { id } = params

    const user = await User.find(id)

    if(!user) {
      return response.status(404).json({ error: 'user not found' })
    }

    const posts = await user.posts().fetch()

    return response.json({
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      posts: posts
    })

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
   * @param {AuthSession} ctx.auth
   */
  async show ({ params, request, response }) {

    const { id } = params

    const post = await Post.find(id)

    if(!post) {
      return response.status(404).json({ error: 'post not found' })
    }

    const user = await post.user().fetch()

    const comments = await post.comments().fetch()

    return response.json({
      owner_user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      post: post,
      post_comments: comments
    })

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
   * @param {AuthSession} ctx.auth
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

  /**
   * Show a list of all user posts.
   * GET /users/:id/posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async followUsersPosts ({ request, response, auth }) {

    const user_id = auth.user.id

    const user = await User.find(user_id)

    const follows = await user.follows().fetch()

    const posts = []

    for(let follow of follows.rows) {

      const usr = await User.find(follow.$attributes.followed_user_id)

      const usr_posts = await usr.posts().fetch()

      for(let received_posts of usr_posts.rows) {

        posts.push(received_posts)

      }

    }

    return response.json(posts)

  }

  /**
   * Upload video
   * POST /posts/:id/video
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async uploadVideo ({ request, response, auth, params }) {

    const { id } = request.params
    const user_id = auth.user.id

    let post = await Post.find(id)

    if(!post) {
      return response.status(404).json({ error: 'post not found' })
    }

    if(post.user_id != user_id) {
      return response.status(403).json({ error: 'unauthorized' })
    }

    let fileName = undefined

    request.multipart.file('video', {}, async (file) => {
      const name = `${new Date().getTime()}.${file.subtype}`
      await Drive.disk('azure').putStream(`videos/${name}`, file.stream)
      fileName = name
    })

    await request.multipart.process()

    const url = await Drive.disk('azure').getUrl(`videos/${fileName}`)

    post.video_content = url

    await post.save()

    return response.json({
      message: 'video uploaded',
      url: url
    })

  }

}

module.exports = PostController
