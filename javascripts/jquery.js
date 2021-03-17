import { paginatedGithubEvents } from './github.js';

$('.github').on(
  'scroll',
  _.throttle(() => {
    console.log('GITHUB INNER HEIHGT', $('.github').innerHeight());
    console.log(
      'GITHUB SCROLLED + INNER  HEIGHT',
      $(this).scrollTop() + $(this).innerHeight()
    );
    console.log(
      'GITHUB SCROLL HEIGHT',
      document.getElementById('github').scrollHeight
    );
    if (
      $('.github').scrollTop() + $('.github').innerHeight() >=
      document.getElementById('github').scrollHeight
    ) {
      document.getElementById('spinner-pagination').style.opacity = 1;
      paginatedGithubEvents();
    } else {
      document.getElementById('spinner-pagination').style.opacity = 0;
    }
  }, 200)
);
