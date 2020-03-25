'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/**
 * Controller to register, authenticate and activate user accounts
 */

class AuthController {

  /**
   * Register a user
   * POST /register
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async register({request, response}) {

    const { username, email, password } = request.body

    const rules = {
      username: 'required|unique:users|min:3|max:30',
      email: 'required|email|unique:users',
      password: 'required|min:6|max:20'
    }

    const validation = await validate(request.body, rules)

    if(validation.fails()) {
      return response.status(422).json({ errors: validation.messages() })
    }

    const user = await User.create({
      username: username,
      password: password,
      email: email
    })

    return response.status(201).json({ message: 'user registred', user: user })

  }

  /**
   * User login
   * POST /login
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async login({ request, response, auth }) {

    const { email, password } = request.body

    const token = await auth.attempt(email, password)

    return token

  }
}

module.exports = AuthController
