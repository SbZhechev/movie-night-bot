import { COMMANDS_NAMES, COMMAND_OPTION_TYPES } from "../../../constants.js"

export const DELETE_SUGGESTION_COMMAND = {
  name: COMMANDS_NAMES.DELETE_SUGGESTION,
  description: 'Remove movie from the list',
  type: COMMAND_OPTION_TYPES.SUB_COMMAND,
  options: [
    {
      name: 'title',
      description: 'Title of the movie to remove',
      type: COMMAND_OPTION_TYPES.STRING,
      required: true
    }
  ]
}