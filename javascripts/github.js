import {
  pushEventDataRich,
  pushEventPoorCommit,
  forbiddenError,
  createEvent
} from './components.js';

const BASE_URL = 'https://api.github.com/';
const USER_NAME = 'daniel-covelli';

const getGithubEvents = async () => {
  try {
    // adddlert('FAKE 403');
    const res = await axios.get(`${BASE_URL}users/${USER_NAME}/events/public`);

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

const parsedGithubEvents = async () => {
  let div = document.getElementById('github');

  div.style.visibility = 'hidden';

  try {
    const data = await getGithubEvents();

    for (var i = 0; i < data.length; i++) {
      switch (data[i].type) {
        case 'PushEvent':
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
        case 'CreateEvent':
          console.log('CREATE EVENT', data[i]);
          createEvent(div, data[i]);
          break;
        default:
          div.innerHTML += '<h4>no commits or create</h4>';
      }
    }
  } catch (e) {
    forbiddenError(div);
  }

  document.getElementById('spinner').remove();
  div.style.visibility = 'visible';
};

// ${data[i].repo.name.split('/')[1]}

parsedGithubEvents();
