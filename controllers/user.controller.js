const db = require("../db");
const jwt = require("jsonwebtoken");

// const User = require('../models/User')
require("dotenv").config();

//=================TEST BLOCK====================
// // console.log("User === db.models.User:", User === db.models.User);
// let test = async () => {
//   try {
//     await db.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.log("Unable to connect to the database:", error);
//   }
// };
// test();
//=================TEST BLOCK====================
process.on("uncaughtException", (err) => {
  console.log(`Caught exception: ${err.message}`);
});

levelOfPermission = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  const obj = jwt.decode(token);
  console.log("DECODE:", obj.username, obj.email);
  const a = await db.query(
    `select role from person where username=$1 and email=$2`,
    [obj.username, obj.email]
  );
  return a.rows[0].role;
};
denyForUsers = async (role) => {
  if (role === 1) return true;
  return false;
};
isUserExists = async (user) => {
  console.log(user.username, user.email);
  let a = await db.query(
    `select email,username from person
   where email=$1 and username=$2`,
    [user.email, user.username]
  );
  console.log("ROWCOUNT_inside", a.rowCount);
  if (a.rowCount == 0) return false;
  return true;
};
class UserController {
  async createUser(req, res) {
    //+
    const { username, email, role = 1 } = req.body;
    const user = { username, email, role };
    console.log(user);
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    console.log(username, email, role);
    const newPerson = await db.query(
      `INSERT INTO person (username,email,role) values ($1,$2,$3) RETURNING *`,
      [username, email, role]
    );
    // res.json(newPerson.rows[0])
    res.json({ accessToken: accessToken });
  }
  async getUsers(req, res) {
    const role = await levelOfPermission(req, res);
    console.log("ROLE:", role);
    console.log("Is denied?:", await denyForUsers(role));
    if (await denyForUsers(role)) res.sendStatus(403);
    const users = await db.query(`SELECT * FROM person`);
    if (users.rows.length == 0) res.sendStatus(404);
    res.json(users.rows);
  }

  async getOneUser(req, res) {
    //+
    console.log(req.params);
    const role = await levelOfPermission(req, res);
    console.log(role);
    console.log("denyforUSERS", await denyForUsers(role));
    const id = req.params.id;
    if (await denyForUsers(role)) return res.sendStatus(403);
    const user = await db.query(`SELECT * FROM person WHERE id=$1`, [id]);
    if (user.rows.length == 0) return res.sendStatus(404);
    res.json(user.rows[0]);
  }

  async updateUser(req, res) {
    const { username, email, password } = req.body;
    const user = await db.query(
      `UPDATE person SET username = $1, email=$2, password=$3 WHERE username=$1 AND email=$2 RETURNING *`,
      [username, email, password]
    );
    res.json(user.rows[0]);
  }

  async deleteUser(req, res) {
    //+
    const role = await levelOfPermission(req, res);
    console.log(role);
    //if(role===1) res.sendStatus(403)
    console.log("denyforUSERS", await denyForUsers(role));
    //if(await denyForUsers(role)) res.sendStatus(403)
    const id = req.params.id;
    const userToDelete = await db.query(
      `DELETE FROM person WHERE id=$1 RETURNING *`,
      [id]
    );
    console.log("userToDelete", userToDelete.rows);
    if (userToDelete.rows.length == 0) return res.sendStatus(404); //если true, то он уже удален
    //await db.query(`UPDATE person SET id=id-1 WHERE id>$1`,[id])//перестроение после удаления строки
    res.json(`deleted user with id ${id}, ${userToDelete.rows[0]}`);
  }

  login = async (req, res) => {
    // res.json("ok");
    const { username, email, password } = req.body;
    let id = await db.query(`select id from person where email=($1)`, [email]);
    id = id.rows[0].id;
    console.log("ID FOUND", id); //STOPPOINT
    const user = { username, email, password, id };

    console.log("user", user);
    let temp = await isUserExists(user);
    console.log("temp", temp);
    //if (await !isUserExists(user)) res.status(404).json("Not found");
    if (!temp) return res.status(404).json("Not found");
    console.log("ACCESS_TOKEN_SECRET", process.env.ACCESS_TOKEN_SECRET);
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    console.log("GOT TOKEN: ", accessToken);
    res.json({ accessToken: accessToken });
  };

  register = async (req, res) => {
    const { username, email, role = 1, password = "123" } = req.body;
    const user = { username, email, role, password };
    const result = isUserExists(user);
    console.log("result", await result);
    if (!isUserExists(user)) return res.sendStatus(409);
    //const user = {username,email,role} = req.body
    await db.query(
      `INSERT INTO person (username,email,role,password) values ($1,$2,$3,$4) RETURNING *`,
      [username, email, role, password]
    );
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
    // let a = await db.query(`select * from person`)
    // res.send(a.rows)
  };

  authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    console.log(authHeader.split(" ")[1]);
    // console.log(jwt.decode(token));
    try {
      console.log(jwt.decode(token));
    } catch (error) {
      console.log(error);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      console.log("ok");
      req.user = user;
      next();
    });
  };
  decodetoken = async (req, res) => {
    const token = req.body.token;
    const body = jwt.decode(token);
    // const date = new Date(body.iat*1000).toLocaleString()
    // console.log(date)

    console.log(new Date().toLocaleString("en-US"));

    // if (new Date('September 9, 2021 12:00:00') >= body.exp * 1000) {

    //   console.log('false');
    // }
    // else(console.log('true'))
    console.log("body in decodetoken", body);
    res.send(body);
    // res.json({body:body})
  };
  createActivity = async (req, res) => {
    console.log(req.body);
    const { id, test } = req.body;
    const obj = { id, test };
    await db.query(
      `INSERT INTO activities (activity_name,activity_user_id,activity_created) values ($1,$2,$3) RETURNING *`,
      [test, 3, new Date()]
    );
    res.json({ obj: obj });
  };
}

module.exports = new UserController();
