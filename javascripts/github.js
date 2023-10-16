import {
  pushEventDataRich,
  pushEventPoorCommit,
  forbiddenError,
  createEvent,
  pullRequestEvent,
  forkEvent
} from './components.js';
import { eventTypes, createEventType, pullReqEventType } from './enums.js';
import { getGithubEvents, getCommit } from './api.js';

const GITHUB_EVENTS_PER_PAGE = 20;
const OPTIMISTIC_RENDER_POINT = 12;
const OPTIMISTIC_RENDER_POINT_ON_PAGINATION = 6;
const MAX_NUMBER_OF_PAGINATED_REQUESTS = 3;

const parsedGithubEvents = async (pg) => {
  const div = document.getElementById('github');

  if (pg > MAX_NUMBER_OF_PAGINATED_REQUESTS) {
    return;
  }

  const currentPageDiv = document.createElement('div');
  currentPageDiv.style.opacity = 0;
  currentPageDiv.style.transition = 'opacity 0.3s ease-out';
  currentPageDiv.setAttribute('class', `page-${pg}`);
  currentPageDiv.setAttribute('id', `page-${pg}`);

  try {
    const data = await getGithubEvents(pg, GITHUB_EVENTS_PER_PAGE);
    console.log('DATA', data);
    for (var i = 0; i < data.length; i++) {
      console.log(i);

      if (pg > 1 && i === OPTIMISTIC_RENDER_POINT_ON_PAGINATION) {
        document.getElementById(`spinner-pagination-${pg - 1}`).remove();
        div.appendChild(currentPageDiv);
        window.getComputedStyle(currentPageDiv).opacity;
        currentPageDiv.style.opacity = 1;
      }
      if (pg === 1 && i === OPTIMISTIC_RENDER_POINT) {
        document.getElementById('spinner').remove();
        div.appendChild(currentPageDiv);
        window.getComputedStyle(currentPageDiv).opacity;
        currentPageDiv.style.opacity = 1;
      }
      switch (data[i].type) {
        case eventTypes.PUSH:
          let commits = data[i].payload.commits;
          for (var j = 0; j < commits.length; j++) {
            try {
              let commit = await getCommit(commits[j].url);
              pushEventDataRich(currentPageDiv, data[i], commit);
            } catch (e) {
              console.log('PUSH EVENT ERROR', e);
              pushEventPoorCommit(
                currentPageDiv,
                data[i],
                data[i].payload.commits[j]
              );
            }
          }
          break;
        case eventTypes.CREATE:
          switch (data[i].payload.ref_type) {
            case createEventType.BRANCH:
              createEvent(currentPageDiv, data[i], createEventType.BRANCH);
              break;
            case createEventType.REPO:
              createEvent(currentPageDiv, data[i], createEventType.REPO);
              break;
            default:
              div.innerHTML += '<h4>UNKNOWN CREATE</h4>';
          }
          break;
        case eventTypes.PULL_REQUEST:
          switch (data[i].payload.action) {
            case pullReqEventType.OPENED:
              pullRequestEvent(
                currentPageDiv,
                data[i],
                pullReqEventType.OPENED
              );
              break;
            case pullReqEventType.CLOSED:
              pullRequestEvent(
                currentPageDiv,
                data[i],
                pullReqEventType.CLOSED
              );
              break;
            default:
              div.innerHTML += '<h4>UNKNOWN PULL REQUEST</h4>';
          }
          break;
        case eventTypes.FORK:
          console.log('FORK DATA', data[i]);
          let forkedRepoData = await getCommit(data[i].repo.url);
          console.log('FORKED REPO DATA', forkedRepoData);
          forkEvent(currentPageDiv, data[i], forkedRepoData);
          break;
      }
    }

    if (pg === 1 && document.getElementById('spinner')) {
      document.getElementById('spinner').remove();
      div.appendChild(currentPageDiv);
      window.getComputedStyle(currentPageDiv).opacity;
      currentPageDiv.style.opacity = 1;
    }

    if (document.getElementById(`spinner-pagination-${pg - 1}`)) {
      document.getElementById(`spinner-pagination-${pg - 1}`).remove();
    }

    if (pg === MAX_NUMBER_OF_PAGINATED_REQUESTS) {
      div.innerHTML += `
        <p style="padding-top: 20px;">
            For more of my Github activity, checkout my
            <a href="https://github.com/daniel-covelli" target="_blank">profile</a>.
        </p>`;
    } else {
      currentPageDiv.innerHTML += `
        <div id="spinner-pagination-${pg}" class="spinner-pagination">
            <img
                src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
            />
        </div>`;
    }
  } catch (e) {
    if (document.getElementById('spinner')) {
      document.getElementById('spinner').remove();
    }
    if (currentPageDiv) {
      currentPageDiv.remove();
    }
    forbiddenError(div);
  }
};

parsedGithubEvents(1);

export { parsedGithubEvents };
