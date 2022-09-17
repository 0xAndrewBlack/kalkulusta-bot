import {
  CommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js";
import Main from "../Main";
import { STATUS } from "../static";
import { PendingRating } from "../types";
import logger from "./logger";

const getRatingStatus = async (
  pendingRating: PendingRating
): Promise<STATUS> => {
  if (!pendingRating || !pendingRating.character) {
    return STATUS.EMPTY;
  }

  if (pendingRating.character && !pendingRating.channelId) {
    return STATUS.CHARACTER;
  }

  if (pendingRating.channelId && !pendingRating.subject) {
    return STATUS.TEACHER;
  }

  if (pendingRating.subject && !pendingRating.text) {
    return STATUS.SUBJECT;
  }

  if (pendingRating.text && !pendingRating.aspect1) {
    return STATUS.TEXT;
  }

  if (pendingRating.aspect1 && !pendingRating.aspect2) {
    return STATUS.ASPECT1;
  }

  if (pendingRating.aspect2 && !pendingRating.aspect3) {
    return STATUS.ASPECT2;
  }

  if (pendingRating.aspect3 && !pendingRating.aspect4) {
    return STATUS.ASPECT3;
  }

  if (pendingRating.aspect4 && !pendingRating.aspect5) {
    return STATUS.ASPECT4;
  }

  if (pendingRating.aspect5 && !pendingRating.sexy) {
    return STATUS.ASPECT5;
  }

  throw new Error("Unkown status");
};

const logSlash = (interaction: CommandInteraction) => {
  logger.verbose(
    `${interaction.user.username}#${interaction.user.discriminator} used /${
      interaction.commandName
    } ${
      interaction.options.data.length > 0
        ? `(${interaction.options.data
            .map((d) => (d.value ? `${d.name}: ${d.value}` : null))
            .join(", ")})`
        : ""
    }`
  );
};

const createButtonRows = (
  status: STATUS,
  labels: string[],
  emojis: string[]
): ActionRowBuilder<MessageActionRowComponentBuilder>[] => {
  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
  let buttons: ButtonBuilder[] = [];

  for (let i = 0; i < (labels?.length || emojis?.length); i += 1) {
    const button = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      customId: `${status}-${i.toString()}`,
      label: labels?.[i],
      emoji: emojis?.[i],
    });
    buttons.push(button);
    if (i % 5 === 4) {
      rows.push(
        new ActionRowBuilder({
          components: buttons,
        })
      );
      buttons = [];
    }
  }
  if (buttons.length > 0) {
    rows.push(
      new ActionRowBuilder({
        components: buttons,
      })
    );
  }

  return rows;
};

const channelToName = (channelName: string) =>
  channelName
    .replace(/-/g, " ")
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
    .replace(/Dr$/, "Dr.");

const getTeacherChannels = async (letter: string) =>
  (await Main.guild.channels.fetch()).filter(
    (c) => c.parent?.name.toLowerCase() === letter
  );

export {
  logSlash,
  createButtonRows,
  channelToName,
  getRatingStatus,
  getTeacherChannels,
};
