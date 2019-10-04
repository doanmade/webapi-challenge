const express = require("express");
const Project = require("../helpers/projectModel.js");

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  Project.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({ errMessage: "Error getting projects" });
    });
});

router.get("/:id", validateProjectId, (req, res) => {
  const { id } = req.params;
  Project.get(id)
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({
        errMessage: `There has been an issue when fetching project id# ${id}`
      });
    });
});

router.post("/", validateProjectPost, (req, res) => {
  const projects = req.body;
  Project.insert(projects)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log("post:err", err);
      res.status(500).json({ errMessage: "Error adding project" });
    });
});

router.put("/:id", validateProjectId, (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  Project.update(id, changes)
    .then(updated => {
      res.status(200).json(updated);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error getting projects" });
    });
});

router.delete("/:id", validateProjectId, (req, res) => {
  const { id } = req.params;
  Project.remove(id)
    .then(() => {
      res
        .status(204)
        .json({
          message: `The project with id ${id} has been removed from the server`
        })
        .end();
    })
    .catch(err => {
      console.log("err", err);
      res.status(500).json({
        errMessage: `There was an issue when deleting project with the id of ${id}!! They just wont die!!`
      });
    });
});

//custom middleware

function validateProjectId(req, res, next) {
  const { id } = req.params;
  Project.get(id).then(projects => {
    if (projects) {
      req.projects = projects;
      next();
    } else {
      res.status(404).json({ error: "this projects id does not exist" });
    }
  });
}

function validateProjectPost(req, res, next) {
  const { description, name } = req.body;
  if (!description) {
    return res.status(400).json({ errMessage: "a description has no text" });
  }
  if (!name) {
    return res.status(400).json({ errMessage: "a name has no text" });
  }
  next();
}

module.exports = router;
