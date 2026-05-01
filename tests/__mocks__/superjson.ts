/* eslint-disable @typescript-eslint/no-explicit-any */
const superjson = {
  stringify: function (obj: any) {
    return JSON.stringify(obj);
  },
  parse: function (str: string) {
    return JSON.parse(str);
  },
};

export default superjson;
