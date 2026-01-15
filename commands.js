import { InstallGlobalCommands } from "./utils.js";

const TEST_COMMAND = {
  name: 'hello',
  description: "Simple test command",
  type: 1
};

const ALL_COMMANDS = [TEST_COMMAND];

InstallGlobalCommands(ALL_COMMANDS);
