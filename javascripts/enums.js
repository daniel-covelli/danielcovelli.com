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
  PULL_REQUEST: 'PullRequestEvent'
};

export { eventTypes, createEventType, pullReqEventType };
