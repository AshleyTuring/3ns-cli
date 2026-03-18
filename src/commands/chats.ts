import { Command } from "commander";
import { api, printTable, printJson } from "../apiClient";

export function registerChatsCommands(program: Command): void {
  const chats = program.command("chats").description("Manage chat conversations");

  chats
    .command("list")
    .description("List chat summaries")
    .option("--json", "Output as JSON")
    .action(async (opts: { json?: boolean }) => {
      const { data } = await api("GET", "/chats");
      if (opts.json) {
        printJson(data.chats);
      } else {
        printTable(
          data.chats.map((c: any) => ({
            chatId: c.agent_chat_id,
            type: c.agentType || "NORM",
            summary: (c.summary || "").substring(0, 60),
          })),
          ["chatId", "type", "summary"]
        );
      }
    });

  chats
    .command("history")
    .description("View messages in a chat")
    .argument("<chat-id>", "Numeric chat ID")
    .option("--json", "Output as JSON")
    .action(async (chatId: string, opts: { json?: boolean }) => {
      const { data } = await api("GET", `/chats/${chatId}`);
      if (opts.json) {
        printJson(data.messages);
      } else {
        for (const msg of data.messages) {
          const role = msg.role === "user" ? "You" : "Agent";
          const text = msg.content?.map((c: any) => c.text).join("") || "";
          console.log(`[${role}] ${text.substring(0, 200)}`);
        }
      }
    });

  chats
    .command("send")
    .description("Send a message to start or continue a chat")
    .requiredOption("--folder <id>", "Folder ID for the chat")
    .argument("<message>", "Message text")
    .option("--agent-type <type>", "Agent type (NORM, AMPS, CUST)", "NORM")
    .action(async (message: string, opts: { folder: string; agentType: string }) => {
      const { data } = await api("POST", "/chats", {
        folderId: opts.folder,
        message,
        agentType: opts.agentType,
      });
      console.log(`Message sent to chat ${data.chatId}`);
      if (data.note) console.log(data.note);
    });

  chats
    .command("delete")
    .description("Delete a chat and all its messages")
    .argument("<chat-id>", "Numeric chat ID")
    .action(async (chatId: string) => {
      const { data } = await api("DELETE", `/chats/${chatId}`);
      console.log(`Chat ${chatId} deleted (${data.deletedMessages} messages removed).`);
    });
}
