import { COMMANDS_NAMES, COMMAND_OPTION_TYPES } from "../../../constants.js";

export const GET_LIST_COMMAND = {
  name: COMMANDS_NAMES.GET_LIST,
  description: 'See the list of movies as message or file',
  type: COMMAND_OPTION_TYPES.SUB_COMMAND
}