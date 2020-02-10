// implement your API here

//import express from "express"

const express = require("express"); // commonJs mosules

const { find, findById, insert, remove, update } = require("./data/db");

const server = express();
// this teaches express how to reac JSOn form the body

server.use(express.json()); // NEEDED for post and PUT/PATH

server.get("/", (req, res) => {
  res.json({ hello: "what up" });
});

//view a list of hubs

// add a hub

server.post("/api/users", (req, res) => {
  const user = req.body;
  if (!(user.name || user.bio)) {
    res.status(400).json({
      errorMessage: "Please provide a name and bio for the user"
    });
    return true;
  }

  insert(user)
    .then(data => {
      res.status(201).json({ ...user, ...data });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "There was an eroor while saving the user to the database"
      });
    });
});

//get
server.get("/api/users", (req, res) => {
    find()
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  findById(id)
    .then(data => {
      if (data) {
        res.status(201).json(data);
      } else {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "The user information could not be retrieved."
      });
    })
   
});

//delete

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  findById(id)
    .then(user => {
      if (user) {
        remove(id)
          .then(data => {
            if (data) {
              res.status(201).json(user);
            } else {
              res.status(404).json({
                errorMessage: "The user with the specified ID does not exist."
              });
            }
          })
          .catch(error => {
            res.status(500).json({
              errorMessage: "The user could not be removed"
            });
          });
      } else {
        res.status(404).json({ errorMessage: "user not found" });
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "The user could not be removed"
      });
    });
});

//put

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = req.body;

  if (!(user && user.name && user.bio)) {
    res.status(400).json({
      errorMessage: "Please provide name and bio for the user."
    });
    return true;
  }


  update(id, user)
    .then(data => {
      if (data) {
        findById(id).then(data => {
          res.status(200).json(data);
        });
      } else {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "The user information could not be modified."
      });
    });
});

const port = 5000;
server.listen(port, () => console.log(`\n API on port ${port} \n`));
