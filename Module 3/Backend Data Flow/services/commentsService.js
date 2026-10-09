const postsRepo = require('./../repository/postsRepo');
const commentsRepo = require('./../repository/commentsRepo');
const AppError = require('./../utils/AppError');

/**
 * TODO (Multi-step workflow): add a comment to a post.
 * Model this as an ordered sequence of service methods, ALL CHECKS BEFORE ANY WRITE:
 *   1. The post must exist            -> AppError('Post not found', 404)
 *   2. The post must not be locked    -> AppError('Post is locked for new comments', 409)
 *   3. THEN insert the comment        -> commentsRepo.insert({ postId, authorId: userId, body })
 *   4. THEN bump the post's count     -> postsRepo.incrementCommentCount(postId)
 *   5. return the created comment
 * No write may happen before both checks pass.
 */

exports.editPost = async (postId, userId, changes) => {
  const post = await repo.findById(postId);
  if (!post) throw new AppError('Post not found', 404);

  if (post.authorId !== userId)
    throw new AppError('You can only edit your own post', 403);

  const ageMs = Date.now() - post.createdAt;
  if (ageMs > EDIT_WINDOW_MS)
    throw new AppError('Post can no longer be edited', 403);

  return repo.update(postId, changes);
};