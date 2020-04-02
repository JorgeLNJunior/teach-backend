'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowSchema extends Schema {
  up () {
    this.create('follows', (table) => {
      table.increments()
      table.integer('user_id')
        .references('id')
        .inTable('users')
        .notNullable()
        .unsigned()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('followed_user_id')
        .references('id')
        .inTable('users')
        .notNullable()
        .unsigned()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('follows')
  }
}

module.exports = FollowSchema
