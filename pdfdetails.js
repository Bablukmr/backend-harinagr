const mongoose = require("mongoose");

const pdfDetailsSchema = new mongoose.Schema(
  {
    header: String,
    title: String,
    file: String,
  },
  { collection: "PdfDetails" } 
);

mongoose.model("PdfDetails", pdfDetailsSchema);
