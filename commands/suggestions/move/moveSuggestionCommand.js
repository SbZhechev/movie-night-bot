import { COMMANDS_NAMES, COMMAND_OPTION_TYPES } from "../../../constants.js"

export const MOVE_SUGGESTION_COMMAND = {
  name: COMMANDS_NAMES.MOVE_SUGGESTION,
  description: 'Change the movie\'s position in the list',
  type: COMMAND_OPTION_TYPES.SUB_COMMAND,
  options: [
    {
      name: 'title',
      description: 'Title of the movie to move',
      type: COMMAND_OPTION_TYPES.STRING,
      required: true
    },
    {
      name: 'to',
      description: 'New position in the list',
      type: COMMAND_OPTION_TYPES.STRING,
      required: true,
      choices: [
        {
          name: 'front',
          value: 'front'
        },
        {
          name: 'back',
          value: 'back'
        }
      ]
    }
  ]
}