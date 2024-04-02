const express = require("express");
const bodyParser = require("body-parser");
const ImageDataURI = require("image-data-uri");
const axios = require("axios");
const fs = require("fs");
const { ImgurClient } = require("imgur");

const cors = require("cors");

const app = express();
const port = 3002;

// const client = new ImgurClient({
//   clientId: process.env.IMGUR_CLIENT_ID,
//   clientSecret: process.env.IMGUR_CLIENT_SECRET,
//   refreshToken: process.env.IMGUR_REFRESH_TOKEN,
// });

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static("public"));

app.post("/send_bot_notification", async (req, res) => {
  try {
    const date = new Date().getTime();
    const filePath = `./public/${date}.jpg`;

    await ImageDataURI.outputFile(req.body.imade_data, filePath);

    
    // const response = await client.upload({
    //   image: fs.createReadStream(filePath),
    //   type: "stream",
    // });

    // if (!response?.data?.link) {
    //   return;
    // }

    await axios
      .post(
        `https://chatter.salebot.pro/api/32cece2b975d1f7657e0e3f136f7f32b/message`,
        {
          message: req.body.message,
          client_id: req.body.client_id,
          attachment_type: "image",
          attachment_url: `https://notifications.mamamoonkids.ru/public/${filePath.replace('./public/', '')}`,
        }
      )
      .then(function (response) {
        console.log(response);
      });

    res.json({ status: 200 });

    fs.unlink(filePath, () => {});
  } catch (e) {
    console.log(e);

    res.json({ status: 400 });

    fs.unlink(filePath, () => {});
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
