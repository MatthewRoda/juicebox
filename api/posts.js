const express = require ('express');
const postsRouter = express.Router();
const { requireUser } = require('./utils');
const { getAllPosts, createPost, updatePost, getPostById } = require('../db');

postsRouter.post('/', requireUser, async (req, res, next) => {
	console.log('req.user: ', req.user);
	const { title, content, tags = "" } = req.body;
	
	const tagArr = tags.trim().split(/\s+/);
	const postData = {};
	
	if(tagArr.length) {
		postData.tags = tagArr;
	}
	
	try{
		postData.authorId = req.user.id;
		postData.title = title;
		postData.content = content;
		
		const post = await createPost(postData);
		
		if (post) {
			res.send({ post });
		}
		next({ name, message });
	}
	catch({ name, message }) {
		next({ name, message });
	}
});


postsRouter.use((req, res, next) => {
	console.log("A request is being made to /posts");
	
	next();
});


postsRouter.get('/', async (req, res) => {
  try {
    const allPosts = await getAllPosts();

    const posts = allPosts.filter(post => {
    	return post.active || (req.user && post.author.id === req.user.id);
    });

    res.send({
      posts
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }
	console.log("updateFields: ", updateFields);
  try {
    const originalPost = await getPostById(postId);
    if (originalPost.author.id === req.user.id) {
    	console.log("ids match");
      const updatedPost = await updatePost(postId, updateFields);
      console.log("updatedPost: ", updatedPost);
      res.send({ post: updatedPost })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: 'You cannot update a post that is not yours'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete('/:postId', requireUser, async(req, res, next) => {
	try{
		const post = await getPostById(req.params.postId);
		
		if(post && post.author.id === req.user.id) {
			const updatedPost = await updatePost(post.id, { active: false });
			
			res.send({ post: updatedPost });
		}
		else{
			next (post ? {
				name: "UnathorizedUserError",
				message: "You cannot delete a post which is not yours"
			} : {
				name: "PostNotFoundError",
				message: "That post does not exist"
			});
		}
		
	}
	catch({ name, message }) {
		next({ name, message });
	}
});

module.exports = postsRouter;





















