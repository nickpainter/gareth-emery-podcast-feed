Gareth Emery Podcast RSS Feed Generator
=================
The Gareth Emery Podcast was removed from the iTunes and Google podcast repositories after Gareth released his new Electric For Life podcast.  Unfortunately this made it difficult for longtime listeners to listen to old episodes within their favorite podcast app.  The goal of this project was to host the podcast on archive.org and dynamically generate a publicly available RSS feed that could be re-uploaded to podcast repositories.  This would allow older fans to listen to the podcast while eliminating hosting costs that prevented emery from continuing to offer the podcast on iTunes ect.


Project Layout
------------

On the front-end,
- edit `public/client.js`, `public/style.css` and `views/index.html`
- drag in `assets`, like images or music, to add them to your project

On the back-end,
- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)
