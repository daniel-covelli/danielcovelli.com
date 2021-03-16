import { truncate, splitRepoName } from './helper.js';

const GITHUB_URL = 'https://github.com/';

const pushEventDataRich = (div, data_i, commit) => {
  let repoNameTruncated = truncate(splitRepoName(data_i.repo.name), 35);

  let commitMessageTruncated = truncate(commit.commit.message, 30);

  let repoURL = `${GITHUB_URL}${data_i.repo.name}`;

  let pushID = data_i.payload.push_id;

  let html = `
            <div class="github-item-wrapper">
                <div class="github-item-row">
                    <div class="github-item-header">
                        <b>
                            <p class="github-header">
                            pushed 
                                <a href="${
                                  commit.html_url
                                }" target="_blank"> commit</a> 
                                <span class="github-item-header-event-id">   
                                    ${pushID}           
                                </span> 
                            </p>
                        </b>
                    </div>
                    <div class="github-item-time">
                        <small>
                            ${moment(commit.commit.committer.date).fromNow()}
                        </small>
                    </div>
                </div>
                <div class="github-item-subrow">
                    <div class="github-item-message">
                        <i>"${commitMessageTruncated}"</i>
                    </div>
                    <div class="repo-wrapper">
                        <div class="repo-icon-wrapper">
                            <img src="../resources/icons8-book-52.png" class="repo-icon"/>
                        </div>
                        <div class="repo-text">
                            <a href="${repoURL}" target="_blank">
                                <small>
                                    <b>
                                        <p class="github-item-repo no-margin">
                                            ${repoNameTruncated}
                                        </p>
                                    </b>
                                </small>
                            </a>
                        </div>
                    </div>     
                </div>
            </div> 
            `;

  div.innerHTML += html;
};

const pushEventPoorCommit = (div, data_i, commits_j) => {
  let commitMessageTruncated = truncate(commits_j.message, 30);

  let pushID = data_i.payload.push_id;

  let html = `
        <div class="github-item-wrapper">
            <div class="github-item-row">
                <div class="github-item-header">
                    <b> 
                        <p class="github-header"> 
                            pushed commit 
                            <span class="github-item-header-event-id">   
                                ${pushID}           
                            </span> 
                        </p>
                    </b>
                </div>
                <div class="github-item-time">
                    <small>
                        ${moment(data_i.created_at).fromNow()}
                    </small>
                </div>
            </div>
            <div class="github-item-subrow">
                <div class="github-item-message">
                    <i>"${commitMessageTruncated}"</i>
                </div>
                <div class="repo-wrapper">
                    <div class="repo-icon-wrapper">
                        <img src="../resources/icons8-book-52.png" class="repo-icon"/>
                    </div>
                    <div class="repo-text">
                        <a>
                            <small>
                                <b>
                                    <p class="github-item-repo-changed no-margin">
                                        (repository name changed)
                                    </p>
                                </b>
                            </small>
                        </a>
                    </div>
                </div>
            </div>
        </div> `;

  div.innerHTML += html;
};

const createEvent = (div, data_i) => {
  let repoNameTruncated = truncate(splitRepoName(data_i.repo.name), 35);

  let repoURL = `${GITHUB_URL}${data_i.repo.name}`;
  let repoID = data_i.repo.id;

  let html = `
            <div class="github-item-wrapper">
                <div class="github-item-row">  
                    <div class="github-item-header"> 
                        <b>
                            <p class="github-header">
                                <a href="
                                    ${repoURL}
                                " target="_blank">
                                    repo
                                </a>  
                                created 
                                <span class="github-item-header-event-id">   
                                    ${repoID}            
                                </span>
                            </p>
                        </b>
                        
                    </div>
                    <div class="github-item-time">
                        <small>
                            ${moment(data_i.created_at).fromNow()}
                        </small>
                    </div>
                </div>
                <div class="github-item-subrow">
                    <div class="github-item-message">
                        <i>New Repository Added</i>
                    </div>
                    <div class="repo-wrapper">
                        <div class="repo-icon-wrapper">
                            <img src="../resources/icons8-book-52.png" class="repo-icon"/>
                        </div>
                        <div class="repo-text">
                            <a href="${repoURL}" target="_blank">
                                <small>
                                    <b>
                                        <p class="github-item-repo no-margin">
                                            ${repoNameTruncated}
                                        </p>
                                    </b>
                                </small>
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;

  div.innerHTML += html;
};

const forbiddenError = (div) => {
  div.innerHTML += `
    <div class="forbidden-wrapper">
        <div class="forbidden-emoji">
            🥴
        </div> 
        <div class="forbidden-content">
            <h4 class="min-margin">
                <strong>
                    403 Forbidden
                </strong>
            </h4>
            <p class="min-margin">Looks like Github rate limited us</p>
            <p class="min-margin">Try again later...</p>
        </div>
    </div>
    `;
};

export { pushEventDataRich, pushEventPoorCommit, forbiddenError, createEvent };
