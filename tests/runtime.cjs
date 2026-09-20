let playwright;
try{playwright=require('playwright');}catch{
 playwright=require(process.env.PLAYWRIGHT_MODULE||'/Users/manuagrawal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
}
module.exports={...playwright};
