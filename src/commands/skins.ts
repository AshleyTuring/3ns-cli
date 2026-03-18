import { Command } from "commander";
import { api, printJson, printTable } from "../apiClient";

export function registerSkinsCommands(program: Command): void {
  const skins = program.command("skins").description("Manage your agent website skin");

  skins
    .command("get")
    .description("View your current skin settings")
    .option("--json", "Output as JSON")
    .action(async (opts: { json?: boolean }) => {
      const { data } = await api("GET", "/skins");
      if (opts.json) {
        printJson(data.skin);
      } else if (data.skin) {
        console.log(`Theme: ${data.skin.themeName || "(default)"}`);
        console.log(`Background: ${data.skin.backgroundColor || "(none)"}`);
        console.log(`Image: ${data.skin.backgroundImage || "(none)"}`);
        console.log(`Video: ${data.skin.videoUrl || "(none)"}`);
      } else {
        console.log("No skin configured yet.");
      }
    });

  skins
    .command("update")
    .description("Update skin settings")
    .option("--theme <name>", "Theme name")
    .option("--bg-color <color>", "Background colour (hex)")
    .option("--bg-image <url>", "Background image URL")
    .option("--bg-image-desktop <url>", "Desktop background image URL")
    .option("--video <url>", "Background video URL")
    .action(async (opts) => {
      const body: any = {};
      if (opts.theme) body.themeName = opts.theme;
      if (opts.bgColor) body.backgroundColor = opts.bgColor;
      if (opts.bgImage) body.backgroundImage = opts.bgImage;
      if (opts.bgImageDesktop) body.backgroundImageDesktop = opts.bgImageDesktop;
      if (opts.video) body.videoUrl = opts.video;

      if (Object.keys(body).length === 0) {
        console.error("Provide at least one option to update.");
        return;
      }

      await api("PUT", "/skins", body);
      console.log("Skin updated.");
    });

  skins
    .command("presets")
    .description("Browse clonable skin presets")
    .option("--json", "Output as JSON")
    .action(async (opts: { json?: boolean }) => {
      const { data } = await api("GET", "/skins/presets");
      if (opts.json) {
        printJson(data.presets);
      } else {
        printTable(
          data.presets.map((p: any) => ({
            id: p.id,
            theme: p.themeName || "(unnamed)",
            bg: p.backgroundColor || "-",
          })),
          ["id", "theme", "bg"]
        );
      }
    });
}
