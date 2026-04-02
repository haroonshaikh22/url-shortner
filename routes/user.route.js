import express from "express";
import {
  loginPostRequestBodySchema,
  signupPostRequestBodySchema,
} from "../validations/request.validation.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { createNewUser, getUserByEmail } from "../services/user.service.js";
import { createUserToken } from "../utils/token.js";

const router = express.Router();

// Define your user-related routes here
router.get("/", (req, res) => {
  res.send("User route");
});

router.post("/signup", async (req, res) => {
  console.log("BODY:", req.body);
  // Handle user signup logic here
  const validationResult = await signupPostRequestBodySchema?.safeParseAsync(
    req?.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult?.error?.format() });
  }

  const { firstname, lastname, email, password } = validationResult?.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser)
    return res.status(400).json({ error: "Email already exists" });

  const { password: hashedPassword, salt } = hashPasswordWithSalt(password);

  const createdUser = await createNewUser(
    firstname,
    lastname,
    email,
    hashedPassword,
    salt,
  );

  return res.status(201).json({
    data: { userId: createdUser.id },
  });
});

router.post("/login", async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParse(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const { password: hashedPassword } = hashPasswordWithSalt(
    password,
    existingUser.salt,
  );

  if (existingUser.password !== hashedPassword) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = await createUserToken({ id: existingUser.id });
  return res.status(200).json({ data: { token } });
});

export default router;
