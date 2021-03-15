const BASE_URL = 'https://api.github.com/';
const USER_NAME = 'daniel-covelli';
const GITHUB_URL = 'https://github.com/';

const getGithubEvents = async () => {
  try {
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

const parsedGithubEvents = async () => {
  const data = await getGithubEvents();

  let div = document.getElementById('github');

  for (var i = 0; i < data.length; i++) {
    let commits = data[i].payload.commits;

    for (var j = 0; j < commits.length; j++) {
      let commit = await getCommit(commits[j].url);

      let repoNameInputString = data[i].repo.name;
      let repoNameTruncated =
        repoNameInputString.length > 10
          ? repoNameInputString.substring(0, 10 - 1).concat('…')
          : repoNameInputString;

      let html = `
        <div class="github-item-wrapper">
            <div class="github-item-row">
                <div class="github-item-header">
                    <h4 class="no-margin">🚀&nbsp;&nbsp; 
                        <a href="${commit.html_url}" target="_blank">Commit</a>
                    </h4>
                </div>
                <div class="github-item-time">
                    ${commit.commit.committer.date}
                </div>
            </div>
            <div class="github-item-subrow">
                <div class="github-item-message">
                    <i>"${commit.commit.message}"</i>
                </div>
                <a href="${GITHUB_URL}${data[i].repo.name}" target="_blank">
                    <small>
                        <b>
                            <p class="github-item-repo">
                                🗂&nbsp;&nbsp; ${repoNameTruncated}
                            </p>
                        </b>
                    </small>
                </a>
                
            </div>
        </div> 
      `;

      div.innerHTML += html;
      console.log('COMMIT', commit);
    }

    console.log(`DATA AT ${i}`, data[i]);
  }

  div.innerHTML +=
    '<h4>tjeioajfiajerlafkmecainoiwasfdkas;flkajslkfjasflkajsna</h4>';

  //   div.innerHTML += '<div style="height: 20px;">';
};

// document.getElementById('github').innerHTML = result;

parsedGithubEvents();
