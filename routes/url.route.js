import express from "express";
import { shortenPostRequestBodySchema } from "../validations/request.validation.js";
import db from "../db/index.js";
import { urlsTable, usersTable } from "../models/index.js";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
import { createShortUrl } from "../services/url.service.js";
import { and, eq } from "drizzle-orm";
import { log } from "console";

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


router.get("/codes", ensureAuthenticated, async function (req, res) {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, req.user.payload.id));

  return res.json({ codes });
});

router.delete("/:id", ensureAuthenticated, async function (req, res) {
  const id = req.params.id;

  const result = await db
    .delete(urlsTable)
    .where(
      and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.payload.id)),
    );

  return res.status(200).json({ message: "Short URL deleted successfully" });
});

router.get("/:shortCode", async function (req, res) {
  const code = req.params.shortCode;

  const [result] = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.redirect(result.targetUrl);
});

export default router;
