import 'dotenv/config';
import { verifyKey } from "discord-interactions"
import { Receiver } from '@upstash/qstash';

export const verifyDiscordRequest = (req) => {
  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];

  return verifyKey(req.body, signature, timestamp, process.env.PUBLIC_KEY);
}

export const verifyCrobJobRequest = async (req) => {
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
  });

  return receiver.verify({
    signature: req.headers["upstash-signature"],
    body: JSON.stringify(req.body),
  });;
}