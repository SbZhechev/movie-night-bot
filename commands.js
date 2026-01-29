import { ADD_SUGGESTION_COMMAND } from "./commands/suggestions/add/addSuggestionCommand.js";
import { MOVE_SUGGESTION_COMMAND } from "./commands/suggestions/move/moveSuggestionCommand.js";
import { InstallGlobalCommands } from "./discordUtils.js";

const ALL_COMMANDS = [ADD_SUGGESTION_COMMAND, MOVE_SUGGESTION_COMMAND];

InstallGlobalCommands(ALL_COMMANDS);