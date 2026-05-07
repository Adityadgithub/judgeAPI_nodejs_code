const axios = require('axios');
const config = require('../config/judge0');
const { languageMap } = require('../utils/languageMap');

const judge0Client = axios.create({
  baseURL: config.judge0Url,
  timeout: config.requestTimeoutMs,
  headers: {
    'Content-Type': 'application/json'
  }
});

function formatSubmissionResult(result) {
  return {
    stdout: result.stdout || null,
    stderr: result.stderr || null,
    compile_output: result.compile_output || null,
    status: result.status || null,
    memory: result.memory || null,
    time: result.time || null
  };
}

function isFinished(statusId) {
  return statusId !== 1 && statusId !== 2;
}

async function createSubmission({ language, code, input }) {
  const response = await judge0Client.post('/submissions', {
    source_code: code,
    language_id: languageMap[language],
    stdin: input
  });

  return response.data.token;
}

async function getSubmission(token) {
  const response = await judge0Client.get(`/submissions/${token}`, {
    params: {
      fields: 'stdout,stderr,compile_output,status,memory,time'
    }
  });

  return response.data;
}

async function waitForSubmission(token) {
  for (let attempt = 0; attempt < config.maxPollAttempts; attempt += 1) {
    const result = await getSubmission(token);

    if (isFinished(result.status && result.status.id)) {
      return formatSubmissionResult(result);
    }

    await new Promise((resolve) => setTimeout(resolve, config.pollIntervalMs));
  }

  const error = new Error('Judge0 execution timed out');
  error.statusCode = 504;
  throw error;
}

async function runCode(payload) {
  const token = await createSubmission(payload);
  return waitForSubmission(token);
}

module.exports = {
  runCode
};
