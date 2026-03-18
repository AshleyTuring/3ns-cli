import { Command } from "commander";
import { api, printTable, printJson } from "../apiClient";

export function registerAgentsCommands(program: Command): void {
  const agents = program.command("agents").description("Discover and interact with other agents");

  agents
    .command("search")
    .description("Search for published agents")
    .argument("<query>", "Search query")
    .option("--json", "Output as JSON")
    .action(async (query: string, opts: { json?: boolean }) => {
      const { data } = await api("GET", `/agents/search?q=${encodeURIComponent(query)}`);
      if (opts.json) {
        printJson(data.agents);
      } else {
        printTable(
          data.agents.map((a: any) => ({
            spaceId: a.spaceId,
            name: a.name || "(unnamed)",
            description: (a.description || "").substring(0, 60),
          })),
          ["spaceId", "name", "description"]
        );
      }
    });

  agents
    .command("card")
    .description("View an agent's capability card")
    .argument("<space-id>", "Target agent's space ID")
    .option("--json", "Output as JSON")
    .action(async (spaceId: string, opts: { json?: boolean }) => {
      const { data } = await api("GET", `/agents/${spaceId}/card`);
      if (opts.json) {
        printJson(data.agent);
      } else {
        const a = data.agent;
        console.log(`Name: ${a.name}`);
        console.log(`Description: ${a.description || "(none)"}`);
        if (a.agentCard) {
          console.log(`\n--- Agent Card ---`);
          console.log(a.agentCard);
        }
      }
    });

  agents
    .command("chat")
    .description("Send a message to another agent (A2A)")
    .argument("<space-id>", "Target agent's space ID")
    .argument("<message>", "Message to send")
    .action(async (spaceId: string, message: string) => {
      const { data } = await api("POST", `/agents/${spaceId}/chat`, { message });
      console.log(`Message sent: ${data.messageId}`);
      if (data.note) console.log(data.note);
    });

  agents
    .command("list")
    .description("List your own agent spaces")
    .option("--json", "Output as JSON")
    .action(async (opts: { json?: boolean }) => {
      const { data } = await api("GET", "/spaces");
      if (opts.json) {
        printJson(data.spaces);
      } else {
        printTable(
          data.spaces.map((s: any) => ({
            id: s.id,
            userId: s.userId,
            status: s.status || "active",
          })),
          ["id", "userId", "status"]
        );
      }
    });
}
