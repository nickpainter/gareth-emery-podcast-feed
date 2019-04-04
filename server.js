// server.js
// where your node app starts

// init project
const express = require("express");
const xmlHelper = require("xml-js");
const axios = require("axios");
const app = express();
const Podcast = require("podcast");
const addDays = require("date-fns/add_days");
const getDate = require("date-fns/get_date");
const path = require('path');
const nocache = require('nocache')

app.use(nocache());

let xml;

async function getData() {
  return await axios.get(
    "http://ia601408.us.archive.org/27/items/TheGarethEmeryPodcast/TheGarethEmeryPodcast_files.xml"
    //"http://ia601400.us.archive.org/9/items/TheGarethEmeryPodcast001/TheGarethEmeryPodcast001_files.xml"
  );
}

const start = async function() {
  const result = await getData();

  const feed = new Podcast({
    title: "Gareth Emery Podcast",
    description: "The Gareth Emery Podcast",
    feed_url: "https://garethemerypodcast.glitch.me/",
    site_url: "https://garethemerypodcast.glitch.me/",
    image_url: 'https://ia601408.us.archive.org/27/items/TheGarethEmeryPodcast/GarethEmeryPodcast.jpg',
    //image_url: "https://i.imgur.com/jrjmCbI.jpg",
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
          text: "Trance"
        }
      ]
    },
    itunesImage: 'https://ia601408.us.archive.org/27/items/TheGarethEmeryPodcast/GarethEmeryPodcast.jpg'//
    //itunesImage: "https://i.imgur.com/jrjmCbI.jpg"
  });

  var options = { ignoreComment: true, alwaysChildren: true };
  var finalResult2 = xmlHelper.xml2js(result.data, { compact: true });
  let fileNames = [];

  finalResult2 = finalResult2.files.file.filter(x => {
    return (
      x._attributes.name.substring(x._attributes.name.length - 4) === ".mp3"
    );
  });
  finalResult2 = finalResult2.map(x => (
    {
    name: (x.title && x.title._text && (x.title._text.indexOf('(') >= 0) && x.title._text) || (x._attributes && path.parse(x._attributes.name).name),
    fileName: x._attributes && x._attributes.name,
    extension: x._attributes && path.parse(x._attributes.name).ext,
    length: x.length && x.length._text,
    size: x.size && x.size._text,
    format: x.format && x.format._text,
    title: (x.title && x.title._text) || (x._attributes && x._attributes.name)
  }));

  //finalResult2.map(x => console.log(x));
  
  finalResult2.map((fileData, index) => {
    feed.addItem({
      title: fileData.name,
      description: `${fileData.title}`,
      //url: `http://ia601408.us.archive.org/27/items/TheGarethEmeryPodcast/${fileName.substring(fileName.length-4)}.mp3`, // link to the item ////
      url: encodeURI(`http://ia601408.us.archive.org/27/items/TheGarethEmeryPodcast/${
        fileData.fileName
      }`),
      //guid: index, // optional - defaults to url
      categories: ["Music"], // optional - array of item categories
      author: "Gareth Emery", // optional - defaults to feed author property
      //date: 'May 27, 2012', // any format that js Date can parse.
      date: addDays(addDays(new Date(), -365), index),
      lat: 33.417974, //optional latitude field for GeoRSS
      long: -111.933231, //optional longitude field for GeoRSS
      //enclosure : {url:`http://ia601400.us.archive.org/9/items/TheGarethEmeryPodcast001/${fileName}`}, //{url:'...', file:'path-to-file'}, // optional enclosure
      enclosure: {
        url: encodeURI(`http://ia601408.us.archive.org/27/items/TheGarethEmeryPodcast/${
          fileData.fileName
        }`)
      },

      itunesAuthor: "Gareth Emery",
      itunesExplicit: true,
      itunesSubtitle: "Original Gareth Emery Podcast",
      itunesSummary: "An archive of the original Gareth Emery Podcast.",
      itunesDuration: fileData.length,
      itunesKeywords: ["trance", "house", "techno"]
    });
  });

  // cache the xml to send to clients
  xml = feed.buildXml();
  console.log('xml built');

  app.get("/rss", function(request, response) {
    response.set("Content-Type", "text/xml");
    response.setHeader("Expires", 0);
    //response.setHeader("Cache-Control", "no-cache");
    response.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    response.send(xml);
  });
};

start();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
//app.use(express.static("public"));
app.use(nocache());

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

/*
app.get('/rss', function(request, response) {
  response.send(xml);
});
*/

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
