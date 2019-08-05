import axios from "axios";
import queryString from "query-string";

const url = "/api/";

export const tryLogin = param =>
  axios.post(`${url}auth/login`, queryString.stringify(param));
