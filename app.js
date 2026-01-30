import 'dotenv/config';
import express from 'express';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware
} from 'discord-interactions';
import { handleAddCommand } from './commands/suggestions/add/addSuggestionCommandHandler.js';
import { handleMoveCommand } from './commands/suggestions/move/moveSuggestionCommandHandler.js';
import { handleDeleteComman } from './commands/suggestions/delete/deleteSuggestionCommandHandler.js';
import { COMMANDS_NAMES } from './constants.js';
import fs, { access, constants } from 'fs';
import { suggestionsFilePath } from './fileUtils.js';

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
      case COMMANDS_NAMES.MOVE_SUGGESTION:
        return handleMoveCommand(res, data);
      case COMMANDS_NAMES.DELETE_SUGGESTION:
        return handleDeleteComman(res, data);
      default:
        console.error(`unknown command: ${name}`);
        return res.status(400).json({ error: 'unknown command' });
    }
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

access(suggestionsFilePath, constants.F_OK, (err) => {
  // if file doesn't exist, create it
  if (err) {
    fs.writeFileSync(suggestionsFilePath, 'movie,watched,participated,theme', { flag: 'w' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});