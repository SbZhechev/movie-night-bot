import { COMMANDS_NAMES, COMMAND_OPTION_TYPES } from "../../../constants.js"

export const PREVIEW_POLL_COMMAND = {
  name: COMMANDS_NAMES.PREVIEW_POLL,
  description: "Preview what the next poll would look like.",
  type: COMMAND_OPTION_TYPES.SUB_COMMAND,
  options:
    [
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
      }
    ]
}