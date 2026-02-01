import 'dotenv/config';
import { DISCORD_URL } from "./constants.js";
import fetch from "node-fetch";
import {
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';

export async function DiscordRequest(endpoint, options) {
  const url = DISCORD_URL + endpoint;

  if (options.body) options.body = JSON.stringify(options.body);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot',
    },
    ...options
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(JSON.stringify(data));
  }

  return response;
}

export async function InstallGlobalCommands(commands) {
  const endpoint = `applications/${process.env.APP_ID}/commands`;

  try {
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (error) {
    console.error(error);
  }
}

export function createBasicMessageComponent(message) {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: message
        }
      ]
    }
  }
}

export async function createPollMessage(channelId, poll) {
  const endpoint = `channels/${channelId}/messages`;
  const options = {
    method: 'POST',
    body: {
      content: '@everyone New movie night poll is up!',
      poll
    }
  }

  await DiscordRequest(endpoint, options);
}