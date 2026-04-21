import express from 'express';
import userRouter from './routes/user.route.js';
import { authenticationMiddleware } from './middleware/auth.middleware.js';
import urlRouter from './routes/url.route.js'


const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json()); 

app.use(authenticationMiddleware);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the URL Shortener API" });
});



app.use('/user', userRouter);

app.use(urlRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 