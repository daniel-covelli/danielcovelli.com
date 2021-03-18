import {
  pushEventDataRich,
  pushEventPoorCommit,
  forbiddenError,
  createEvent,
  pullRequestEvent
} from './components.js';

import { eventTypes, createEventType, pullReqEventType } from './enums.js';

const BASE_URL = 'https://api.github.com/';
const USER_NAME = 'daniel-covelli';
const MAX_NUMBER_OF_PAGINATED_REQUESTS = 3;

let currentPageNumber = 1;

const getGithubEvents = async (pg = 1) => {
  try {
    // adddlert('FAKE 403');
    const res = await axios.get(`${BASE_URL}users/${USER_NAME}/events/public`, {
      params: { per_page: 20, page: pg }
    });

    console.log(`LIST OF EVENTS`, res.data);

    return res.data;
  } catch (e) {
    console.error(e);
  }

  //  https://docs.github.com/en/rest/reference/activity#list-public-events-for-a-user
};

const getCommit = async (url) => {
  try {
    const res = await axios.get(url);
    console.log(`COMMIT`, res);
    return res.data;
  } catch (e) {
    console.error(e);
  }

  // https://docs.github.com/en/rest/reference/repos#get-a-commit
};

const parsedGithubEvents = async (pg = 1) => {
  let div = document.getElementById('github');
  let paginatedSpinnerExists = document.getElementById('spinner-pagination');
  let spinnerExists = document.getElementById('spinner');

  if (pg == MAX_NUMBER_OF_PAGINATED_REQUESTS) {
    if (paginatedSpinnerExists) {
      paginatedSpinnerExists.remove();
    }
    div.innerHTML += `
    <p style>
        For more of my Github activity, checkout my 
        <a href="https://github.com/daniel-covelli" target="_blank">
            profile
        </a>.
    </p>`;
    return;
  }
  if (pg > MAX_NUMBER_OF_PAGINATED_REQUESTS) {
    console.log('PAGE', pg);
    return;
  }
  div.style.opacity = 0;

  try {
    const data = await getGithubEvents(pg);

    for (var i = 0; i < data.length; i++) {
      if (i == 12) {
        if (paginatedSpinnerExists) {
          paginatedSpinnerExists.remove();
        }

        if (spinnerExists) {
          spinnerExists.remove();
        }
        div.style.opacity = 1;
      }
      switch (data[i].type) {
        case eventTypes.PUSH:
          console.log('PUSH EVENT', data[i]);
          let commits = data[i].payload.commits;
          for (var j = 0; j < commits.length; j++) {
            try {
              let commit = await getCommit(commits[j].url);
              pushEventDataRich(div, data[i], commit);
            } catch (e) {
              pushEventPoorCommit(div, data[i], data[i].payload.commits[j]);
            }
          }
          break;
        case eventTypes.CREATE:
          switch (data[i].payload.ref_type) {
            case createEventType.BRANCH:
              createEvent(div, data[i], createEventType.BRANCH);
              console.log('NEW BRANCH', data[i]);
              break;
            case createEventType.REPO:
              createEvent(div, data[i], createEventType.REPO);
              console.log('NEW REPOSITORY', data[i]);
              break;
            default:
              console.log('UNKNOWN CREATE', data[i]);
              div.innerHTML += '<h4>UNKNOWN CREATE</h4>';
          }

          break;
        case eventTypes.PULL_REQUEST:
          switch (data[i].payload.action) {
            case pullReqEventType.OPENED:
              pullRequestEvent(div, data[i], pullReqEventType.OPENED);
              console.log('OPEN PR', data[i]);
              break;
            case pullReqEventType.CLOSED:
              pullRequestEvent(div, data[i], pullReqEventType.CLOSED);
              console.log('CLOSED PR', data[i]);
              break;
            default:
              console.log('UNKNOWN PULL REQUEST', data[i]);
              div.innerHTML += '<h4>UNKNOWN PULL REQUEST</h4>';
          }
          break;
        default:
          console.log('OTHER UNCAPTURED EVENT', data[i]);
          div.innerHTML += '<h4>Oops ignore me</h4>';
      }
    }
  } catch (e) {
    forbiddenError(div);
  }
  div.innerHTML += `
  <div id="spinner-pagination" class="spinner-pagination">
    <img
        src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
    />
  </div>`;
  if (spinnerExists) {
    spinnerExists.remove();
  }
  div.style.opacity = 1;
};

const paginatedGithubEvents = () => {
  currentPageNumber = currentPageNumber + 1;
  parsedGithubEvents(currentPageNumber);
  console.log('WE ARE NOW IN PAGINATED GITHUB EVENTS');
};

parsedGithubEvents(currentPageNumber);

export { paginatedGithubEvents };
