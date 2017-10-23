require('dotenv').config();

const fs = require("fs");

const HOSTS = process.env.SITE_HOSTS.split(",");

let manifest = JSON.parse(fs.readFileSync("./manifest.json"));

manifest.permissions = HOSTS;
manifest.content_scripts = manifest.content_scripts.map(item => Object.assign({}, item, {
  matches: HOSTS
}));

fs.writeFileSync("./DTX/manifest.json", JSON.stringify(manifest));