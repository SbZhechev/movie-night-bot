import { DEFAULT_TIE_BREAKER_POLL_DURATION, MOVIE_PROPERTIES_MAP } from "../../../constants.js";
import { getPollMessage, createMessage } from "../../../discordUtils.js";
import { MessageComponentTypes } from "discord-interactions";
import { getList, updateList } from "../../../google-sheets/utils.js";
import { handleCreatePoll } from "../../utils.js";

export const handlePollResults = async (channelId, messageId, member) => {
  console.log(channelId, messageId, member);
  const getPollResponse = await getPollMessage(channelId, messageId);
  const messageData = await getPollResponse.json();

  const pollResults = messageData.poll.results.answer_counts;
  const pollOptions = messageData.poll.answers;
  const extendedResults = pollOptions.map(option => {
    const result = pollResults.find(pollResult => pollResult.id === option.answer_id);
    option.count = result ? result.count : 0;
    return option;
  });

  const movies = await getList();

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
  const isTiebreaker = messageData.poll.question.text.includes('[TIE BREAKER!]');
  if (!isTiebreaker) {
    extendedResults.forEach(result => {
      if (result.count > 0) {
        const votePercentage = (result.count / totalVotes) * 100;
        if (votePercentage <= 10) skippedMovies.push(result.poll_media.text);
      } else {
        skippedMovies.push(result.poll_media.text);
      }

      const movie = movies.find(movieData => movieData[MOVIE_PROPERTIES_MAP.TITLE] === result.poll_media.text);
      if (movie) {
        movie[MOVIE_PROPERTIES_MAP.PARTICIPATED] = true;
      } else {
        console.warn(`Movie data for result: ${result.poll_media.text} not found!`)
      }
    });

    skippedMovies.forEach(skippedMovieTitle => {
      const skippedMovieIndex = movies.findIndex(movieData => movieData[MOVIE_PROPERTIES_MAP.TITLE] === skippedMovieTitle);
      const skippedMovie = movies.splice(skippedMovieIndex, 1)[0];
      movies.push(skippedMovie);
    });
  }

  if (winners.length === 1) {
    let winner = winners[0];
    const winnerIndex = movies.findIndex(movieData => movieData[MOVIE_PROPERTIES_MAP.TITLE] === winner.poll_media.text);
    const winnerMovie = movies.splice(winnerIndex, 1)[0];
    winnerMovie[MOVIE_PROPERTIES_MAP.WATCHED] = true;
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
      question: { text: `[TIE BREAKER!] ${messageData.poll.question.text} [TIE BREAKER!]` },
      answers: newOptions,
      duration: DEFAULT_TIE_BREAKER_POLL_DURATION,
      allow_multiselect: false
    };

    await createResultsMessage(channelId, null, skippedMovies);

    await handleCreatePoll(channelId, pollObject, member);
  }

  await updateList(movies);
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
          content: '### Movies that will be moved to the end of the list due to low/no votes:'
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