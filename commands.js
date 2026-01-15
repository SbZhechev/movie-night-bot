import { COMMANDS_NAMES } from "./constants.js";
import { InstallGlobalCommands } from "./utils.js";

const TEST_COMMAND = {
  name: COMMANDS_NAMES.TEST,
  description: "Simple test command",
  type: 1
};

const ALL_COMMANDS = [TEST_COMMAND];

InstallGlobalCommands(ALL_COMMANDS);
