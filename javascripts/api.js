const BASE_URL = 'https://api.github.com/';
const USER_NAME = 'daniel-covelli';

/**
 * Gets an array of 20 events from my github.
 *
 * @param {number} pg current page number being requested
 * @param {number} GITHUB_EVENTS_PER_PAGE set to 20
 * @see: https://docs.github.com/en/rest/reference/activity#list-public-events-for-a-user
 */
const getGithubEvents = async (pg = 1, GITHUB_EVENTS_PER_PAGE) => {
  try {
    const res = await axios.get(`${BASE_URL}users/${USER_NAME}/events`, {
      params: { per_page: GITHUB_EVENTS_PER_PAGE, page: pg }
    });
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Gets rich data associated with github commit events.
 *
 * @param {string} url for request
 * @see: https://docs.github.com/en/rest/reference/repos#get-a-commit
 */
const getCommit = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export { getGithubEvents, getCommit };
