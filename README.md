# Gareth Emery Podcast RSS Feed Generator

The Gareth Emery Podcast was removed from the iTunes and Google podcast repositories after Gareth released his new Electric For Life podcast. Unfortunately, this made it difficult for longtime listeners to listen to old episodes within their favorite podcast app. The goal of this project was to host the podcast on archive.org and dynamically generate a publicly available RSS feed that could be re-uploaded to podcast repositories. This would allow older fans to listen to the podcast while eliminating hosting costs that prevented Emery from continuing to offer the podcast on iTunes ect.

The public feed used in the iTunes and Google Play stores is available at: https://garethemerypodcast.glitch.me/rss

This project can be easily modified to generate an RSS feed for any files that are hosted on archive.org. Hopefully this will be useful to others who want to make older podcast content available for everyone in the future.

## Project Layout

On the front-end,

- edit `public/client.js`, `public/style.css` and `views/index.html`
- drag in `assets`, like images or music, to add them to your project

On the back-end,

- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)

## Feed redirection plan

Old Url: https://garethemerypodcast.glitch.me/rss

New Url: https://raw.githubusercontent.com/nickpainter/gareth-emery-podcast-feed/master/rss.xml

https://support.pocketcasts.com/knowledge-base/podcast-feed-redirection/

### Steps

1. Insert this tag into your existing podcast feed, inside the channel tag: `<itunes:new-feed-url>[your-new-feed-URL-goes-here]</itunes:new-feed-url>`

2. Set your web server to return an HTTP 301 response and redirect when receiving a request for the old feed.
