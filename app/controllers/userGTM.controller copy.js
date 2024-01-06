const db = require("../models");
const UserGtm = db.userGtms;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  console.log("Path Create---> ", req.body);
  // Validate request
  if (!req.body.userId) {
    res.status(400).send({ message: "userId can not be empty!" });
    return;
  }
  const date = new Date();

  // check cookiesUid in db
  console.log("lineUid ==> ", req.body.lineUid);
  UserGtm.findOne({ lineUid: req.body.lineUid }, function (err, lineUid) {
    if (lineUid) {
      //console.log("Found data : ", lineUid);
      // Create a Tutorial
      // const userGtm = new UserGtm({
      //   userId: req.body.userId,
      //   client_id: req.body.client_id,
      //   lineUid: req.body.lineUid,
      //   userAgent: req.body.userAgent,
      //   ipAddress: req.body.ipAddress,
      //   uniqueEventId: req.body.uniqueEventId,
      //   sessionId: req.body.sessionId,
      //   timeStamp: date,
      //   startData: false,
      // });
      // saveData(userGtm, res);
      console.log("FOUND DATA & CANNOT SAVE");
      res.send("FOUND DATA & CANNOT SAVE");
    } else {
      console.log("NO FOUND DATA & SAVE DATA");
      // Create a Tutorial
      const userGtm = new UserGtm({
        userId: req.body.userId,
        client_id: req.body.client_id,
        lineUid: req.body.lineUid,
        userAgent: req.body.userAgent,
        ipAddress: req.body.ipAddress,
        uniqueEventId: req.body.uniqueEventId,
        sessionId: req.body.sessionId,
        timeStamp: date,
        // startData: req.body.startData ? req.body.startData : false,
        startData: true,
      });

      saveData(userGtm, res);

      // Save Tutorial in the database
      // userGtm
      //   .save(userGtm)
      //   .then((data) => {
      //     res.send(data);
      //   })
      //   .catch((err) => {
      //     res.status(500).send({
      //       message:
      //         err.message ||
      //         "Some error occurred while creating the Tutorial.",
      //     });
      //   });
    }
  });
};

const saveData = (userGtm, res) => {
  userGtm
    .save(userGtm)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  console.log("Path findAll---> ");
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  UserGtm.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  //let id = "U634375582d774e1c8ce69c31f6f1ba48";

  //***** find _id database */
  // let id = "6590d3c7419b212360c4247f";
  // console.log("server find id --> ", id);
  // await UserGtm.findById({ _id: id }).then((data) => {
  //   if (!data) {
  //     console.log("NO DATA --> ");
  //     res.status(404).send({ message: "Not found Tutorial with id " + id });
  //   } else {
  //     console.log("FOUND DATA --> ", data);
  //     res.send(data);
  //   }
  // });

  //const id = "U634375582d774e1c8ce69c31f6f1ba47";
  // var query = UserGtm.find({}).select({ "lineUid": id, "_id": 0})
  var queryData = {
    lineUid: id,
  };

  UserGtm.findOne(queryData, function (err, data) {
    if (!data) {
      console.log("NO DATA IN NODE API-->SAVE DATA ");
      // res.status(404).send({ message: "Not found lineUid " + id });

      res.send("NO FOUND DATA");
    } else {
      console.log("FOUND DATA --> ");
      // res.send(data);
      res.send("FOUND DATA");
    }
  });

  // UserGtm.findById(id)
  //   .then((data) => {
  //     console.log("server data --> ", data);
  //     if (!data) {
  //       console.log("NO DATA --> ");
  //       res.status(404).send({ message: "Not found Tutorial with id " + id });
  //     } else {
  //       console.log("FOUND DATA --> ");
  //       res.send(data);
  //     }
  //   })
  //   .catch((err) => {
  //     res
  //       .status(500)
  //       .send({ message: "Error retrieving Tutorial with id=" + id });
  //   });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  UserGtm.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  UserGtm.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  UserGtm.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  UserGtm.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
