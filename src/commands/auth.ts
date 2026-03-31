import { Command } from "commander";
import { saveConfig, loadConfig, api } from "../apiClient";

export function registerAuthCommands(program: Command): void {
  const auth = program.command("auth").description("Manage authentication");

  auth
    .command("login")
    .description("Store your 3NS API key")
    .argument("<api-key>", "Your 3NS API key")
    .option("--base-url <url>", "Custom API base URL")
    .action(async (apiKey: string, opts: { baseUrl?: string }) => {
      saveConfig({ apiKey, baseUrl: opts.baseUrl });
      console.log("API key saved to ~/.3nsrc");

      try {
        const { data } = await api("GET", "/profile");
        const name = data?.profile?.metadata?.name || "Unknown";
        console.log(`Authenticated as: ${name}`);
      } catch {
        console.warn("Warning: Could not verify the key. Check it is correct.");
      }
    });

  auth
    .command("whoami")
    .description("Show current authentication status")
    .action(async () => {
      const config = loadConfig();
      if (!config?.apiKey) {
        console.log("Not authenticated. Run: 3ns auth login <api-key>");
        return;
      }
      console.log(`API key: ${config.apiKey.substring(0, 8)}...`);
      if (config.baseUrl) console.log(`Base URL: ${config.baseUrl}`);

      try {
        const { data } = await api("GET", "/profile");
        const meta = data?.profile?.metadata;
        if (meta) {
          console.log(`Agent name: ${meta.name || "Not set"}`);
          console.log(`Description: ${meta.description || "Not set"}`);
        }
      } catch (err: any) {
        console.error(`Auth check failed: ${err.message}`);
      }
    });

  auth
    .command("logout")
    .description("Remove stored credentials")
    .action(() => {
      const fs = require("fs");
      const path = require("path");
      const os = require("os");
      const rcPath = path.join(os.homedir(), ".3nsrc");
      if (fs.existsSync(rcPath)) {
        fs.unlinkSync(rcPath);
        console.log("Logged out. ~/.3nsrc removed.");
      } else {
        console.log("No credentials found.");
      }
    });
}
