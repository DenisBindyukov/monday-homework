import express, {Request, Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import bodyParser from 'body-parser';
import cors from 'cors';

type BloggerType = {
    id: string
    name: string
    youtubeUrl: string
}


const firstBloggerId = uuidv4();
const secondBloggerId = uuidv4();
const thirdBloggerId = uuidv4();
const fourthBloggerId = uuidv4();

let bloggers: BloggerType[] = [
    {id: firstBloggerId, name: "IT-Kamasutra", youtubeUrl: "https://test1.com"},
    {id: secondBloggerId, name: "UBTV", youtubeUrl: "https://test2.com"},
    {id: thirdBloggerId, name: "MININ", youtubeUrl: "https://test3.com"},
    {id: fourthBloggerId, name: "SomeThing", youtubeUrl: "https://test4.com"}
];

const posts = [
    {
        id: uuidv4(),
        title: "React",
        shortDescription: "React lesson",
        content: "React content",
        bloggerId: firstBloggerId,
        bloggerName: 'Dimych'
    },
    {
        id: uuidv4(),
        title: "HTML",
        shortDescription: "HTML lesson",
        content: "HTML content",
        bloggerId: firstBloggerId,
        bloggerName: 'Vlad'
    },
    {
        id: uuidv4(),
        title: "CSS",
        shortDescription: "CSS lesson",
        content: "CSS content",
        bloggerId: firstBloggerId,
        bloggerName: 'Vladilen'
    },
    {
        id: uuidv4(),
        title: "Redux",
        shortDescription: "Redux lesson",
        content: "Redux content",
        bloggerId: firstBloggerId,
        bloggerName: 'Igor'
    },

];


const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5001;

app.get('/', (req: Request, res: Response) => {
    res.send('Home work 1');
});

app.get('/api/bloggers', (req: Request, res: Response) => {
    res.send(bloggers);
});

app.post('/api/bloggers', (req: Request<{}, {}, BloggerType>, res: Response) => {
    const blogger = {
        ...req.body,
        id: uuidv4()
    };
    bloggers.push(blogger);
    res.send(200);
});

app.get('/api/bloggers/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const blogger = bloggers.find((el) => el.id === id)

    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }

});

app.delete('/api/bloggers/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const bloggersCurrentLength = bloggers.length
    bloggers = bloggers.filter((el) => el.id !== id)

    if (bloggers.length < bloggersCurrentLength) {
        res.send(204)
    } else {
        res.send(404)
    }

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});