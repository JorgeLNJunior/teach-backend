'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users').unsigned().notNullable()
      table.integer('post_id').references('id').inTable('posts').unsigned().notNullable()
      table.string('content', 800).notNullable()
      table.integer('likes').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
