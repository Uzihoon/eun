import axios from "axios";
import queryString from "query-string";

export const postFile = file => axios.post("/post/gz", file);