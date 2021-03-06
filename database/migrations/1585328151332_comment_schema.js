'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.integer('user_id')
        .references('id')
        .inTable('users')
        .unsigned()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('post_id')
        .references('id')
        .inTable('posts')
        .unsigned()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('content', 800).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
