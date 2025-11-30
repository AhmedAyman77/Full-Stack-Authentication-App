import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/erroMiddleware.js';
import userRouter from './routes/userRoutes.js';

(async() => {
    dotenv.config();

    await connectDB();

    const app = express();
    app.use(express.json()); // to accept json data in request body
    app.use(express.urlencoded({ extended: true })); // to accept url encoded data in request body
    app.use(cookieParser());

    if (process.env.NODE_ENV === 'production') {
        const __dirname = path.resolve();
        app.use(express.static(path.join(__dirname, 'client', 'dist')));

        app.get('*', (req, res) =>
            res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
        );
    } else {
        app.get('/', (req, res) => {
            res.send('API is running....');
        });
    }

    // routes
    app.use('/api/users', userRouter);

    app.use(notFound); // middleware to handle 404 errors(not matched routes)
    app.use(errorHandler); // middleware to handle other errors

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();