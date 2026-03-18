import { Command } from "commander";
import { api, printTable, printJson } from "../apiClient";

export function registerLinksCommands(program: Command): void {
  const links = program.command("links").description("Manage your Linktree-style links");

  links
    .command("list")
    .description("List all links")
    .option("--json", "Output as JSON")
    .action(async (opts: { json?: boolean }) => {
      const { data } = await api("GET", "/links");
      if (opts.json) {
        printJson(data.links);
      } else {
        printTable(
          data.links.map((l: any) => ({
            id: l.id,
            title: l.title || "(no title)",
            url: l.url,
            order: l.order ?? "-",
          })),
          ["id", "title", "url", "order"]
        );
      }
    });

  links
    .command("add")
    .description("Add a new link")
    .requiredOption("--url <url>", "Link URL")
    .option("--title <title>", "Link title")
    .option("--description <desc>", "Link description")
    .option("--icon <icon>", "Icon URL or emoji")
    .option("--order <n>", "Display order", parseInt)
    .action(async (opts) => {
      const { data } = await api("POST", "/links", {
        url: opts.url,
        title: opts.title,
        description: opts.description,
        icon: opts.icon,
        order: opts.order,
      });
      console.log(`Link added: ${data.linkId}`);
    });

  links
    .command("update")
    .description("Update an existing link")
    .argument("<link-id>", "Link ID to update")
    .option("--url <url>", "New URL")
    .option("--title <title>", "New title")
    .option("--description <desc>", "New description")
    .option("--icon <icon>", "New icon")
    .option("--order <n>", "New order", parseInt)
    .action(async (linkId: string, opts) => {
      const body: any = {};
      if (opts.url) body.url = opts.url;
      if (opts.title) body.title = opts.title;
      if (opts.description) body.description = opts.description;
      if (opts.icon) body.icon = opts.icon;
      if (opts.order !== undefined) body.order = opts.order;

      await api("PUT", `/links/${linkId}`, body);
      console.log(`Link ${linkId} updated.`);
    });

  links
    .command("remove")
    .description("Remove a link")
    .argument("<link-id>", "Link ID to remove")
    .action(async (linkId: string) => {
      await api("DELETE", `/links/${linkId}`);
      console.log(`Link ${linkId} removed.`);
    });
}
