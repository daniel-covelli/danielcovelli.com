const BASE_URL = 'https://api.github.com/';
const USER_NAME = 'daniel-covelli';

const getGithubEvents = async (pg = 1, GITHUB_EVENTS_PER_PAGE) => {
  try {
    // adddlert('FAKE 403');
    const res = await axios.get(`${BASE_URL}users/${USER_NAME}/events/public`, {
      params: { per_page: GITHUB_EVENTS_PER_PAGE, page: pg }
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
    adddlert('FAKE 403');
    const res = await axios.get(url);
    console.log(`COMMIT`, res);
    return res.data;
  } catch (e) {
    console.error(e);
  }
  // https://docs.github.com/en/rest/reference/repos#get-a-commit
};

export { getGithubEvents, getCommit };
