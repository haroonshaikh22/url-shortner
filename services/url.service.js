import db from "../db/index.js";
import { urlsTable } from "../models/url.model.js";


export async function createShortUrl(userId, url, shortCode) {

      const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetUrl: url,
      userId: userId,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetUrl: urlsTable.targetUrl,
    });

 

  return result;
}