import { Command } from "commander";
import { api, printJson } from "../apiClient";

export function registerOpenclawCommands(program: Command): void {
  const openclaw = program.command("openclaw").description("Setup prompt and platform utilities");

  openclaw
    .command("setup-prompt")
    .description("Get your personalised setup prompt for AI assistants")
    .option("--raw", "Output only the prompt text (no wrapper)")
    .action(async (opts: { raw?: boolean }) => {
      const { data } = await api("GET", "/setup-prompt");
      if (opts.raw) {
        console.log(data.prompt);
      } else {
        console.log(`Agent: ${data.agentName}`);
        console.log(`Website: ${data.websiteUrl}`);
        console.log(`Key prefix: ${data.keyPrefix}`);
        console.log(`\n${"=".repeat(60)}\n`);
        console.log(data.prompt);
      }
    });

  openclaw
    .command("users")
    .description("List CRM users (admin key required)")
    .option("--stage <stage>", "Filter by lifecycle stage")
    .option("--limit <n>", "Max results", "50")
    .option("--json", "Output as JSON")
    .action(async (opts: { stage?: string; limit: string; json?: boolean }) => {
      let endpoint = `/users?limit=${opts.limit}`;
      if (opts.stage) endpoint += `&stage=${opts.stage}`;
      const { data } = await api("GET", endpoint);
      if (opts.json) {
        printJson(data.users);
      } else {
        console.log(`Users: ${data.count}`);
        for (const u of data.users) {
          console.log(`  ${u.id} | ${u.email || "-"} | ${u.stage || "-"}`);
        }
      }
    });

  openclaw
    .command("report")
    .description("Get daily CRM report (admin key required)")
    .option("--date <YYYY-MM-DD>", "Specific date")
    .option("--range <days>", "Number of days")
    .action(async (opts: { date?: string; range?: string }) => {
      let endpoint = "/report/daily";
      const params: string[] = [];
      if (opts.date) params.push(`date=${opts.date}`);
      if (opts.range) params.push(`range=${opts.range}`);
      if (params.length) endpoint += `?${params.join("&")}`;

      const { data } = await api("GET", endpoint);
      printJson(data);
    });
}
