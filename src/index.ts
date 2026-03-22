#!/usr/bin/env node

import { Command } from "commander";
import { registerAuthCommands } from "./commands/auth";
import { registerLinksCommands } from "./commands/links";
import { registerConfigCommands } from "./commands/config";
import { registerAgentsCommands } from "./commands/agents";
import { registerChatsCommands } from "./commands/chats";
import { registerFilesCommands } from "./commands/files";
import { registerSkinsCommands } from "./commands/skins";
import { registerExportImportCommands } from "./commands/exportImport";
import { registerOpenclawCommands } from "./commands/openclaw";
import { registerModelsCommands } from "./commands/models";

const program = new Command();

program
  .name("3ns")
  .description("Control your 3NS agent domain from the command line")
  .version("0.1.0");

registerAuthCommands(program);
registerLinksCommands(program);
registerConfigCommands(program);
registerAgentsCommands(program);
registerChatsCommands(program);
registerFilesCommands(program);
registerSkinsCommands(program);
registerExportImportCommands(program);
registerOpenclawCommands(program);
registerModelsCommands(program);

program.parse();
