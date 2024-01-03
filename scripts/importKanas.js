import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse";

import db from "../src/services/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Créé un kana
 */
const createKana = async (type, romaji, kana) =>
  await db.kanas.create({
    data: { type, romaji, kana }
  });

const main = async () => {
  await db.kanas.deleteMany({ where: {} });

  fs.createReadStream(path.resolve(__dirname, "hiragana.csv"))
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function(row) {
      await createKana("HIRAGANAS", row[0], row[1]);
    });

  fs.createReadStream(path.resolve(__dirname, "katakana.csv"))
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function(row) {
      await createKana("KATAKANAS", row[0], row[1]);
    });
};

main();
