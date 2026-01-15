import 'dotenv/config';
import { DISCORD_URL } from "./constants.js";
import fetch from "node-fetch";

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