const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const timerRouter = require('./routes/timer.routes')
const PORT = 8080;
const app = express();
let mime = require("mime");
var fs = require("fs");
const zlib = require("zlib");

app.use(cors());
app.use(express.json());
app.use("/api", userRouter);
app.use("/timer",timerRouter)
process.on('SIGTERM', () => {
    console.log('Process terminated')
  })
  process.on('SIGINT', () => {
    console.log('Process terminated')
  })
app.post("/download", function (req, res) {
  // let buf = "";
  req.setEncoding("base64");
  let written = "";
  req.on("data", function (chunk) {
    // console.log(chunk);
    // buf += chunk;
    console.log(chunk);
    fs.appendFileSync(__dirname + "/upload-folder/test1.jpeg", chunk, "base64");
  });
  req.on("end", function () {
    try {
      // fs.writeFileSync(__dirname + "/upload-folder/test1.jpeg", buf, "base64");
      // const path1 = path.resolve("./upload-folder/test1.jpeg");
      // fs.writeFileSync(path, buf, "base64");
      // let fileStream = fs.createReadStream(buf);
      // fileStream.pipe(res);
      // res.setHeader("Content-disposition", "attachment; filename=test1.jpeg");
      // const myMime = new Mime()
      // res.setHeader("Content-type", "image/jpeg");
      
      res.send("ok");
    } catch (error) {
      console.log(error);
      res.status(400);
      res.send(error);
    }
  });
  //   var file = __dirname + "/upload-folder/dramaticpenguin.MOV";
  //   var filename = path.basename(file)

  //   var mimetype = mime.lookup(file);
  //   res.setHeader("Content-disposition", "attachment; filename=" + filename);
  //   res.setHeader("Content-type", mimetype);
  //   var filestream = fs.createReadStream(file);
  //   filestream.pipe(res);
  //=====================================================
  //   let readableStream = fs.createReadStream("test.txt", "utf8");

  //   let writeableStream = fs.createWriteStream("test.zip");
  //   let gzip = zlib.createGzip();

  //   readableStream.pipe(gzip).pipe(writeableStream);

  //   var file = __dirname + "/upload-folder/testImage.jpeg";
  //   var filename = path.basename(file);
  //   var mimetype = mime.lookup(file);
  //   res.setHeader("Content-disposition", "attachment; filename=" + filename);
  //   res.setHeader("Content-type", mimetype);
  //   var filestream = fs.createReadStream(file);
  //   filestream.pipe(res);
});
app.listen(PORT, () => console.log(`Started on ${PORT}`));
