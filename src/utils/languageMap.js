const languageMap = {
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  c: { language: 'c', version: '10.2.0' },
  cpp: { language: 'cpp', version: '10.2.0' }
};

const supportedLanguages = Object.keys(languageMap);

module.exports = { languageMap, supportedLanguages };
