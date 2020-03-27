'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//Register and login routes
Route.post('/register', 'AuthController.register')

Route.post('/login', 'AuthController.login')

//Users routes
Route.group('users', () => {
  Route.resource('/users', 'UserController').apiOnly().except(['store'])
}).middleware('auth')


//Posts routes
Route.group('posts', () => {
  Route.resource('/posts', 'PostController').apiOnly()
}).middleware('auth')

//Comments routes
Route.post('/posts/:post_id/comments', 'CommentController.store').middleware('auth')

Route.get('/posts/:post_id/comments', 'CommentController.index').middleware('auth')

Route.get('/posts/:post_id/comments/:comment_id', 'CommentController.show').middleware('auth')

Route.put('/comments/:id', 'CommentController.update').middleware('auth')

Route.delete('/comments/:id', 'CommentController.destroy').middleware('auth')



