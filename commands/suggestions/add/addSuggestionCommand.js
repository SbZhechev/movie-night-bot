import { COMMANDS_NAMES, COMMAND_OPTION_TYPES } from "../../../constants.js";

export const ADD_SUGGESTION_COMMAND = {
  name: COMMANDS_NAMES.ADD_SUGGESTION,
  description: 'Add a suggestion to the list',
  type: COMMAND_OPTION_TYPES.SUB_COMMAND,
  options: [
    {
      name: 'movie',
      description: 'The title of the movie to add',
      type: COMMAND_OPTION_TYPES.STRING,
      required: true
    },
    {
      name: 'watched',
      description: 'Was the movie watched already',
      type: COMMAND_OPTION_TYPES.BOOLEAN,
      required: false
    },
    {
      name: 'participated',
      description: 'Has the movie already participated in a poll',
      type: COMMAND_OPTION_TYPES.BOOLEAN,
      required: false
    },
    {
      name: 'season',
      description: 'What season is the movie tailored for (i.e. Christmas)',
      type: COMMAND_OPTION_TYPES.STRING,
      required: false
    }
  ]
};