const db = require("../models");
const userAudience = db.userAudience;

// user audience =====> start
exports.createUserAudience = (req, res) => {
  console.log("Path createUserAudience req.body---> ", req.body);
  console.log(
    "Path createUserAudience req.body.utm_source---> ",
    req.body.utm_source
  );
  console.log(
    "Path createUserAudience req.body.utm_medium---> ",
    req.body.utm_medium
  );
  console.log(
    "Path createUserAudience req.body.utm_term---> ",
    req.body.utm_term
  );

  console.log(
    "Path createUserAudience req.body.ipAddress---> ",
    req.body.ipAddress
  );
  // Validate request
  if (!req.body.ipAddress) {
    res.status(400).send({ message: "ipAddress can not be empty!" });
    return;
  }
  const date = new Date();
  const _userAudience = new userAudience({
    userId: req.body.userId,
    client_id: req.body.client_id,
    userAgent: req.body.userAgent,
    ipAddress: req.body.ipAddress,
    uniqueEventId: req.body.uniqueEventId,
    sessionId: req.body.sessionId,
    utm_source: req.body.utm_source,
    utm_medium: req.body.utm_medium,
    utm_term: req.body.utm_term,
    timeStamp: date,
  });

  // check cookiesUid in db
  console.log("userId ==> ", req.body.userId);
  userAudience.findOne(
    // Todo Filter from audience เปลี่ยนจาก IP เป็น userId (cookies) เพราะใช้ ip มันเปลี่ยนไปมา น่าจะมาจาก router wifi
    // { ipAddress: req.body.ipAddress },
    { ipAddress: req.body.ipAddress }, // from gtm api

    // { userId: "1704613370490" },
    function (err, _ipAddress) {
      console.log("FIND DATA*********==>", _ipAddress);
      console.log("ipAddressWebStart*********==>", req.body.ipAddressWebStart);
      if (!_ipAddress) {
        console.log("Not Found botUserId ==>SAVE DATA ");
        _userAudience
          .save()
          .then((data) => {
            console.log("save-> ", data);
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Tutorial.",
            });
          });

        //saveDataUserAudience(_userAudience, res);
      } else {
        console.log("Found botUserId ==>IGNORE ");
        res.send("FOUND DATA IN DB");
      }
    }
  );
};

// const saveDataUserAudience = (setData, res) => {
//   console.log("saveDataUserAudience-> ", setData);
//   userAudience
//     .save(setData)
//     .then((data) => {
//       console.log("save-> ", data);
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Tutorial.",
//       });
//     });
// };

// Find a single  ip address in audence
exports.findOneAudience = async (req, res) => {
  console.log("start findOneAudience --> ");
  const id = req.params.id;
  console.log("AUDIENCE FIND IP -----> ", id);
  var queryData = {
    ipAddress: id,
  };

  userAudience.findOne(queryData, function (err, data) {
    if (!data) {
      console.log("NO DATA AUDIENE IN NODE API-->SAVE DATA ");
      // res.status(404).send({ message: "Not found lineUid " + id });

      res.send({ message: "NO FOUND DATA", sendData: queryData });
    } else {
      console.log("FOUND AUDIECCE DATA --> ", data);
      // res.send(data);
      res.send({ message: "FOUND DATA", sendData: data });
    }
  });
};

// user audience =====> end
