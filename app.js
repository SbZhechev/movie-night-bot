import 'dotenv/config';
import express from 'express';
import {
  InteractionResponseType,
  InteractionType,
} from 'discord-interactions';
import { handleAddCommand } from './commands/suggestions/add/addSuggestionCommandHandler.js';
import { handleMoveCommand } from './commands/suggestions/move/moveSuggestionCommandHandler.js';
import { handleEditCommand } from './commands/suggestions/edit/editSuggestionCommandHandler.js';
import { handleDeleteCommand } from './commands/suggestions/delete/deleteSuggestionCommandHandler.js';
import { handlePreviewCommand } from './commands/polls/preview/previewPollCommandHandler.js';
import { handleCreatePollCommand } from './commands/polls/create/createPollCommandHandler.js';
import { COMMANDS_NAMES } from './constants.js';
import { createPollEndedMessage } from './discordUtils.js';
import { verifyCrobJobRequest, verifyDiscordRequest } from './verifyUtils.js';
import { handleUpdateList } from './commands/utils.js';

const app = express();
const port = 3000;

app.use(express.raw({ type: 'application/json' }));

app.post('/interactions', async function (req, res) {
  const isValid = await verifyDiscordRequest(req);

  if (!isValid) return res.status(401).send("Invalid signature");

  const body = JSON.parse(req.body.toString('utf-8'));
  const { type, data, channel_id, member, message } = body;

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
      case COMMANDS_NAMES.EDIT_SUGGESTION:
        return handleEditCommand(res, data);
      case COMMANDS_NAMES.DELETE_SUGGESTION:
        return handleDeleteCommand(res, data);
      case COMMANDS_NAMES.PREVIEW_POLL:
        return handlePreviewCommand(res, data);
      case COMMANDS_NAMES.CREATE_POLL:
        return handleCreatePollCommand(res, data, channel_id, member);
      default:
        console.error(`unknown command: ${name}`);
        return res.status(400).json({ error: 'unknown command' });
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    return handleUpdateList(res, message, member);
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.post('/pollEnded', async (req, res) => {
  const isValid = await verifyCrobJobRequest(req);
  if (!isValid) return res.status(401).json({ error: "Unauthorized" });

  const body = JSON.parse(req.body.toString('utf-8'));
  const { channelId, pollMessageId, user } = body;
  await createPollEndedMessage(channelId, pollMessageId, user);

  res.sendStatus(200);
});

app.get('/', async (req, res) => {
  res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});