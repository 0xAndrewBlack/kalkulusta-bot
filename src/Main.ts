/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
import { importx } from "@discordx/importer";
import { Guild, IntentsBitField, Partials } from "discord.js";
import { Client } from "discordx";
import config from "./config";
import { PendingRating } from "./types";
import logger from "./utils/logger";

export default class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static guild: Guild;

  static pendingRatings: Map<string, PendingRating> = new Map();

  static async start(): Promise<void> {
    // for testing
    this.pendingRatings.set("398115483590852620", {
      character: "c",
      channelId: "737706586935525405",
    });
    await importx(`${__dirname}/discords/*.{ts,js}`);

    this._client = new Client({
      simpleCommand: { prefix: "!" },
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.DirectMessages,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.User],
    });

    this._client.on("ready", async () => {
      this.guild = await this._client.guilds.fetch(config.guildId);
      logger.info(">> Bot started");

      await this._client.initApplicationCommands({
        guild: { log: true },
        global: { log: true },
      });
    });

    this._client.on("messageCreate", (message) => {
      if (!message.author.bot) {
        this._client.executeCommand(message);
      }
    });

    this._client.on("interactionCreate", (interaction) => {
      this._client.executeInteraction(interaction);
    });

    this._client.login(config.discordToken);
  }
}

(async () => {
  await Main.start();
})();
