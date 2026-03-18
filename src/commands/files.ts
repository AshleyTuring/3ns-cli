import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { api, printTable, printJson } from "../apiClient";

export function registerFilesCommands(program: Command): void {
  const files = program.command("files").description("Manage uploaded files");

  files
    .command("list")
    .description("List uploaded files")
    .option("--json", "Output as JSON")
    .action(async (opts: { json?: boolean }) => {
      const { data } = await api("GET", "/files");
      if (opts.json) {
        printJson(data.files);
      } else {
        printTable(
          data.files.map((f: any) => ({
            id: f.id,
            name: f.fileName,
            type: f.fileType,
            size: f.fileSize ? `${(f.fileSize / 1024).toFixed(1)}KB` : "-",
          })),
          ["id", "name", "type", "size"]
        );
      }
    });

  files
    .command("upload")
    .description("Upload a file")
    .argument("<local-path>", "Path to the local file")
    .requiredOption("--folder <id>", "Target folder ID")
    .option("--name <name>", "Override file name")
    .option("--type <mime>", "MIME type")
    .action(async (localPath: string, opts: { folder: string; name?: string; type?: string }) => {
      const content = fs.readFileSync(localPath);
      const base64Content = content.toString("base64");
      const fileName = opts.name || path.basename(localPath);

      const { data } = await api("POST", "/files", {
        folderId: opts.folder,
        fileName,
        fileType: opts.type || "application/octet-stream",
        base64Content,
      });
      console.log(`Uploaded: ${data.fileId}`);
      if (data.downloadUrl) console.log(`URL: ${data.downloadUrl}`);
    });

  files
    .command("download")
    .description("Download a file")
    .argument("<file-id>", "File ID")
    .option("-o, --output <path>", "Output path")
    .action(async (fileId: string, opts: { output?: string }) => {
      const { data } = await api("GET", `/files/${fileId}`);
      if (!data.file?.downloadUrl) {
        console.error("No download URL available for this file.");
        return;
      }
      console.log(`File: ${data.file.fileName}`);
      console.log(`Download URL: ${data.file.downloadUrl}`);

      if (opts.output) {
        const res = await fetch(data.file.downloadUrl);
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(opts.output, buffer);
        console.log(`Saved to: ${opts.output}`);
      }
    });

  files
    .command("delete")
    .description("Delete a file")
    .argument("<file-id>", "File ID")
    .action(async (fileId: string) => {
      await api("DELETE", `/files/${fileId}`);
      console.log(`File ${fileId} deleted.`);
    });
}
