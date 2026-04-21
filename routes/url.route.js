import express from "express";
import { shortenPostRequestBodySchema } from "../validations/request.validation.js";
import db from "../db/index.js";
import { urlsTable, usersTable } from "../models/index.js";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
import { createShortUrl } from "../services/url.service.js";

const router = express.Router();

router.post("/shorten", ensureAuthenticated, async function (req, res) {
  

  const validationResults = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResults.error) {
    console.log("2222", validationResults.error);
    
    return res.status(400).json({ error: validationResults.error });
  }

  const { url, code } = validationResults.data;

  const shortCode = code ?? nanoid(6);



const createShortUrlResult = await createShortUrl(
  req.user.payload.id,
  url,
  shortCode,
);
    
 return res.status(201).json({
    id: createShortUrlResult.id,
    shortCode: createShortUrlResult.shortCode,
    targetUrl: createShortUrlResult.targetUrl,
  });

});

export default router;
