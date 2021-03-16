const BASE_URL = 'https://api.github.com/';
const USER_NAME = 'daniel-covelli';
const GITHUB_URL = 'https://github.com/';

const getGithubEvents = async () => {
  try {
    adddlert('FAKE 403');
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

    // console.log(`COMMIT`, res);

    return res.data;
  } catch (e) {
    console.error(e);
  }

  // https://docs.github.com/en/rest/reference/repos#get-a-commit
};

const truncate = (input, max) => {
  return input.length > max ? input.substring(0, max - 1).concat('…') : input;
};

const parsedGithubEvents = async () => {
  let div = document.getElementById('github');
  try {
    const data = await getGithubEvents();

    for (var i = 0; i < data.length; i++) {
      console.log(`DATA AT ${i}`, data[i]);
      switch (data[i].type) {
        case 'PushEvent':
          let commits = data[i].payload.commits;
          for (var j = 0; j < commits.length; j++) {
            try {
              let commit = await getCommit(commits[j].url);

              let repoNameTruncated = truncate(data[i].repo.name, 35);
              let commitMessageTruncated = truncate(commit.commit.message, 30);

              let html = `
                      <div class="github-item-wrapper">
                          <div class="github-item-row">
                              <div class="github-item-header">
                                  <h4 class="github-header"> 
                                      <a href="${
                                        commit.html_url
                                      }" target="_blank">commit</a> to 
                                  </h4>
                              </div>
                              <div class="github-item-time">
                                  <small>
                                      ${moment(
                                        commit.commit.committer.date
                                      ).fromNow()}
                                  </small>
                              </div>
                          </div>
                          <div class="github-item-subrow">
                              <div class="github-item-message">
                                  <i>"${commitMessageTruncated}"</i>
                              </div>
                          </div>
              
                          <a href="${GITHUB_URL}${
                data[i].repo.name
              }" target="_blank">
                              <small>
                                  <b>
                                      <p class="github-item-repo">
                                          🗂&nbsp;&nbsp; ${repoNameTruncated}
                                      </p>
                                  </b>
                              </small>
                          </a>
                      </div> 
                      `;

              div.innerHTML += html;
              console.log('COMMIT', commit);
            } catch (e) {
              let repoNameTruncated = truncate(data[i].repo.name, 35);
              let commitMessageTruncated = truncate(commits[j].message, 30);

              let html = `
                      <div class="github-item-wrapper">
                          <div class="github-item-row">
                              <div class="github-item-header">
                                  <h4 class="github-header"> 
                                      commit to 
                                  </h4>
                              </div>
                              <div class="github-item-time">
                                  <small>
                                      ${moment(data[i].created_at).fromNow()}
                                  </small>
                              </div>
                          </div>
                          <div class="github-item-subrow">
                              <div class="github-item-message">
                                  <i>"${commitMessageTruncated}"</i>
                              </div>
                          </div>
                          <small>
                              <b>
                                  <p class="github-item-repo-changed">
                                      🗂&nbsp;&nbsp; (repository name changed)
                                  </p>
                              </b>
                          </small>
                  
                      </div> `;
              // let commit = await getCommit(
              //   'https://api.github.com/repos/daniel-covelli/danielcovelli.com/commits/51594d5e9e0ca6039f37f76cf8c469a4db8d90e1'
              // );
              // console.log('THE COMMIT WORKED', commit);
              div.innerHTML += html;
            }
          }
          break;
        case 'CreateEvent':
          div.innerHTML += '<h4>Create Event</h4>';
          break;
        default:
          div.innerHTML += '<h4>no commits or create</h4>';
      }
    }
  } catch (e) {
    div.innerHTML += `
        <div class="github-item-row">
            <h1>🙃</h1> <h4>403 Forbidden</h4>
        </div>
      `;
  }

  //   div.innerHTML += '<div style="height: 20px;">';
};

// document.getElementById('github').innerHTML = result;

// ${data[i].repo.name.split('/')[1]}

parsedGithubEvents();
