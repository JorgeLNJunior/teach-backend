'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })

    /**
     * A hook to auto generate user activation code
     * before create a user
     */
    this.addHook('beforeCreate', async (userInstance) => {
      userInstance.activation_code = Math.floor(1000 + Math.random() * 9000)
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  /**
   * Posts relationship
   *
   * @method posts
   *
   * @return {Object}
   */
  posts () {
    return this.hasMany('App/Models/Post')
  }

  /**
   * User relationship
   *
   * @method user
   *
   * @return {Object}
   */
  comments () {
    return this.hasMany('App/Models/Comment')
  }

  /**
   * Likes relationship
   *
   * @method likes
   *
   * @return {Object}
   */
  likes () {
    return this.hasMany('App/Models/Like')
  }

  /**
   * Follow relationship
   *
   * @method follow
   *
   * @return {Object}
   */
  follows() {
    return this.hasMany('App/Models/Follow')
  }
}

module.exports = User
