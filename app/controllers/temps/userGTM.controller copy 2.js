const db = require("../models");

const UserGtm = db.userGtms;
const userAudience = db.userAudience;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  console.log("Node API  Create req.body---> ", req.body);
  // Validate request
  // if (!req.body.botUserId) {
  //   res.status(400).send({ message: "userId can not be empty!" });
  //   return;
  // }
  const date = new Date();
  // const userGtm = new UserGtm({
  //   botUserId: req.body.botUserId,
  //   userId: req.body.userId,
  //   client_id: req.body.client_id,
  //   lineUid: req.body.lineUid,
  //   userAgent: req.body.userAgent,
  //   ipAddressWebStart: req.body.ipAddressWebStart,
  //   ipAddressChatLine: req.body.ipAddressChatLine,
  //   uniqueEventId: req.body.uniqueEventId,
  //   sessionId: req.body.sessionId,
  //   lineDisplayName: req.body.lineDisplayName,
  //   utm_source: req.body.utm_source,
  //   utm_medium: req.body.utm_medium,
  //   timeStamp: date,
  // });

  // check cookiesUid in db
  //console.log("botUserId ==> ", req.body.botUserId);
  //res.send("TEST CHECK ");
  await userAudience.findOne(
    { ipAddress: req.body.ipAddressWebStart },
    function (err, userAudienceData) {
      console.log("userAudienceData--> ", userAudienceData);
      if (!userAudienceData) {
        console.log("Not Found ipAddress from Audience--> ");
        //saveData(userGtm, res);
        res.send("NOT FOUND DATA IN DB AUDIENCE");
      } else {
        const packDataUserGTMtoSave = new UserGtm({
          // botUserId: req.body.botUserId, //req.body
          // userId: userAudienceData.userId,
          // lineUid: req.body.lineUid, //req.body
          // lineDisplayName: req.body.lineDisplayName, //req.body
          // client_id: userAudienceData.client_id,
          // userAgent: userAudienceData.userAgent,
          // ipAddressWebStart: req.body.ipAddressWebStart, //req.body
          // ipAddressChatLine: req.body.ipAddressChatLine, //req.body
          // uniqueEventId: userAudienceData.uniqueEventId,
          // sessionId: userAudienceData.sessionId,
          // timeStamp: date,
          // utm_source: userAudienceData.utm_source,
          // utm_medium: userAudienceData.utm_medium,

          botUserId: req.body.botUserId, //req.body
          userId: req.body.userId,
          lineUid: req.body.lineUid, //req.body
          lineDisplayName: req.body.lineDisplayName, //req.body
          client_id: req.body.client_id,
          userAgent: req.body.userAgent,
          ipAddressWebStart: req.body.ipAddressWebStart, //req.body
          ipAddressChatLine: req.body.ipAddressChatLine, //req.body
          uniqueEventId: req.body.uniqueEventId,
          sessionId: req.body.sessionId,
          utm_source: req.body.utm_source,
          utm_medium: req.body.utm_medium,
          timeStamp: date,
        });
        console.log("Found ipAddress from Audience--> ");
        console.log("PACK packDataUserGTMtoSave--> ", packDataUserGTMtoSave);
        console.log("SAVE DATA to UserGtm--> ", userAudienceData);
        //saveData(packDataUserGTMtoSave);

        //res.send("FOUND DATA IN DB GTM");
        UserGtm.save(packDataUserGTMtoSave)
          .then((data) => {
            console.log("save data OK-->", data);
            console.log("send data to GA4-->"); //create method send ga4
            //sendDataToGA4(packDataUserGTMtoSave);
            // res.send({ message: "save data ok", sendData: data });
            res.send("SAVE DATA OK");
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Tutorial.",
            });
          });
      }
    }
  );
};

// const saveData = (userGtm, res) => {
//   UserGtm.save(userGtm)
//     .then((data) => {
//       console.log("save data OK-->");
//       console.log("send data to GA4-->"); //create method send ga4
//       sendDataToGA4(userGtm);
//       res.send({ message: "save data ok", sendData: data });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Tutorial.",
//       });
//     });
// };

// user audience =====> end

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

// Find a single botUserId with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  console.log("GTM FIND BOT USER ID -----> ", id);
  var queryData = {
    botUserId: id,
  };

  UserGtm.findOne(queryData, function (err, data) {
    if (!data) {
      console.log("NO DATA GTM IN NODE API-->SAVE DATA");
      // res.status(404).send({ message: "Not found lineUid " + id });
      console.log("res.sendData ", data);
      res.send({ message: "NO FOUND DATA", sendData: data });
    } else {
      console.log("FOUND DATA --> ");
      // res.send(data);
      res.send({ message: "FOUND DATA", sendData: data });
    }
  });
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

const sendDataToGA4 = (userGtm) => {
  const axios = require("axios");
  //console.log("GA4 req.body--> ", req.body);
  let data = JSON.stringify({
    client_id: userGtm.client_id,
    user_id: userGtm.userId,
    non_personalized_ads: false,
    user_properties: {
      ipAddress: {
        value: userGtm.ipAddressChatLine,
      },
    },
    events: [
      {
        name: "LineChatStart",
        params: {
          campaign_id: "campaign-" + userGtm.userId,
          campaign: "START-LINE-SEND-API-FROM-NODE",
          source: userGtm.utm_source,
          medium: userGtm.utm_medium,
          term: "LineStartChat",
          content: "Check Conversion from LineStart",
          client_id: userGtm.client_id,
          user_id: userGtm.userId,
          ipAddressWebStart: userGtm.ipAddressWebStart,
          ipAddressChatLine: userGtm.ipAddressChatLine,
          session_id: userGtm.sessionId,
          uniqueEventId: userGtm.uniqueEventId,
          userAgent: userGtm.userAgent,
          lineUid: userGtm.lineUid,
          botUserId: userGtm.botUserId,
          lineDisplayName: userGtm.lineDisplayName,
        },
      },
    ],
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.google-analytics.com/mp/collect?measurement_id=G-NQVBY4R09H&api_secret=FkF5XfP6QMKFaaPnCCA9dA",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      res.send("SendGA4Api");
    })
    .catch((error) => {
      console.log(error);
    });
};

//test api ga4
exports.ga4 = (req, res) => {
  const axios = require("axios");
  console.log("GA4 req.body--> ", req.body);
  let data = JSON.stringify({
    client_id: req.body.client_id,
    user_id: req.body.userId,
    non_personalized_ads: false,
    user_properties: {
      ipAddress: {
        value: req.body.ipAddress,
      },
    },
    events: [
      {
        name: "LineStartChat",
        params: {
          campaign_id: "campaign-" + req.body.userId,
          campaign: "START-LINE-SEND-API-FROM-NODE",
          source: req.body.utm_source,
          medium: req.body.utm_medium,
          term: "LineStartChat",
          content: "Check Conversion from LineStart",
          client_id: req.body.client_id,
          user_id: req.body.user_id,
          ipAddressWebStart: req.body.ipAddressWebStart,
          ipAddressChatLine: req.body.ipAddressChatLine,
          session_id: req.body.sessionId,
          uniqueEventId: req.body.uniqueEventId,
          userAgent: req.body.userAgent,
          lineUid: req.body.lineUid,
          botUserId: req.body.botUserId,
          lineDisplayName: req.body.lineDisplayName,

          utm_source: req.body.utm_source, // ติดตาม Ads
          utm_medium: req.body.utm_medium, // ติดตาม Ads
        },
      },
    ],
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.google-analytics.com/mp/collect?measurement_id=G-NQVBY4R09H&api_secret=FkF5XfP6QMKFaaPnCCA9dA",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      res.send("SendGA4Api");
    })
    .catch((error) => {
      console.log(error);
    });
};
