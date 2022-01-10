const express = require("express");
const router = express.Router();
const db = require("../models");
const jwt = require('jsonwebtoken')
const checkAuth = require('../check-auth')
const bcrypt = require('bcrypt');

router.get('/users', (req, res) => {
  db.User.findAll().then(users => res.send(users))
})

router.get('/likes', (req, res) => {
  db.Like.findAll().then(users => res.send(users))
})

router.post('/new-user', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash
    }).then(submittedUser => res.send(submittedUser));
  })
});

router.post('/login', (req, res) => {
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then(results => {
    bcrypt.compare(req.body.password, results.password, (err, result) => {
      if(result) {
        const token = jwt.sign({
          email: results.email,
          firstName: results.firstName,
          lastName: results.lastName,
          userId: results.id
        }, "secret", { expiresIn: "1hr" })
        return res.status(200).json({
          message: "Auth Successful",
          token: token
        })
      } else {
        return res.status(401).json({
          message: "Incorrect credentials."
        })
      }
    });
  }).catch(() => {
    return res.status(401).json({
      message: "Email doesn't exist."
    })
  })
})

router.get('/all-reports', (req, res) => {
  db.Report.findAll().then(async reports => {
    for(let i = 0; i < reports.length; i++) {
      const liked = await db.Like.findOne({
        where: {
          post_id: reports[i].id,
          user_id: req.get('user_id')
        }
      })
      if(liked) {
        reports[i].dataValues.color = "#007bff"
      } else {
        reports[i].dataValues.color = "grey"
      }
    }
    res.send(reports)
  });
});

router.post('/liked-reports', (req, res) => {
  db.Report.findAll({
    where: {
      id: req.body.post_id
    }
  }).then(reports => res.send(reports));
});

router.post("/new-report", (req, res) => {
    db.Report.create({
      userId: req.body.userId,
      name: req.body.name,
      location: req.body.location,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      status: req.body.status,
      likes: req.body.likes
    }).then(submittedReport => res.send(submittedReport));
});

router.post('/your-posts', (req, res) => {
  db.Report.findAll({
    where: {
      userId: req.body.userId
    }
  }).then(yourPosts => res.send(yourPosts))
})

router.post('/profile', (req, res) => {
  db.User.findAll({
    where: {
      id: req.body.userId
    }
  }).then(profile => res.send(profile))
})

router.delete('/delete/:id', (req, res) => {
  db.Report.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    db.Like.destroy({
      where: {
        post_id: req.params.id
      }
    })
  }).then(() => {
    res.send('success')
  })
})

router.post('/like', (req, res) => {
  db.Like.findAll({
    where: {
      post_id: req.body.post_id,
      user_id: req.body.user_id
    }
  }).then(results => {
    if(results.length === 0) {
      db.Like.create({
        post_id: req.body.post_id,
        user_id: req.body.user_id
      }).then(() => {
        db.Like.findAll({
          where: {
            post_id: req.body.post_id
          }
        }).then(results => {
          db.Report.findByPk(req.body.post_id).then(post => {
            post.update({likes: results.length}).then(() => db.Report.findAll().then(async reports => {
              for(let i = 0; i < reports.length; i++) {
                const liked = await db.Like.findOne({
                  where: {
                    post_id: reports[i].id,
                    user_id: req.body.user_id
                  }
                })
                if(liked) {
                  reports[i].dataValues.color = "#007bff"
                } else {
                  reports[i].dataValues.color = "grey"
                }
              }
              res.send(reports)
            }))
          })
        })
      })
    } else {
      db.Like.destroy({
        where: {
          post_id: req.body.post_id,
          user_id: req.body.user_id
        }
      }).then(() => {
        db.Like.findAll({
          where: {
            post_id: req.body.post_id
          }
        }).then(results => {
          db.Report.findByPk(req.body.post_id).then(post => {
            post.update({likes: results.length}).then(() => db.Report.findAll().then(async reports => {
              for(let i = 0; i < reports.length; i++) {
                const liked = await db.Like.findOne({
                  where: {
                    post_id: reports[i].id,
                    user_id: req.body.user_id
                  }
                })
                if(liked) {
                  reports[i].dataValues.color = "#007bff"
                } else {
                  reports[i].dataValues.color = "grey"
                }
              }
              res.send(reports)
            }))
          })
        })
      })
    }
  })
})

module.exports = router