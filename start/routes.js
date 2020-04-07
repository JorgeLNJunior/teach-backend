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

  //upload user avatar
  Route.post('/users/avatar', 'UserController.uploadAvatar')

}).middleware('auth')


//Posts routes
Route.group('posts', () => {

  Route.resource('/posts', 'PostController').apiOnly().except('index')

  //list all user posts
  Route.get('/users/:id/posts', 'PostController.userPosts')

  //list all follow users posts
  Route.get('/follows/posts', 'PostController.followUsersPosts')

}).middleware('auth')


//Comments routes
Route.group('comments', () => {

  //insert a comment
  Route.post('/posts/:post_id/comments', 'CommentController.store')

  //show a comment
  Route.get('/comments/:id', 'CommentController.show')

  //update a comment
  Route.put('/comments/:id', 'CommentController.update')

  //delete a comment
  Route.delete('/comments/:id', 'CommentController.destroy')

  //list all comments on a post
  Route.get('/posts/:post_id/comments', 'CommentController.postComments')

}).middleware('auth')




//Likes routes
Route.group('likes', () => {

  //insert a like on a post
  Route.post('/posts/:post_id/likes', 'LikeController.store')

  //remove a like on a post
  Route.delete('/posts/:post_id/likes', 'LikeController.destroy')

  //list all user likes
  Route.get('/users/:id/likes', 'LikeController.userLikes')

  //list all post likes
  Route.get('/posts/:id/likes', 'LikeController.postLikes')

}).middleware('auth')


//Follow routes
Route.group('follows', () => {

  //follow a user
  Route.post('/users/follows/:followed_user_id', 'FollowController.store')

  //unfollow a user
  Route.delete('/users/follows/:followed_user_id', 'FollowController.destroy')

  //list all user follows
  Route.get('/users/:user_id/follows', 'FollowController.index')

}).middleware('auth')

