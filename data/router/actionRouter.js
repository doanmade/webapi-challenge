const express = require("express");
const Action = require("../helpers/actionModel.js");

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  Action.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ errMessage: "Error getting actions" });
    });
});

router.get("/:id", validateActionId, (req, res) => {
  const actions = req.params.actions;
  res.status(200).json(actions);
});

router.post("/", validateActionPost, (req, res) => {
  const post = req.body;
  Action.insert(post)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log("post:err", err);
      res.status(500).json({ errMessage: "Error adding action" });
    });
});

router.put("/:id", validateActionId, (req, res) => {});
const { description, notes } = req.body;
const { id } = req.params;
Actions.update(id, { description, notes })
  .then(updated => {
    if (updated) {
      User.get(id)
        .then(actions => {
          res.status(200).json(actions);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "Error getting actions" });
        });
    }
  })
  .catch(err => {
    res.status(500).json({ error: "Error Updating actions" });
  });

router.delete("/:id", validateActionId, (req, res) => {});
// const { id } = req.params;
Action.remove(id)
  .then(() => {
    res
      .status(204)
      .json({
        message: `The action with id ${id} has been removed from the server`
      })
      .end();
  })
  .catch(err => {
    console.log("err", err);
    res.status(500).json({
      errMessage: `There was an issue when deleting action with the id of ${id}!! They just wont die!!`
    });
  });

//custom middleware

function validateActionId(req, res, next) {
  const { id } = req.params;
  Action.get(id).then(actions => {
    if (actions) {
      req.actions = actions;
      next();
    } else {
      res.status(404).json({ error: "this actions id does not exist" });
    }
  });
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ errMessage: "a User has no name" });
  }
  if (typeof name !== "string") {
    return res
      .status(400)
      .json({ errMessage: "a User's name must contain letters" });
  }
  next();
}

function validateActionPost(req, res, next) {
  const { description, notes } = req.body;
  if (!description) {
    return res.status(400).json({ errMessage: "a description has no text" });
  }
  if (!notes) {
    return res.status(400).json({ errMessage: "a notes has no text" });
  }
  next();
}

module.exports = router;
