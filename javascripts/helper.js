const truncate = (input, max) => {
  return input.length > max ? input.substring(0, max - 1).concat('…') : input;
};

const splitRepoName = (input) => {
  return input.split('/')[1];
};

export { truncate, splitRepoName };
