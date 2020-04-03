'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {

  /**
   * User relationship
   *
   * @method user
   *
   * @return {Object}
   */
  user() {
    return this.belongsTo('App/Models/User')
  }

  /**
   * Comment relationship
   *
   * @method comments
   *
   * @return {Object}
   */
  comments() {
    return this.hasMany('App/Models/Comment')
  }

  /**
   * Likes relationship
   *
   * @method user
   *
   * @return {Object}
   */
  likes() {
    return this.hasMany('App/Models/Like')
  }
}

module.exports = Post
