import { createBasicMessageComponent } from "../../../discordUtils.js"
import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";
import { suggestionsFilePath } from "../../../fileUtils.js";
import fs from 'fs';
import FormData from "form-data";

export const handleGetCommand = (res) => {
  try {
    const form = new FormData();

    // Add the JSON payload
    form.append('payload_json', JSON.stringify({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Here is the list, boss: ',
        flags: InteractionResponseFlags.EPHEMERAL,
        attachments: [
          {
            id: '0',
            filename: 'suggestions.csv'
          }
        ]
      }
    }));

    // Add the file
    form.append('files[0]', fs.createReadStream(suggestionsFilePath), {
      filename: 'suggestions.csv'
    });

    console.log('List was requested!');
    res.set(form.getHeaders());
    return form.pipe(res);
  } catch (error) {
    let errorMessage = 'Unexpected error occured while getting movies list!';
    console.error(error);

    return res.send(createBasicMessageComponent(errorMessage));
  }
}