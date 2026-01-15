import 'dotenv/config';
import express from 'express';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware
} from 'discord-interactions';
import { handleTestCommand } from './commandHandlers.js';

const app = express();
const port = 3000;

app.use(verifyKeyMiddleware(process.env.PUBLIC_KEY));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/interactions', async function (req, res) {
  const { id, type, data } = req.body;

  // Handle verification requests
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Handle slash command requests
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    switch (name) {
      case 'hello':
        return handleTestCommand(res);
      default:
        console.error(`unknown command: ${name}`);
        return res.status(400).json({ error: 'unknown command' });
    }
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});