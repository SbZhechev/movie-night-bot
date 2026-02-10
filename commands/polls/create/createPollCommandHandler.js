import { createBasicMessageComponent, createMessage, createPollMessage, getPollMessage } from "../../../discordUtils.js"
import { NotFoundError } from "../../../notFoundError.js";
import { getMoviesForPoll, parseSuggestionsFile, updateSuggestionsFile } from "../../../fileUtils.js";
import { MessageComponentTypes } from "discord-interactions";

export const handleCreatePollCommand = async (res, data, channelId) => {
  try {
    const { title, size, participated, theme, duration } = parseOptions(data.options);
    let movies = parseSuggestionsFile();
    let pollOptions = getMoviesForPoll({ movies, size, participated, theme });

    let answers = pollOptions.map((option, index) => {
      return {
        answer_id: index,
        poll_media: { text: option.title }
      }
    })

    let pollObject = {
      question: { text: title },
      answers,
      duration,
      allow_multiselect: true
    };

    const messageResponse = await createPollMessage(channelId, pollObject);
    const messageData = await messageResponse.json();
    const messageId = messageData.id;

    handlePollResults(channelId, messageId, duration);
    return res.send(createBasicMessageComponent('You got it boss!'));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while creating a poll!';
    if (error instanceof NotFoundError) {
      errorMessage = error.message;
    } else {
      console.error(error.message);
    }

    return res.send(createBasicMessageComponent(errorMessage));
  }
}

const parseOptions = (options) => {
  const optionsValues = {
    title: '',
    size: 10,
    participated: false,
    theme: null,
    duration: 1
  };

  if (!options) return optionsValues;

  options.forEach(option => optionsValues[option.name] = option.value);

  return optionsValues;
}

const handlePollResults = (channelId, messageId, duration) => {
  const durationInMiliseconds = duration * 60 * 60 * 1000 + 1000;
  setTimeout(async () => {
    const getPollResponse = await getPollMessage(channelId, messageId);
    const messageData = await getPollResponse.json();
    const pollResults = messageData.poll.results.answer_counts;
    const pollOptions = messageData.poll.answers;
    const movies = parseSuggestionsFile();

    const totalVotes = pollResults.reduce((sum, result) => sum += result.count, 0);
    let winner = null;
    const skippedMovies = [];

    pollOptions.forEach(option => {
      const pollResult = pollResults.find(result => result.id === option.answer_id);
      if (pollResult) {
        const votePercentage = (pollResult.count / totalVotes) * 100;
        if (votePercentage <= 10) skippedMovies.push(option.poll_media.text);
        if (!winner || winner.count < pollResult.count) {
          winner = { ...pollResult, title: option.poll_media.text };
        }
      } else {
        skippedMovies.push(option.poll_media.text);
      }

      const movie = movies.find(movie => movie.title === option.poll_media.text);
      movie.participated = true;
    });

    const winnerIndex = movies.findIndex(movie => movie.title === winner.title);
    const winnerMovie = movies.splice(winnerIndex, 1)[0];
    winnerMovie.watched = true;
    movies.push(winnerMovie);

    skippedMovies.forEach(skippedMovieTitle => {
      const skippedMovieIndex = movies.findIndex(movie => movie.title === skippedMovieTitle);
      const skippedMovie = movies.splice(skippedMovieIndex, 1)[0];
      movies.push(skippedMovie);
    });

    updateSuggestionsFile(movies);
    await createResultsMessage(channelId, winner, skippedMovies);
    console.log('Poll results parsed!');
  }, durationInMiliseconds);

  console.log('Timeout for poll results created!');
}

const createResultsMessage = (channelId, winner, skippedMovies) => {
  let moviesList = '';
  skippedMovies.forEach(movie => moviesList += `- ${movie}\n`)
  if (skippedMovies.length === 0) moviesList = 'No movies are skipped!';

  let components = [
    {
      type: MessageComponentTypes.TEXT_DISPLAY,
      content: '@everyone Poll results are in!'
    },
    {
      type: MessageComponentTypes.CONTAINER,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `## The winner is: ${winner.title}`
        },
        {
          type: MessageComponentTypes.SEPARATOR
        },
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: '### Movies that didn\'t make the cut due to low/no votes:'
        },
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: moviesList
        }
      ]
    }
  ];

  return createMessage(channelId, components);
}