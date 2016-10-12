const aliases = {};

export default {
  get: key => aliases[key],

  set: (key, value) => {
    aliases[key] = value;
  },
};
