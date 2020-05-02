'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const UserService = require('../../Services/UserRegistration')
const Hash = use('Hash')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
/** @typedef {import('@adonisjs/framework/src/Hash')} Hash */

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

    const { username, email, password, age } = request.body

    const rules = {
      username: 'required|unique:users|min:3|max:30',
      email: 'required|email|unique:users',
      password: 'required|min:6|max:20',
      age: 'required|above:11'
    }

    const validation = await validate(request.body, rules)

    if(validation.fails()) {
      return response.status(422).json({ errors: validation.messages() })
    }

    const user = await User.create({
      username: username,
      password: password,
      email: email,
      age: age
    })

    const mailSend = new UserService(user)

    mailSend.sendVerificationEmail()

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

    const user = await User.findBy('email', email)

    if(!user.is_activated) {
      return response.status(403).json({ error: 'account not activated, please check your email' })
    }

    return token

  }

  /**
   * Activate user account
   * GET /activate
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async activate({ request, response }) {

    const { id, code } = request.all()

    const user = await User.find(id)

    if(!user) {
      return response.status(404).json({ error: 'user not found' })
    }

    if(user.activation_code != code) {
      return response.status(422).json({ error: 'invalid code' })
    }

    user.is_activated = true

    await user.save()

    return response.json({ message: 'account activated' })

  }

  /**
   * Recovery user password
   * POST /password-recovery?email=email
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async passwordRecovery({ request, response }) {

    //Ler observações do arquivo /resources/MailTemplates.js

    const { email } = request.get()

    const rules = {
      email: 'required|email',
    }

    const validation = await validate(email, rules)

    if(validation.fails()) {
      return response.status(422).json({ errors: validation.messages() })
    }

    const user = await User.findBy('email', email)

    if(!user) {
      return response.status(422).json({ error: 'user not found' })
    }

    const mailSend = new UserService(user)

    mailSend.sendPasswordRecoveryEmail()

    return response.json({ message: 'please follow the instructions sent to your email' })

  }

  /**
   * Replace user password
   * POST /replace-password?oldpass=pass&newpass=pass&id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async replacePassword({ request, response }) {

    const { id, oldpass, newpass } = request.get()

    const rules = {
      newpass: 'required|min:6|max:20',
    }

    const validation = await validate(newpass, rules)

    if(validation.fails()) {
      return response.status(422).json({ errors: validation.messages() })
    }

    const user = await User.find(id)

    if(!user) {
      return response.status(422).json({ error: 'user not found' })
    }

    const isSame = await Hash.verify(oldpass, user.password)

    if(!isSame) {
      return response.status(422).json({ error: 'wrong old password'})
    }

    user.password = newpass

    await user.save()

    return response.json({ message: 'password updated'})

  }

}

module.exports = AuthController
