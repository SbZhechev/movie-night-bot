import { ADD_SUGGESTION_COMMAND } from "./commands/suggestions/add/addSuggestionCommand.js";
import { MOVE_SUGGESTION_COMMAND } from "./commands/suggestions/move/moveSuggestionCommand.js";
import { EDIT_SUGGESTION_COMMAND } from "./commands/suggestions/edit/editSuggestionCommand.js";
import { DELETE_SUGGESTION_COMMAND } from "./commands/suggestions/delete/deleteSuggestionCommand.js";
import { PREVIEW_POLL_COMMAND } from "./commands/polls/preview/previewPollCommand.js";
import { CREATE_POLL_COMMAND } from "./commands/polls/create/createPollCommand.js";
import { InstallGlobalCommands } from "./discordUtils.js";

const ALL_COMMANDS = [
  ADD_SUGGESTION_COMMAND,
  MOVE_SUGGESTION_COMMAND,
  EDIT_SUGGESTION_COMMAND,
  DELETE_SUGGESTION_COMMAND,
  PREVIEW_POLL_COMMAND,
  CREATE_POLL_COMMAND
];

InstallGlobalCommands(ALL_COMMANDS);