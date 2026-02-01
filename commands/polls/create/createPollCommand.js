import { COMMANDS_NAMES, COMMAND_OPTION_TYPES } from "../../../constants.js";

export const CREATE_POLL_COMMAND = {
  name: COMMANDS_NAMES.CREATE_POLL,
  description: 'Create a poll for choosing next movie for movie night.',
  type: COMMAND_OPTION_TYPES.SUB_COMMAND,
  options: [
    {
      name: 'title',
      description: 'The title of the poll',
      type: COMMAND_OPTION_TYPES.STRING,
      required: true
    },
    {
      name: 'size',
      description: 'The number of options for the poll.',
      type: COMMAND_OPTION_TYPES.INTEGER,
      required: false
    },
    {
      name: 'theme',
      description: 'The theme to filter movies on.',
      type: COMMAND_OPTION_TYPES.STRING,
      required: false
    },
    {
      name: 'participated',
      description: 'Allow movies that have previously participated in a poll.',
      type: COMMAND_OPTION_TYPES.BOOLEAN,
      required: false
    },
    {
      name: 'duration',
      description: 'Duration of the poll in hours.',
      type: COMMAND_OPTION_TYPES.INTEGER,
      required: false
    }
  ]
}