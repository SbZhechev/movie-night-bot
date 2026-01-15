import 'dotenv/config';
import express from 'express';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware
} from 'discord-interactions';
import { handleAddCommand } from './commands/suggestions/add/addSuggestionCommandHandler.js';
import { COMMANDS_NAMES } from './constants.js';
import fs, { access, constants } from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(verifyKeyMiddleware(process.env.PUBLIC_KEY));

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
      case COMMANDS_NAMES.ADD_SUGGESTION:
        return handleAddCommand(res, data);
      default:
        console.error(`unknown command: ${name}`);
        return res.status(400).json({ error: 'unknown command' });
    }
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

const suggestionsFilePath = path.join(path.resolve(), 'suggestions.csv');

access(suggestionsFilePath, constants.F_OK, (err) => {
  // if file doesn't exist, create it
  if (err) {
    fs.writeFileSync(suggestionsFilePath, 'movie,watched,participated,season', { flag: 'w' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});