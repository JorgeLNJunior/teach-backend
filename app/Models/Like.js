'use strict'
const Post = use('App/Models/Post')
const Database = use('Database')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Like extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to increment like on the post
     */
    this.addHook('afterCreate', async (likeInstance) => {

      const post = await Post.find(likeInstance.post_id)
      post.likes ++
      await post.save()

    })

    /**
     * A hook to remove like on the post
     */
    this.addHook('afterDelete', async (likeInstance) => {

      const post = await Post.find(likeInstance.post_id)
      post.likes --
      await post.save()

    })

  }

  /**
   * User relationship
   *
   * @method user
   *
   * @return {Object}
   */
  user() {
    this.hasOne('App/Models/User')
  }

  /**
   * Post relationship
   *
   * @method user
   *
   * @return {Object}
   */
  post() {
    this.hasOne('App/Model/Post')
  }
}

module.exports = Like
