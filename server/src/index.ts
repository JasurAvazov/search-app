import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

interface User {
  email: string;
  number: string;
}

const users: User[] = [
  { email: 'jim@gmail.com', number: '22-11-22' },
  { email: 'jam@gmail.com', number: '83-03-47' },
  { email: 'john@gmail.com', number: '22-11-22' },
  { email: 'jams@gmail.com', number: '34-94-25' },
  { email: 'jams@gmail.com', number: '14-14-24' },
  { email: 'jill@gmail.com', number: '82-22-87' },
  { email: 'jill@gmail.com', number: '82-22-86' }
];

const app = express();
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

app.post('/api/search', (req: Request, res: Response) => {
  const { email, number } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).send({ error: 'Invalid email' });
  }

  setTimeout(() => {
    const results = users.filter(user =>
      user.email === email && (!number || user.number === number)
    );
    res.json(results);
  }, 5000);
});

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});