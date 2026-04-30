import {useQueryStates} from "nuqs";

import {topicsParams} from "../params";

export const useTopicsParams = () => {
  return useQueryStates(topicsParams);
};
