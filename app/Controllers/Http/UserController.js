'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {

    const users = await User.all()

    return response.json({ users: users })

  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {

    const { id } = params

    const user = await User.find(id)

    if(!user) {
      return response.status(404).json({ error: 'user not found' })
    }

    return response.json(user)

  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async update ({ params, request, response, auth }) {

    const { id } = params
    const { username, password } = request.body

    if(auth.user.id != id) {
      return response.status(403).json({ error: 'unauthorized' })
    }

    const rules = {
      username: 'unique:users|min:3|max:30',
      password: 'min:6|max:20'
    }

    const validation = await validate(request.body, rules)

    if(validation.fails()) {
      return response.status(422).json({ errors: validation.messages() })
    }

    const user = await User.find(id)

    if(username) {
      user.username = username
    }
    if(password) {
      user.password = password
    }

    await user.save()

    return response.json({
      message: 'user updated',
      user: user
    })

  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async destroy ({ params, request, response, auth }) {

    const { id } = params

    if(auth.user.id != id) {
      return response.status(403).json({ error: 'unauthorized' })
    }

    const user = await User.find(id)

    await user.delete()

    return response.json({ message: 'user deleted' })

  }
}

module.exports = UserController
