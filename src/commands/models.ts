import { Command } from "commander";
import { api, printTable, printJson } from "../apiClient";

export function registerModelsCommands(program: Command): void {
  program
    .command("models")
    .description("List available AI models")
    .option("--json", "Output as JSON")
    .option("--provider <name>", "Filter by provider (google, openai, anthropic, xai)")
    .action(async (opts: { json?: boolean; provider?: string }) => {
      const { data } = await api("GET", "/models");
      let models = data.models;
      if (opts.provider) {
        models = models.filter((m: any) => m.provider === opts.provider!.toLowerCase());
      }
      if (opts.json) {
        printJson(models);
      } else {
        console.log(`Default model: ${data.default}\n`);
        printTable(
          models.map((m: any) => ({
            name: m.name,
            label: m.label,
            provider: m.provider,
            context: m.context >= 1000000 ? `${(m.context / 1000000).toFixed(1)}M` : `${(m.context / 1000).toFixed(0)}K`,
          })),
          ["name", "label", "provider", "context"]
        );
        console.log(`\n${models.length} models available. Use with: 3ns chats send --model MODEL_NAME --folder ID "message"`);
      }
    });
}
