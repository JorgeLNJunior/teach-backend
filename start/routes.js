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

//Likes routes
Route.post('/posts/:post_id/likes', 'LikeController.store').middleware('auth')

Route.get('/likes', 'LikeController.index').middleware('auth')

Route.delete('/posts/:post_id/likes', 'LikeController.destroy').middleware('auth')

//Follow routes
Route.post('users/follows/:followed_user_id', 'FollowController.store').middleware('auth')

Route.delete('users/follows/:followed_user_id', 'FollowController.destroy').middleware('auth')

Route.get('users/:user_id/follows', 'FollowController.index').middleware('auth')




