import { Command } from "commander";
import * as fs from "fs";
import { api, printTable, printJson } from "../apiClient";

export function registerConfigCommands(program: Command): void {
  const config = program.command("config").description("Manage agent configuration (MD instruction files)");

  config
    .command("folders")
    .description("List all folders")
    .option("--json", "Output as JSON")
    .action(async (opts: { json?: boolean }) => {
      const { data } = await api("GET", "/config/folders");
      if (opts.json) {
        printJson(data.folders);
      } else {
        printTable(
          data.folders.map((f: any) => ({
            id: f.id,
            name: f.folderName,
            docs: (f.documentIds || []).length,
            chats: (f.chatIds || []).length,
          })),
          ["id", "name", "docs", "chats"]
        );
      }
    });

  config
    .command("read")
    .description("Read a document by ID")
    .argument("<doc-id>", "Document ID")
    .option("--json", "Output raw JSON")
    .action(async (docId: string, opts: { json?: boolean }) => {
      const { data } = await api("GET", `/config/documents/${docId}`);
      if (opts.json) {
        printJson(data.document);
      } else {
        console.log(`--- ${data.document.fileName} (${data.document.fileType}) ---`);
        console.log(data.document.content || "(empty)");
      }
    });

  config
    .command("write")
    .description("Update a document's content")
    .argument("<doc-id>", "Document ID")
    .option("--content <text>", "New content (inline)")
    .option("--file <path>", "Read content from a local file")
    .action(async (docId: string, opts: { content?: string; file?: string }) => {
      let content = opts.content;
      if (opts.file) {
        content = fs.readFileSync(opts.file, "utf8");
      }
      if (!content) {
        console.error("Provide --content or --file");
        process.exit(1);
      }
      await api("PUT", `/config/documents/${docId}`, { content });
      console.log(`Document ${docId} updated.`);
    });

  config
    .command("ensure")
    .description("Create a document in a folder if it does not exist")
    .argument("<folder-id>", "Folder ID")
    .requiredOption("--name <name>", "File name (e.g. instructions.md)")
    .option("--content <text>", "Initial content")
    .option("--file <path>", "Read initial content from a local file")
    .action(async (folderId: string, opts: { name: string; content?: string; file?: string }) => {
      // Check if document already exists
      const { data: existing } = await api("GET", `/config/folders/${folderId}/documents`);
      const found = existing.documents.find((d: any) => d.fileName === opts.name);
      if (found) {
        console.log(`Document "${opts.name}" already exists: ${found.id}`);
        return;
      }

      let content = opts.content || "";
      if (opts.file) content = fs.readFileSync(opts.file, "utf8");

      const { data } = await api("POST", `/config/folders/${folderId}/documents`, {
        fileName: opts.name,
        content,
      });
      console.log(`Document created: ${data.docId}`);
    });
}
