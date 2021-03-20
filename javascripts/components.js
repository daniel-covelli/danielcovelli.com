import { truncate, splitRepoName } from './helper.js';
import { createEventType, pullReqEventType } from './enums.js';

const GITHUB_URL = 'https://github.com/';

const pullRequestEvent = (div, data_i, type) => {
  let pullReqType;
  let pullReqDate;
  if (type == pullReqEventType.OPENED) {
    pullReqType = pullReqEventType.OPENED;
    pullReqDate = data_i.payload.pull_request.created_at;
  } else {
    pullReqType = pullReqEventType.CLOSED;
    pullReqDate = data_i.payload.pull_request.closed_at;
  }

  let pullRequestMessage;
  if (data_i.payload.pull_request.body) {
    pullRequestMessage = truncate(data_i.payload.pull_request.body, 30);
  } else {
    pullRequestMessage = truncate(data_i.payload.pull_request.title, 30);
  }

  let pullRequestId = data_i.payload.pull_request.id;
  let pullRequestURL = data_i.payload.pull_request.html_url;
  let pullRequestRepoName = data_i.payload.pull_request.base.repo.name;
  let pullRequestRepoUrl = data_i.payload.pull_request.base.repo.html_url;

  let html = `
            <div class="github-item-wrapper">
                <div class="github-item-row">
                    <div class="github-item-header">
                        <b>
                            <p class="github-header">
                                <a href="${pullRequestURL}" target="_blank"> pull request</a> 
                                ${pullReqType}
                                <span class="github-item-header-event-id">   
                                    ${pullRequestId}           
                                </span> 
                            </p>
                        </b>
                    </div>
                    <div class="github-item-time">
                        <small>
                            ${moment(pullReqDate).fromNow()}
                        </small>
                    </div>
                </div>
                <div class="github-item-subrow">
                    <div class="github-item-message">
                        <i>"${pullRequestMessage}"</i>
                    </div>
                    <div class="repo-wrapper">
                        <div class="repo-icon-wrapper">
                            <img src="../resources/icons8-book-52.png" class="repo-icon"/>
                        </div>
                        <div class="repo-text">
                            <a href="${pullRequestRepoUrl}" target="_blank">
                                <small>
                                    <b>
                                        <p class="github-item-repo no-margin">
                                            ${pullRequestRepoName}
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
                                <a href="${
                                  commit.html_url
                                }" target="_blank"> commit</a> 
                                pushed 
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
                            <img src="resources/icons8-book-52.png" class="repo-icon"/>
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
                            commit pushed 
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
                        <img src="resources/icons8-book-52.png" class="repo-icon"/>
                    </div>
                    <div class="repo-text">
                        <a>
                            <small>
                                <b>
                                    <p class="github-item-repo-changed no-margin">
                                        (repository deleted)
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

const createEvent = (div, data_i, type) => {
  let repoURL;
  let createdType;
  let createdMessage;

  if (type == createEventType.BRANCH) {
    createdType = createEventType.BRANCH;
    repoURL = `${GITHUB_URL}${data_i.repo.name}/tree/${data_i.payload.ref}`;
    createdMessage = truncate(`${data_i.payload.ref}`, 30);
  } else {
    createdType = 'repo';
    repoURL = `${GITHUB_URL}${data_i.repo.name}`;
    if (data_i.payload.description) {
      createdMessage = truncate(`${data_i.payload.description}`, 30);
    } else {
      createdMessage = 'New Repository Added';
    }
  }

  let repoNameTruncated = truncate(splitRepoName(data_i.repo.name), 35);

  let eventID = data_i.repo.id;

  let html = `
            <div class="github-item-wrapper">
                <div class="github-item-row">  
                    <div class="github-item-header"> 
                        <b>
                            <p class="github-header">
                                <a href="
                                    ${repoURL}
                                " target="_blank">
                                    ${createdType}
                                </a>  
                                created 
                                <span class="github-item-header-event-id">   
                                    ${eventID}            
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
                        <i>${createdMessage}</i>
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
                    </>
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

export {
  pushEventDataRich,
  pushEventPoorCommit,
  forbiddenError,
  createEvent,
  pullRequestEvent
};
