import { paginatedGithubEvents } from './github.js';

$('.github').on(
  'scroll',
  _.throttle(() => {
    if (
      $('.github').scrollTop() + $('.github').innerHeight() >=
      document.getElementById('github').scrollHeight
    ) {
      let paginatedSpinnerExists = document.getElementById(
        'spinner-pagination'
      );

      if (paginatedSpinnerExists) {
        paginatedSpinnerExists.style.opacity = 1;
      }

      paginatedGithubEvents();
    } else {
      //   document.getElementById('spinner-pagination').style.opacity = 0;
    }
  }, 200)
);
