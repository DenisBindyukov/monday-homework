import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5001;

app.get('/', (req: Request, res: Response ) => {
    res.send('Home work 1')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});