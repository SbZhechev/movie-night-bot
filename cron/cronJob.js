import "dotenv/config";
import { Client } from '@upstash/qstash'

const client = new Client({
  baseUrl: process.env.QSTASH_URL,
  token: process.env.QSTASH_TOKEN,

})

export const createCronJob = async (pollMessageId, channelId, pollDuration, member) => {
  const botBaseUrl = process.env.BASE_URL;

  const user = member.user.id;

  const payload = { pollMessageId, channelId, user };

  const expirationTimestamp = new Date().getTime() + pollDuration + 1000;

  await client.publishJSON({
    url: `${botBaseUrl}/pollEnded`,
    body: payload,
    notBefore: Math.floor(expirationTimestamp / 1000)
  })

  console.log('Cron job set up!');
}