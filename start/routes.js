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
  Route.resource('/users', 'UserController').apiOnly().except(['store']).except('index')
}).middleware('auth')


//Posts routes
Route.group('posts', () => {
  Route.resource('/posts', 'PostController').apiOnly().except('index')
}).middleware('auth')

//list all user posts
Route.get('/users/:id/posts', 'PostController.userPosts').middleware('auth')

//list all follow users posts
Route.get('/follows/posts', 'PostController.followUsersPosts').middleware('auth')


//Comments routes
//insert a comment
Route.post('/posts/:post_id/comments', 'CommentController.store').middleware('auth')

//show a comment
Route.get('/comments/:id', 'CommentController.show').middleware('auth')

//update a comment
Route.put('/comments/:id', 'CommentController.update').middleware('auth')

//delete a comment
Route.delete('/comments/:id', 'CommentController.destroy').middleware('auth')

//list all comments on a post
Route.get('/posts/:post_id/comments', 'CommentController.postComments').middleware('auth')


//Likes routes
//insert a like on a post
Route.post('/posts/:post_id/likes', 'LikeController.store').middleware('auth')

//remove a like on a post
Route.delete('/posts/:post_id/likes', 'LikeController.destroy').middleware('auth')

//list all user likes
Route.get('/users/:id/likes', 'LikeController.userLikes').middleware('auth')

//list all post likes
Route.get('/posts/:id/likes', 'LikeController.postLikes').middleware('auth')


//Follow routes
//follow a user
Route.post('/users/follows/:followed_user_id', 'FollowController.store').middleware('auth')

//unfollow a user
Route.delete('/users/follows/:followed_user_id', 'FollowController.destroy').middleware('auth')

//list all user follows
Route.get('/users/:user_id/follows', 'FollowController.index').middleware('auth')




