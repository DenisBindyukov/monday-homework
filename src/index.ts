import express, {Request, Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import bodyParser from 'body-parser';
import cors from 'cors';

// Request<Params, ResBody, ReqBody, ReqQuery>

type BloggerType = {
    id: string
    name: string
    youtubeUrl: string
}

type PostType = {
    title: string
    shortDescription: string
    content: string
    bloggerId: string
}


const firstBloggerId = uuidv4();
const secondBloggerId = uuidv4();
const thirdBloggerId = uuidv4();
const fourthBloggerId = uuidv4();

let bloggers: BloggerType[] = [
    {id: firstBloggerId, name: "Dimych", youtubeUrl: "https://test1.com"},
    {id: secondBloggerId, name: "UBTV", youtubeUrl: "https://test2.com"},
    {id: thirdBloggerId, name: "MININ", youtubeUrl: "https://test3.com"},
    {id: fourthBloggerId, name: "Igor", youtubeUrl: "https://test4.com"}
];

let posts = [
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
        bloggerId: secondBloggerId,
        bloggerName: 'UBTV'
    },
    {
        id: uuidv4(),
        title: "CSS",
        shortDescription: "CSS lesson",
        content: "CSS content",
        bloggerId: thirdBloggerId,
        bloggerName: 'MININ'
    },
    {
        id: uuidv4(),
        title: "Redux",
        shortDescription: "Redux lesson",
        content: "Redux content",
        bloggerId: fourthBloggerId,
        bloggerName: 'Igor'
    },

];


const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5001;

app.get('/', (req: Request, res: Response) => {
    res.status(200).send(posts);
});

app.get('/api/bloggers', (req: Request, res: Response) => {
    res.send(bloggers);
});

app.post('/api/bloggers', (req: Request<{}, {}, BloggerType>, res: Response) => {
    const bloggerId = uuidv4()

    if (!req.body.name.trim() || !req.body.youtubeUrl.trim()) {
        res.send(400);
    }

    const blogger = {
        ...req.body,
        id: bloggerId
    };
    bloggers.push(blogger);
    res.send(200);
});

app.get('/api/bloggers/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const blogger = bloggers.find((el) => el.id === id);

    if (blogger) {
        res.send(blogger);
    } else {
        res.send(404);
    }
});

app.put('/api/bloggers/:id', (req: Request<{ id: string }, {}, BloggerType, {}>, res: Response) => {
    const id = req.params.id;
    const name = req.body.name;
    const youtubeUrl = req.body.youtubeUrl;

    if (typeof name !== 'string' || typeof youtubeUrl !== 'string') {
        res.status(404).send();
        res.send({
            errorMessage: [
                {
                    message: 'incorrect values',
                    fields: `name or youtubeUrl`
                }
            ],
            resultCode: 1
        })
    }
    ;

    if (!name.trim() || !youtubeUrl.trim()) {
        res.status(204).send('no content');
    }

    const blogger = bloggers.find(el => el.id === id);

    if (!blogger) {
        res.send(404);
    }
    bloggers = bloggers.map((el) => el.id === id ? {...el, ...req.body} : el);
    res.send(200);
});

app.delete('/api/bloggers/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const bloggersCurrentLength = bloggers.length;
    bloggers = bloggers.filter((el) => el.id !== id);

    if (bloggers.length < bloggersCurrentLength) {
        res.send(204);
    } else {
        res.send(404);
    }
    ;

});

app.get('/api/posts', (req: Request, res: Response) => {
    res.send(posts);
});

app.post('/api/posts', (req: Request<{}, {}, PostType>, res: Response) => {
    const post = {...req.body};

    for (let prop in post) {
        // @ts-ignore
        if (typeof post[prop] !== 'string') {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: ` must be string`,
                        // @ts-ignore
                        field: `${post[prop]}`,
                    }
                ],
                resultCode: 0
            })
            break
        }
        ;
        // @ts-ignore
        if (!post[prop].trim()) {
            res.send({
                errorsMessages: [
                    {
                        message: ` is required`,
                        // @ts-ignore
                        field: `${post[prop]}`,
                    }
                ],
                resultCode: 0
            })
            break
        }
        ;

        const blogger = bloggers.find(el => el.id === post.bloggerId);
        const newPost = {...post, id: uuidv4(), bloggerName: blogger!.name}
        posts.push(newPost);

        res.status(201).send(newPost);
    }
});

app.put('/api/posts', (req: Request<{}, {}, PostType>, res: Response) => {
    const post = {...req.body};

    for (let prop in post) {
        // @ts-ignore
        if (typeof post[prop] !== 'string') {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: ` must be string`,
                        // @ts-ignore
                        field: `${post[prop]}`,
                    }
                ],
                resultCode: 0
            })
            break
        }

        // @ts-ignore
        if (!post[prop].trim()) {
            res.send({
                errorsMessages: [
                    {
                        message: ` is required`,
                        // @ts-ignore
                        field: `${post[prop]}`,
                    }
                ],
                resultCode: 0
            })
            break
        }

        posts = posts.map(el => el.bloggerId === post.bloggerId ? {...el, ...post} : el);
        const updatedPost = posts.find(el => el.bloggerId === post.bloggerId);

        if (!updatedPost) {
            res.status(404).send()
        }

        res.status(201).send(updatedPost);
    }
});

app.get('/api/posts/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const post = posts.find((el) => el.id === id);

    if (post) {
        res.send(post);
    } else {
        res.send(404);
    }
});

app.delete('/api/posts/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;

    if (!id) {
        res.status(204).send()
    }

    const post = posts.find(el => el.id === id);
    if (!post) {
        res.status(404).send()
        return
    }

    posts = posts.filter((el) => el.id !== id);
    res.send(200);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});