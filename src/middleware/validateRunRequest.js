const { supportedLanguages } = require('../utils/languageMap');

function validateRunRequest(req, res, next) {
  const { language, code, input } = req.body || {};

  if (!language || typeof language !== 'string') {
    return res.status(400).json({
      error: 'language is required and must be a string',
      supportedLanguages
    });
  }

  const normalizedLanguage = language.toLowerCase();

  if (!supportedLanguages.includes(normalizedLanguage)) {
    return res.status(400).json({
      error: `Unsupported language: ${language}`,
      supportedLanguages
    });
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      error: 'code is required and must be a non-empty string'
    });
  }

  if (input !== undefined && typeof input !== 'string') {
    return res.status(400).json({
      error: 'input must be a string when provided'
    });
  }

  req.validatedRunRequest = {
    language: normalizedLanguage,
    code,
    input: input || ''
  };

  return next();
}

module.exports = validateRunRequest;
