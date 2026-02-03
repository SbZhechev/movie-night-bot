import { COMMANDS_NAMES, COMMAND_OPTION_TYPES } from "../../../constants.js"

export const SET_LIST_COMMAND = {
  name: COMMANDS_NAMES.SET_LIST,
  description: 'Update the list with the provided file',
  type: COMMAND_OPTION_TYPES.SUB_COMMAND,
  options: [
    {
      name: 'file',
      description: 'File that should be used for update',
      type: COMMAND_OPTION_TYPES.ATTACHMENT,
      required: true
    }
  ]
}