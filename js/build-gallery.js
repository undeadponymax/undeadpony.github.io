const fs = require("fs");
const path = require("path");

const BASE = "galleries";
const OUTPUT = "data/galleries.json";

const galleries = {};

const imageExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

for (const galleryName of fs.readdirSync(BASE)) {
  const dir = path.join(BASE, galleryName);
  if (!fs.statSync(dir).isDirectory()) continue;

  const files = fs.readdirSync(dir)
    .filter(file => imageExt.includes(path.extname(file).toLowerCase()))
    .sort()
    .map(file => `${BASE}/${galleryName}/${file}`);

  galleries[galleryName] = files;
}

fs.mkdirSync("data", { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(galleries, null, 2));

console.log("Gallery JSON generated:", OUTPUT);
