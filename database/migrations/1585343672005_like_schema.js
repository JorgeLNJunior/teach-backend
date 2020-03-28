'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LikeSchema extends Schema {
  up () {
    this.create('likes', (table) => {
      table.increments()
      table.integer('user_id')
        .references('id')
        .inTable('users')
        .notNullable()
        .unsigned()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('post_id')
        .references('id')
        .inTable('posts')
        .notNullable()
        .unsigned()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('likes')
  }
}

module.exports = LikeSchema
