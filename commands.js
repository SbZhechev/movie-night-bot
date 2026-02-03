import { ADD_SUGGESTION_COMMAND } from "./commands/suggestions/add/addSuggestionCommand.js";
import { MOVE_SUGGESTION_COMMAND } from "./commands/suggestions/move/moveSuggestionCommand.js";
import { EDIT_SUGGESTION_COMMAND } from "./commands/suggestions/edit/editSuggestionCommand.js";
import { DELETE_SUGGESTION_COMMAND } from "./commands/suggestions/delete/deleteSuggestionCommand.js";
import { PREVIEW_POLL_COMMAND } from "./commands/polls/preview/previewPollCommand.js";
import { CREATE_POLL_COMMAND } from "./commands/polls/create/createPollCommand.js";
import { GET_LIST_COMMAND } from "./commands/list/get/getListCommand.js";
import { SET_LIST_COMMAND } from "./commands/list/set/setListCommand.js";
import { InstallGlobalCommands } from "./discordUtils.js";

const ALL_COMMANDS = [
  ADD_SUGGESTION_COMMAND,
  MOVE_SUGGESTION_COMMAND,
  EDIT_SUGGESTION_COMMAND,
  DELETE_SUGGESTION_COMMAND,
  PREVIEW_POLL_COMMAND,
  CREATE_POLL_COMMAND,
  GET_LIST_COMMAND,
  SET_LIST_COMMAND
];

InstallGlobalCommands(ALL_COMMANDS);