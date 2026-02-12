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

const handlePollResults = (channelId, messageId, duration, isTiebreaker = false) => {
  const durationInMiliseconds = duration * 60 * 60 * 1000 + 1000;
  setTimeout(async () => {
    const getPollResponse = await getPollMessage(channelId, messageId);
    const messageData = await getPollResponse.json();

    const pollResults = messageData.poll.results.answer_counts;
    const pollOptions = messageData.poll.answers;
    const extendedResults = pollOptions.map(option => {
      const result = pollResults.find(pollResult => pollResult.id === option.answer_id);
      option.count = result ? result.count : 0;
      return option;
    });
    const movies = parseSuggestionsFile();

    const totalVotes = extendedResults.reduce((sum, result) => sum += result.count, 0);
    if (totalVotes === 0) {
      let components = [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: '@everyone Poll discarded because there are no votes! :('
        }
      ];
      return createMessage(channelId, components);
    }

    extendedResults.sort((result1, result2) => result2.count - result1.count);
    let winners = [extendedResults[0]];

    for (let index = 1; index < extendedResults.length; index++) {
      if (extendedResults[index].count === winners[0].count) {
        winners.push(extendedResults[index]);
      } else {
        break;
      }
    }

    const skippedMovies = [];
    if (!isTiebreaker) {
      extendedResults.forEach(result => {
        if (result.count > 0) {
          const votePercentage = (result.count / totalVotes) * 100;
          if (votePercentage <= 10) skippedMovies.push(result.poll_media.text);
        } else {
          skippedMovies.push(result.poll_media.text);
        }

        const movie = movies.find(movie => movie.title === result.poll_media.text);
        movie.participated = true;
      });

      skippedMovies.forEach(skippedMovieTitle => {
        const skippedMovieIndex = movies.findIndex(movie => movie.title === skippedMovieTitle);
        const skippedMovie = movies.splice(skippedMovieIndex, 1)[0];
        movies.push(skippedMovie);
      });
    }

    if (winners.length === 1) {
      let winner = winners[0];
      const winnerIndex = movies.findIndex(movie => movie.title === winner.poll_media.text);
      const winnerMovie = movies.splice(winnerIndex, 1)[0];
      winnerMovie.watched = true;
      movies.push(winnerMovie);

      await createResultsMessage(channelId, winner, skippedMovies);
      console.log('Poll results parsed!');
    } else {
      let newOptions = winners.map((winner, index) => {
        return {
          answer_id: index,
          poll_media: winner.poll_media
        }
      })

      let pollObject = {
        question: { text: '[TIE BREAKER!]' },
        answers: newOptions,
        duration: 1,
        allow_multiselect: false
      };

      await createResultsMessage(channelId, null, skippedMovies);

      const messageResponse = await createPollMessage(channelId, pollObject);
      const messageData = await messageResponse.json();
      const newPollMessageId = messageData.id;
      handlePollResults(channelId, newPollMessageId, pollObject.duration, true);
    }

    updateSuggestionsFile(movies);
  }, durationInMiliseconds);

  console.log('Timeout for poll results created!');
}

const createResultsMessage = (channelId, winner, skippedMovies) => {
  const getWinnerText = () => `## The winner is: ${winner.poll_media.text}`;
  const tieText = '## There\'s been a tie! New tie breaker poll is being generated!';
  const content = winner ? getWinnerText() : tieText;

  let moviesList = '';
  if (skippedMovies.length === 0) moviesList = 'No movies are skipped!';
  else skippedMovies.forEach(movie => moviesList += `- ${movie}\n`);

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
          content
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