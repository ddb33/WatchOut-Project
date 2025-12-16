const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String },
    img: { type: String },
    imgTitle: { type: String },
    imgSm: { type: String },
    trailer: { type: String },
    video: { type: String },
    // --- INSERT NEW FIELD HERE ---
    streamingLinks: {
      type: new mongoose.Schema({
        netflix: { type: String },
        hulu: { type: String },
        primeVideo: { type: String },
        disneyPlus: { type: String },
      }, { _id: false }), // _id: false prevents MongoDB from creating an ID for this nested object
    },
    // -----------------------------
    year: { type: String },
    limit: { type: Number },
    genre: { type: String },
    isSeries: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// ... rest of the file
