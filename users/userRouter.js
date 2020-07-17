const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');


const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err.message })
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const postInfo = {...req.body, user_id: req.id};

  Posts.insert(postInfo)
  .then(post => {
    res.status(210).json(post);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: 'Error sending the post info', error: error.message });
  });
});

router.get('/', async (req, res) => {
  // do your magic!
  const users = await Users.get();

  try {
    res.status(200).json(users);
  }
  catch {
    res.status(500).json({ error: 'The posts the information could not be retrieved' })
  }
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params
  Users.getUserPosts(id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: 'Error getting the posts for the user!' })
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'User has been nuked' });
    } else {
      res.status(404).json({ message: 'The user could not be found' });
    }
  })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'The user could not be found' });
    }
  })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Users.getById(id)
   .then(user => {
     if (user) {
        req.user = user;
        next();
     } else {
       next({ code: 404, message: 'invalid user id' });
     }
   })
   .catch(err => {
     console.log(err);
     res.status(500).json({ message: 'failed to process' });
   });
}

function validateUser(req, res, next) {
  // do your magic!
  if (req.body && req.body.name){
    next();
  } else if (Object.keys(req.body).length < 1) {
    res.status(400).json({ message: 'missing user data' })
  } else if (!req.body.name) {
    res.status(400).json({ message: 'missing required name field' });
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const { id } = req.params;
  if (req.body && req.body.text){
    req.id = id
    next();
  } else if (!req.body.text){
    res.status(400).json({ message: 'missing required text field' });
  } else if (req.body){
    res.status(400).json({ message: 'missing post data' });
  }
}

module.exports = router;
