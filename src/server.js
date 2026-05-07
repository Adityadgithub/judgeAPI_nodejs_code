const app = require('./app');
const config = require('./config/judge0');

app.listen(config.port, () => {
  console.log(`Judge backend listening on port ${config.port}`);
});
