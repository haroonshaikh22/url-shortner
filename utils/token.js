import { userTokenSchema } from "../validations/token.validation.js";
import jwt from "jsonwebtoken";

export function createUserToken (payload) {
    console.log(payload,"payload--");
    

    const validationResult = userTokenSchema.safeParse(payload);

    if(validationResult.error) throw new Error(validationResult.error.message)

 const payloadValidatedData = validationResult.data;

 console.log();
 

 const token = jwt.sign(payloadValidatedData, process.env.JWT_SECRET)

 return token;
    


}

export function verifyUserToken(token) {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, payload };
    } catch (error) {
        return null;
    }
}   