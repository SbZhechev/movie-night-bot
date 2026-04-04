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
import { handleGetCommand } from './commands/list/get/getListCommandHandler.js';
import { handleSetCommand } from './commands/list/set/setListCommandHandler.js';
import { COMMANDS_NAMES } from './constants.js';
import fs, { access, constants } from 'fs';
import { suggestionsFilePath } from './fileUtils.js';
import { createPollEndedMessage } from './discordUtils.js';
import { verifyCrobJobRequest, verifyDiscordRequest } from './verifyUtils.js';
import { handleUpdateList } from './commands/list/update/updateListHandler.js';

const app = express();
const port = 3000;

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.post('/interactions', async function (req, res) {
  const isValid = verifyDiscordRequest(req);
  if (!isValid) return res.status(401).send("Invalid signature");

  const { type, data, channel_id, member, message } = req.body;

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
      case COMMANDS_NAMES.GET_LIST:
        return handleGetCommand(res);
      case COMMANDS_NAMES.SET_LIST:
        return handleSetCommand(res, data)
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

  const { channelId, pollMessageId, user } = req.body;
  await createPollEndedMessage(channelId, pollMessageId, user);

  res.sendStatus(200);
});

access(suggestionsFilePath, constants.F_OK, (err) => {
  // if file doesn't exist, create it
  if (err) {
    console.log('Suggestions file was created!');
    fs.writeFileSync(suggestionsFilePath, 'title,watched,participated,theme', { flag: 'w' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});