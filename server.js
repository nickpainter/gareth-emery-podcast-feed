require("dotenv").config();
const express = require("express");
const xmlHelper = require("xml-js");
const axios = require("axios");
const app = express();
const Podcast = require("podcast").Podcast;
const { addDays, getDate } = require("date-fns");
const path = require("path");
const nocache = require("nocache");

app.use(nocache());

let xml;

async function getData() {
  return await axios.get(
    "https://archive.org/download/TheGarethEmeryPodcast/TheGarethEmeryPodcast_files.xml"
  );
}

const start = async function () {
  const result = await getData();

  const feed = new Podcast({
    title: "Gareth Emery Podcast",
    description: "The Gareth Emery Podcast",

    feedUrl: "https://nickpainter.github.io/gareth-emery-podcast-feed",
    siteUrl: "https://nickpainter.github.io/gareth-emery-podcast-feed",

    generator: "https://nickpainter.github.io/gareth-emery-podcast-feed",
    imageUrl: "https://archive.org/download/TheGarethEmeryPodcast/GarethEmeryPodcast.jpg",
    docs: "http://example.com/rss/docs.html",
    author: "Gareth Emery",
    managingEditor: "",
    webMaster: "Nick Painter",
    copyright: "",
    language: "en",
    categories: ["Music"],
    pubDate: "May 20, 2012 04:00:00 GMT",
    ttl: "1",
    itunesAuthor: "Gareth Emery",
    itunesSubtitle: "Archive of the entire original podcast",
    itunesSummary:
      "An archive of the Gareth Emery podcast which was first broadcast in March 2006. This podcast has been nominated for Best Podcast at the Miami Winter Music Conference's International Dance Music Awards three times.  In November 2014, Emery announced that Episode 310 would be the final episode of the Gareth Emery Podcast.  Its spiritual successor is the Electric For Life podcast which was also created by Gareth Emery.  This podcast was removed from its original host which made it difficult for nostalgic fans to listen to.  Finally, it is available within iTunes once again for all to enjoy Gareth's masterful mixes.",
    itunesOwner: { name: "Nick Painter", email: "nickcpainter@gmail.com." },
    itunesExplicit: true,
    itunesCategory: {
      text: "Music",
      subcats: [
        {
          text: "Trance",
        },
      ],
    },
    itunesImage:
      "https://archive.org/download/TheGarethEmeryPodcast/GarethEmeryPodcast.jpg",
      siteUrl: "https://nickpainter.github.io/gareth-emery-podcast-feed",
  });

  var options = { ignoreComment: true, alwaysChildren: true };
  var finalResult2 = xmlHelper.xml2js(result.data, { compact: true });
  let fileNames = [];

  finalResult2 = finalResult2.files.file.filter((x) => {
    return (
      x._attributes.name.substring(x._attributes.name.length - 4) === ".mp3"
    );
  });
  finalResult2 = finalResult2.map((x) => ({
    name:
      (x.title &&
        x.title._text &&
        x.title._text.indexOf("(") >= 0 &&
        x.title._text) ||
      (x._attributes && path.parse(x._attributes.name).name),
    fileName: x._attributes && x._attributes.name,
    extension: x._attributes && path.parse(x._attributes.name).ext,
    length: x.length && x.length._text,
    size: x.size && x.size._text,
    format: x.format && x.format._text,
    title: (x.title && x.title._text) || (x._attributes && x._attributes.name),
  }));

  finalResult2.map((fileData, index) => {
    feed.addItem({
      title: fileData.name,
      description: `${fileData.title}`,
      url: encodeURI(
        `https://archive.org/download/TheGarethEmeryPodcast/${fileData.fileName}`
      ),
      //guid: index, // optional - defaults to url
      categories: ["Music"], // optional - array of item categories
      author: "Gareth Emery", // optional - defaults to feed author property
      //date: 'May 27, 2012', // any format that js Date can parse.
      date: addDays(addDays(new Date(), -365), index),
      // latitude and longitude of Manchester UK are: 53.483959, -2.244644.
      lat: 53.483959, //optional latitude field for GeoRSS
      long: -2.244644, //optional longitude field for GeoRSS
      //enclosure : {url:`http://ia601400.us.archive.org/9/items/TheGarethEmeryPodcast001/${fileName}`}, //{url:'...', file:'path-to-file'}, // optional enclosure
      enclosure: {
        url: encodeURI(
          `https://archive.org/download/TheGarethEmeryPodcast/${fileData.fileName}`
        ),
      },
      itunesAuthor: "Gareth Emery",
      itunesExplicit: true,
      itunesSubtitle: "Original Gareth Emery Podcast",
      itunesSummary: "An archive of the original Gareth Emery Podcast.",
      itunesDuration: fileData.length,
      itunesNewFeedUrl: `https://nickpainter.github.io/gareth-emery-podcast-feed`,
      // itunesKeywords: ["trance", "house", "techno"], // property has been deprecated by apple, we don't know if other platform still use this when it is provided
    });
  });

  xml = feed.buildXml();
  console.log("xml built");

  // app.get("/rss", function (request, response) {
  //   response.set("Content-Type", "text/xml");
  //   response.setHeader("Expires", 0);
  //   response.set(
  //     "Cache-Control",
  //     "no-store, no-cache, must-revalidate, private"
  //   );
  //   response.send(xml);
  // });

  // write the rss file to the docs folder
  // the file must be named "index" in order for it to be picked up by GitHub Pages
  // and used for https://nickpainter.github.io/gareth-emery-podcast-feed/
  const fs = require("fs");
  const docsPath = path.join(__dirname, "docs", "index.xml");
  fs.writeFile(docsPath, xml, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("index.xml written to docs folder");
    }
  });
};

start();

app.use(nocache());

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
