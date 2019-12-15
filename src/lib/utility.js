import uniqid from "uniqid";

export const getUniqId = (prefix, suffix) => {
  const preId = uniqid(prefix);
  const suffId = uniqid(suffix);

  return preId + suffId;
};
