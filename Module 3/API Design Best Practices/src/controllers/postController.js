// const store = require('../data/postStore');

// function listPosts(query = {}) {
//   const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);

//   const requestedLimit = Number.parseInt(query.limit, 10) || 2;
//   const limit = Math.min(Math.max(requestedLimit, 1), 100);

//   const posts = store.getAllPosts();

//   const total = posts.length;
//   const pages = Math.ceil(total / limit);

//   const start = (page - 1) * limit;
//   const data = posts.slice(start, start + limit);

//   return {
//     data,
//     meta: {
//       page,
//       limit,
//       total,
//       pages
//     }
//   };
// }

// function getPost(id) {
//   const post = store.getPostById(id);

//   if (!post) {
//     const err = new Error('Post not found');
//     err.statusCode = 404;
//     err.code = 'NOT_FOUND';
//     throw err;
//   }

//   return post;
// }

// function createPost(body = {}) {
//   return store.createPost({
//     title: body.title,
//     author: body.author
//   });
// }

// function likePost(id) {
//   const post = store.incrementLikes(id);

//   if (!post) {
//     const err = new Error('Post not found');
//     err.statusCode = 404;
//     err.code = 'NOT_FOUND';
//     throw err;
//   }

//   return post;
// }

// function explode() {
//   const err = new Error('Something went wrong');
//   err.statusCode = 500;
//   err.code = 'INTERNAL_ERROR';
//   throw err;
// }

// module.exports = {
//   listPosts,
//   getPost,
//   createPost,
//   likePost,
//   explode
// };

const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res, next) {
  try {
    const { data, meta } = service.listPosts(req.query);
    return http.sendSuccess(res, 200, data, meta);
  } catch (err) {
    return next(err);
  }
}

function getPost(req, res, next) {
  try {
    const post = service.getPost(req.params.id);
    return http.sendSuccess(res, 200, post);
  } catch (err) {
    return next(err);
  }
}

function createPost(req, res, next) {
  try {
    const post = service.createPost(req.body);
    res.set('Location', `/api/posts/${post.id}`);
    return http.sendSuccess(res, 201, post);
  } catch (err) {
    return next(err);
  }
}

function likePost(req, res, next) {
  try {
    const post = service.likePost(req.params.id);
    return http.sendSuccess(res, 201, { postId: post.id, likes: post.likes });
  } catch (err) {
    return next(err);
  }
}

function triggerInternalFailure(req, res, next) {
  try {
    service.explode();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  triggerInternalFailure
};