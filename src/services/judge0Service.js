const axios = require('axios');
const config = require('../config/judge0');
const { languageMap } = require('../utils/languageMap');

const pistonClient = axios.create({
  baseURL: config.judge0Url,
  timeout: config.requestTimeoutMs,
  headers: { 'Content-Type': 'application/json' }
});

async function runCode({ language, code, input }) {
  const lang = languageMap[language];
  const response = await pistonClient.post('/api/v2/execute', {
    language: lang.language,
    version: lang.version,
    files: [{ content: code }],
    stdin: input || ''
  });

  const run = response.data.run;
  return {
    stdout: run.stdout || null,
    stderr: run.stderr || null,
    compile_output: response.data.compile?.stderr || null,
    status: { description: run.code === 0 ? 'Accepted' : 'Error' },
    memory: null,
    time: null
  };
}

module.exports = { runCode };
