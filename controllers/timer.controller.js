const db = require("../db");

process.on("uncaughtException", (err) => {
  console.log(`Caught exception: ${err.message}`);
});
class TimerController {
  getTime = async (req, res) => {
    console.log(req.body);
    const { id, test } = req.body;
    const obj = { id, test };
    const data = await db.query(`select * from person`);
    res.json({ data: data.rows });
  };
  createActivity = async (req, res) => {
    console.log("body of createActivity", req.body);
    const { activity_name, activity_userId, activity_time } = req.body;
    const obj = { activity_name, activity_userId, activity_time };
    console.log("obj", obj, "act", req.body.activity_name);
    const result = await db.query(
      `INSERT INTO activities (activity_name,activity_user_id,activity_time) values ($1,$2,$3) RETURNING *`,
      [activity_name, activity_userId, activity_time]
    );
    res.json({ result: result.rows });
    // res.json{}
  };
  getActivities = async (req, res) => {
    //ne prihodit v body STOPPOINT
    const userID = req.params.id;
    const result = await db.query(
      `select * from activities where activity_user_id=($1)`,
      [userID]
    );
    console.log("proverochka", result.rows);
    res.json({ result: result.rows });
  };
  getActivitiesDistinct = async (req, res) => {
    const userID = req.params.id;
    console.log("userID:", userID);
    // const result = await db.query(
    //   `select distinct "activity_name" from "activities" where "activity_user_id"=$1`,
    //   [userID]
    // );
    const result = await db.query(
      `select distinct activity_name from activities where "activity_user_id"=${userID}`
    );
    console.log(result.rows);
    res.json({ result: result.rows });
  };
}
module.exports = new TimerController();
