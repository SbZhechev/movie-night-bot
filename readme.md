- /suggestion-add - add movie to the list
  - title - title of the movie
  - watched - is the movie already watched
  - participated - has the movie already participated in a poll
  - theme - Theme/genre of the movie (i.e. Christmas/Action/Horror)
  - position - position to add the movie at in the list

- /suggestion-move - move a movie up/down the list
  - title - the title of the movie to move
  - to - front/back of the list
  - position - position to move the movie to in the list. Higher priority than "to" option so if both are provided only "position" will be taken into consideration

- /suggetion-delete - remove movie from the list
  - title: title of the movie to delete

- /suggestion-edit - edit a movie in the list
  - title - the title of the movie to edit
  - new_title - new title for the movie
  - new_watched - new watched value for the movie
  - new_participated - new participated value for the movie
  - new_theme - new theme value for the movie

- /poll-preview - shows you what would be the options of the next poll if you provide the same options
  - size - number of movies in the poll. Default 10
  - theme - the theme for the movies
  - participated - should we allow movies that have participated before

- /poll-create - create the poll
  - title - title of the poll
  - size - number of movies in the poll. Default 10
  - theme - the theme for the movies
  - participated - should we allow movies that have participated before
  - duration - the duration of the poll in hours. Default 72 hours (3 days).

- /list-get - returns the list as a file

- /list-set - replace the list file with the provided file
  - file - file that should replace the current list file
 
- poll logic
  - first N movies from the list get picked
  - watched movies are filtered out
  - by default christmas movies are filtered out (unless theme: "Christmas" is specified in the options)
  - movies that get > 10% of votes stay in the same place
  - movies that get < 10% of votes get moved to the end of the list
  - winner gets marked as watched and moved to the end of the list
  - if there is a tie, another tie breaker poll is created
  - people have multiple votes
  - poll duration is 72 hours

- tie breaker poll logic
  - all movies that tied in previous poll get added
  - winner gets moved to the back of the list and marked as watched
  - all other movies keep their current position
  - people have 1 vote
  - poll duration is 24 hours