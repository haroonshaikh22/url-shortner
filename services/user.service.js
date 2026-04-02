import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";

export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      firstname: usersTable.firstName,
      lastname: usersTable.lastName,
      email: usersTable.email,
      salt: usersTable.salt,
        password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return existingUser;
}


export async function createNewUser(firstname, lastname, email, hashedPassword, salt) {

    const [user] = await db
    .insert(usersTable)
    .values({
      firstName: firstname,
      lastName: lastname,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({
      id: usersTable.id,
    });

    return user;

}
