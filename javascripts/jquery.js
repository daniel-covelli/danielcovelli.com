import { parsedGithubEvents } from './github.js';

let currentPageNumber = 1;
let parsingFunctionNotRunning = true;

$('.github').on(
  'scroll',
  _.throttle(() => {
    if (
      $('.github').scrollTop() + $('.github').innerHeight() >=
      document.getElementById('github').scrollHeight
    ) {
      let paginatedSpinnerExists = document.getElementById(
        `spinner-pagination-${currentPageNumber}`
      );

      if (paginatedSpinnerExists) {
        paginatedSpinnerExists.style.opacity = 1;
      }

      if (parsingFunctionNotRunning) {
        console.log('PARSE GITHUB EVENT FIRED');
        parsingFunctionNotRunning = false;

        currentPageNumber = currentPageNumber + 1;
        // const result = await parsedGithubEvents(currentPageNumber);
        $.when(parsedGithubEvents(currentPageNumber)).then(() => {
          parsingFunctionNotRunning = true;
        });
      }
    } else {
      //   document.getElementById('spinner-pagination').style.opacity = 0;
    }
  }, 200)
);
