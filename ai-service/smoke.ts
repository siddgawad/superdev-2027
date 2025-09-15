import { cfg } from "./src/core/config";

const conf = cfg();
console.log(conf.defaultModel);
console.log(conf.openaiKey);