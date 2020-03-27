'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {

  /**
   * User relationship
   *
   * @method users
   *
   * @return {Object}
   */
  user() {
    return this.belongsTo('App/Models/User')
  }

  /**
   * Post relationship
   *
   * @method posts
   *
   * @return {Object}
   */
  post() {
    return this.belongsTo('App/Models/Post')
  }
}

module.exports = Comment
