const createEventType = {
  REPO: 'repository',
  BRANCH: 'branch'
};

const pullReqEventType = {
  OPENED: 'opened',
  CLOSED: 'closed'
};

const eventTypes = {
  PUSH: 'PushEvent',
  CREATE: 'CreateEvent',
  PULL_REQUEST: 'PullRequestEvent',
  FORK: 'ForkEvent',
  COMMENT: "IssueCommentEvent"
};

export { eventTypes, createEventType, pullReqEventType };
