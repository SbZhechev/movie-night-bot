import fs from 'fs';
import { DuplicateError } from '../../../duplicateError.js';
import { suggestionsFilePath } from '../../../fileUtils.js';
import { createBasicMessageComponent } from '../../../discordUtils.js';

export const handleAddCommand = (res, data) => {
  try {
    let result = parseOptions(data.options);

    let fileContent = fs.readFileSync(suggestionsFilePath, { encoding: 'utf8' });
    if (fileContent.toLowerCase().includes(result.optionsValues.title.toLowerCase())) {
      throw new DuplicateError(`${result.optionsValues.title} is already in the list!`);
    }

    fs.appendFileSync(suggestionsFilePath, result.toString());

    console.log(`${result.optionsValues.title} added to the list!`);
    return res.send(createBasicMessageComponent(`${result.optionsValues.title} added to the list!`));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while adding a suggestion!';
    if (error instanceof DuplicateError) {
      errorMessage = error.message
    } else {
      console.error(error);
    }

    return res.send(createBasicMessageComponent(errorMessage));
  }
}

const parseOptions = (options) => {
  let optionsValues = {
    title: '',
    watched: false,
    participated: false,
    theme: 'none'
  };

  options.forEach(option => optionsValues[option.name] = option.value);

  let result = {
    optionsValues,
    toString: () => `\n${optionsValues.title},${optionsValues.watched},${optionsValues.participated},${optionsValues.theme}`
  };

  return result;
}