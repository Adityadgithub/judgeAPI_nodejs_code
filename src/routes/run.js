const express = require('express');
const validateRunRequest = require('../middleware/validateRunRequest');
const { runCode } = require('../services/judge0Service');

const router = express.Router();

router.post('/run', validateRunRequest, async (req, res, next) => {
  try {
    const result = await runCode(req.validatedRunRequest);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
