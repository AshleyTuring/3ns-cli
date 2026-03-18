import { Command } from "commander";
import { api, printJson, printTable } from "../apiClient";
import * as fs from "fs";
import * as path from "path";

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
    .option("--font-color <color>", "Font colour")
    .option("--button-color <color>", "Button colour")
    .option("--button-font-color <color>", "Button font colour")
    .option("--hover-color <color>", "On-hover colour")
    .option("--font-family <font>", "Font family")
    .option("--chat-bubble-color <color>", "Agent chat bubble colour")
    .option("--user-bubble-color <color>", "User chat bubble colour")
    .option("--chat-bubble-font <color>", "Agent chat bubble font colour")
    .option("--user-bubble-font <color>", "User chat bubble font colour")
    .option("--button-border <color>", "Button border colour")
    .option("--button-bg <color>", "Button background colour")
    .action(async (opts) => {
      const body: any = {};
      if (opts.theme) body.themeName = opts.theme;
      if (opts.bgColor) body.backgroundColor = opts.bgColor;
      if (opts.bgImage) body.backgroundImage = opts.bgImage;
      if (opts.bgImageDesktop) body.backgroundImageDesktop = opts.bgImageDesktop;
      if (opts.video) body.videoUrl = opts.video;
      if (opts.fontColor) body.fontColor = opts.fontColor;
      if (opts.buttonColor) body.buttonColor = opts.buttonColor;
      if (opts.buttonFontColor) body.buttonFontColor = opts.buttonFontColor;
      if (opts.hoverColor) body.onHoverColor = opts.hoverColor;
      if (opts.fontFamily) body.fontFmaily = opts.fontFamily; // matches frontend typo
      if (opts.chatBubbleColor) body.chatBubbleColor = opts.chatBubbleColor;
      if (opts.userBubbleColor) body.userChatBubbleColor = opts.userBubbleColor;
      if (opts.chatBubbleFont) body.chatBubbleFontColor = opts.chatBubbleFont;
      if (opts.userBubbleFont) body.userChatBubbleFontColor = opts.userBubbleFont;
      if (opts.buttonBorder) body.buttonBorderColor = opts.buttonBorder;
      if (opts.buttonBg) body.buttonBackgroundColor = opts.buttonBg;

      if (Object.keys(body).length === 0) {
        console.error("Provide at least one option to update.");
        return;
      }

      await api("PUT", "/skins", body);
      console.log("Skin updated.");
    });

  skins
    .command("upload-bg <filePath>")
    .description("Upload a background image for your skin")
    .option("--target <target>", "Which background to set: 'both' or 'desktop'", "both")
    .action(async (filePath: string, opts: { target?: string }) => {
      const resolved = path.resolve(filePath);
      if (!fs.existsSync(resolved)) {
        console.error(`File not found: ${resolved}`);
        return;
      }

      const ext = path.extname(resolved).toLowerCase();
      const mimeMap: Record<string, string> = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png", ".gif": "image/gif",
        ".webp": "image/webp",
      };

      if (!mimeMap[ext]) {
        console.error(`Unsupported image format: ${ext}. Use jpg, png, gif, or webp.`);
        return;
      }

      const base64Content = fs.readFileSync(resolved).toString("base64");
      const { data } = await api("POST", "/skins/upload", {
        base64Content,
        fileName: path.basename(resolved),
        contentType: mimeMap[ext],
        target: opts.target === "desktop" ? "desktop" : undefined,
      });

      console.log(`Background uploaded: ${data.imageUrl}`);
      console.log(`Updated fields: ${data.updatedFields?.join(", ")}`);
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
