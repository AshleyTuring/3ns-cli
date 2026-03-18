import { Command } from "commander";
import * as fs from "fs";
import { api, printJson } from "../apiClient";

export function registerExportImportCommands(program: Command): void {
  program
    .command("export")
    .description("Export your entire agent as JSON")
    .option("--no-chats", "Exclude chat history")
    .option("--no-files", "Exclude uploaded files")
    .option("-o, --output <path>", "Save to file instead of stdout")
    .action(async (opts: { chats: boolean; files: boolean; output?: string }) => {
      const { data } = await api("POST", "/export", {
        includeChats: opts.chats,
        includeFiles: opts.files,
      });

      if (opts.output) {
        fs.writeFileSync(opts.output, JSON.stringify(data, null, 2), "utf8");
        console.log(`Exported to: ${opts.output}`);
        console.log(`Folders: ${data.manifest?.folderCount}, Docs: ${data.manifest?.documentCount}, Chats: ${data.manifest?.chatCount}`);
      } else {
        printJson(data);
      }
    });

  program
    .command("import")
    .description("Import agent data from a JSON file")
    .argument("<file>", "Path to the export JSON file")
    .action(async (file: string) => {
      const raw = fs.readFileSync(file, "utf8");
      const data = JSON.parse(raw);

      if (!data.manifest) {
        console.error("Invalid export file - missing manifest.");
        process.exit(1);
      }

      console.log(`Importing: ${data.manifest.folderCount} folders, ${data.manifest.documentCount} docs, ${data.manifest.chatCount} chats...`);

      const { data: result } = await api("POST", "/import", { data });
      console.log(`Import ${result.success ? "succeeded" : "failed"}.`);
      if (result.importCounts) {
        for (const [key, count] of Object.entries(result.importCounts)) {
          console.log(`  ${key}: ${count}`);
        }
      }
      if (result.errors?.length > 0) {
        console.log(`Errors: ${result.errors.join(", ")}`);
      }
    });
}
