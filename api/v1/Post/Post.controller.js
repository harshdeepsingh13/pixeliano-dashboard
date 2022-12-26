const {responseMessages} = require('../../../config/config');
const {
  saveNewPicture,
  getPosts,
  saveNewPost,
  updatePost,
  deletePost,
  getPostsCount,
} = require('./Post.model');
const {logger, isRSSActive} = require('../../../config/config');
const childProcess = require('child_process');
const path = require('path');
const {getTags} = require('../Tag/Tag.model');
const {saveNewTag} = require('../Tag/Tag.model');
const {deleteFromCloudinary} = require('../../../services/cloudinary.service');

exports.newPostController = async (req, res, next) => {
  try {
    const {
      picture,
      caption,
    } = req.body;

    let {tags} = req.body;

    const {
      email: userEmail,
    } = req.user;

    if (!picture) {
      req.error = {
        status: 400,
        message: responseMessages[400],
        logger: 'picture not defined',
      };
      return next(new Error());
    } else if (!picture.fullUrl || !picture.shortName) {
      req.error = {
        status: 400,
        message: responseMessages[400],
        logger: 'fullUrl or providerName or shortName not defined in picture object',
      };
      return next(new Error());
    }
    const {pictureId} = await saveNewPicture({
      fullUrl: picture.fullUrl,
      providerName: picture.providerName,
      shortName: picture.shortName,
    });

    tags = await Promise.all(
      tags.map(async tag => {
        if (tag.isNew || !tag.tagId) {
          let tagDetails;
          tagDetails = await saveNewTag({tag: tag.tag, userEmail});
          return tagDetails.tagId;
        } else {
          return tag.tagId;
        }
      }),
    );
    const newPost = await saveNewPost({
      caption,
      tags,
      pictureId,
      userEmail,
    });
    if (isRSSActive) {
      childProcess.fork(
        path.join(__dirname, '../../../services/insertIntoFeed.service.js'),
        [
          req.user.userId,
          newPost.postId,
        ]);
    }
    res.status(200).json({
      status: 200,
      message: responseMessages[200],
    });
    logger.info(`[Post.controller.js] New Post created, request Id - ${req.request.callId}`);
  } catch (e) {
    next(e);
  }
};

exports.getPostsController = async (req, res, next) => {
  try {
    const {email} = req.user;
    const response = await getPosts(email);
    res.status(200).json({
      status: 200,
      message: responseMessages[200],
      data: {
        totalPosts: response.total,
        posts: response.posts,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.getPostCountController = async (req, res, next) => {
  try {
    const {email} = req.user;
    const totalCount = await getPostsCount(email);
    res.status(200).json({
      status: 200,
      message: responseMessages[200],
      data: {
        postCount: totalCount.length ? totalCount[0].totalCount : totalCount.length,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.updateRecordController = async (req, res, next) => {
  try {
    const {postId, picture, caption} = req.body;
    let {tags} = req.body;

    let updates = {};

    if (!postId) {
      req.error = {
        status: 400,
        message: responseMessages[400],
        logger: 'postId not present',
      };
      return next(new Error());
    }
    if (!picture && !caption && !tags) {
      req.error = {
        status: 400,
        message: responseMessages[400],
        logger: 'Picture, caption and tags not present',
      };
      return next(new Error());
    }
    if (picture && !((picture.pictureId) || (picture.shortName && picture.fullUrl))) {
      req.error = {
        status: 400,
        message: responseMessages[400],
        logger: 'Either pictureID or fullUrl and shortName should be present',
      };
      return next(new Error());
    }
    const {posts} = await getPosts(postId, 'postId');
    // throw new Error('just like that');
    if (posts.length) {
      const post = posts[0];
      if (picture && picture.pictureId) {
        updates.pictureId = picture.pictureId;
      }
      if (picture && (picture.fullUrl && picture.shortName)) {
        await deleteFromCloudinary(post.picture.shortName);
        logger.info(`Existing image with pictureId - ${post.picture.pictureId} is deleted`);
        const {pictureId} = await saveNewPicture({
          fullUrl: picture.fullUrl,
          providerName: picture.providerName,
          shortName: picture.shortName,
        });
        updates.pictureId = pictureId;
      }
      if (tags) {
        updates.tags = await Promise.all(
          tags.map(async tag => {
            if (tag.isNew || !tag.tagId) {
              let tagDetails;
              tagDetails = await saveNewTag({tag: tag.tag, userEmail: req.user.email});
              return tagDetails.tagId;
            } else {
              return tag.tagId;
            }
          }),
        );
      }
      if (caption) {
        updates.caption = caption;
      }
      await updatePost(updates, postId);
      if (isRSSActive) {
        childProcess.fork(
          path.join(__dirname, '../../../services/insertIntoFeed.service.js'),
          [
            req.user.userId,
            postId,
          ]);
      }
      res.status(200).json({
        status: 200,
        message: responseMessages[200],
      });
    } else {
      res.error = {
        status: 404,
        message: responseMessages[404],
        logger: 'No post with given postId.',
      };
      return next(new Error());
    }
  } catch (e) {
    next(e);
  }
};

exports.deleteRecordController = async (req, res, next) => {
  try {
    const {postId} = req.params;
    const {email, userId} = req.user;
    const deletedPost = await deletePost(postId, email);
    if (!deletedPost) {
      req.error = {
        status: 404,
        message: responseMessages[404],
        logger: 'no post with the post id of the given user.',
      };
      return next(new Error());
    }
    res.status(200).json({
      status: 200,
      message: responseMessages[200],
    });
    if (isRSSActive) {
      childProcess.fork(
        path.join(__dirname, '../../../services/deleteFromFeed.service.js'),
        [
          userId,
          postId,
        ]);
    }
  } catch (e) {
    next(e);
  }
};
