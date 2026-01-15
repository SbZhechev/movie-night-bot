import { ADD_SUGGESTION_COMMAND } from "./commands/suggestions/add/addSuggestionCommand.js";
import { InstallGlobalCommands } from "./utils.js";

const ALL_COMMANDS = [ADD_SUGGESTION_COMMAND];

InstallGlobalCommands(ALL_COMMANDS);