const express = require("express");
const multer = require("multer");
// const upload = multer({ dest: 'files/' })
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use("/files", express.static("files"));

app.use(express.json());
app.use(cors());
//mongodb+srv://bablu:<password>@cluster0.t2ecgk8.mongodb.net/?retryWrites=true&w=majority
const mongourl = "mongodb+srv://bablu:bablu@cluster0.t2ecgk8.mongodb.net/?retryWrites=true&w=majority"
  // "mongodb+srv://bablu:bablu@cluster0.ok8ob2s.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
  });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./pdfdetails");
const pdfSchema = mongoose.model("PdfDetails");

const upload = multer({ storage: storage });
app.post("/upload-files", upload.single("file"), async (req, res) => {
  // console.log(req.file);
  const header = req.body.header;
  const title = req.body.title;
  const file = req.file.filename;
  try {
    await pdfSchema.create({ header: header, title: title, file: file });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    pdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});

app.get("/", async (req, res) => {
  res.send("Sucess !!");
});

const PORT = process.env.PORT || 5000;

try {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
} catch (error) {
  console.error("Server startup error:", error);
}
