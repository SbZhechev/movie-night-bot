import {
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';
import fs from 'fs';
import { DuplicateError } from '../../../duplicateError.js';

export const handleAddCommand = (res, data) => {
  try {
    let result = parseOptions(data.options);

    let fileContent = fs.readFileSync('./suggestions.csv', { encoding: 'utf8' });
    if (fileContent.toLowerCase().includes(result.optionsValues.movie.toLowerCase())) {
      throw new DuplicateError(`${result.optionsValues.movie} is already in the list!`);
    }

    fs.appendFileSync('./suggestions.csv', result.toString());

    console.log(`Movie added!`);
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
        components: [
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `${result.optionsValues.movie} added to the list!`
          }
        ]
      }
    });
  } catch (error) {
    if (error instanceof DuplicateError) {
      console.error(error.message);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: error.message
            }
          ]
        }
      });
    }

    console.error(error);
    return res.status(500).json('Error occured while adding a suggestion!');
  }
}

const parseOptions = (options) => {
  let optionsValues = {
    movie: '',
    watched: false,
    participated: false,
    season: 'none'
  };

  options.forEach(option => optionsValues[option.name] = option.value);

  let result = {
    optionsValues,
    toString: () => `\n${optionsValues.movie},${optionsValues.watched},${optionsValues.participated},${optionsValues.season}`
  };

  return result;
}