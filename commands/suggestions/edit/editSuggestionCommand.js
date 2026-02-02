import { COMMANDS_NAMES, COMMAND_OPTION_TYPES } from "../../../constants.js";

export const EDIT_SUGGESTION_COMMAND = {
  name: COMMANDS_NAMES.EDIT_SUGGESTION,
  description: 'Edit movie data',
  type: COMMAND_OPTION_TYPES.SUB_COMMAND,
  options: [
    {
      name: 'title',
      description: 'Current title of the movie to edit',
      type: COMMAND_OPTION_TYPES.STRING,
      required: true
    },
    {
      name: 'new_title',
      description: 'New title for the movie',
      type: COMMAND_OPTION_TYPES.STRING,
      required: false
    },
    {
      name: 'new_watched',
      description: 'New watched value for the movie',
      type: COMMAND_OPTION_TYPES.BOOLEAN,
      required: false
    },
    {
      name: 'new_participated',
      description: 'New participated value for the movie',
      type: COMMAND_OPTION_TYPES.BOOLEAN,
      required: false
    },
    {
      name: 'new_theme',
      description: 'New theme value for the movie',
      type: COMMAND_OPTION_TYPES.STRING,
      required: false
    }
  ]
}