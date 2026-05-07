# Judge Node.js Backend

Express backend for a coding app that submits code to a self-hosted Judge0 server.

## Features

- `POST /run` endpoint for running code
- `GET /health` endpoint for uptime checks
- Self-hosted Judge0 support
- `python`, `java`, `c`, and `cpp` language mapping
- Request validation
- CORS
- Rate limiting
- Request logging middleware
- Plain JavaScript with async/await

## Folder Structure

```text
judge_nodejs/
  .env.example
  .gitignore
  package.json
  README.md
  src/
    app.js
    server.js
    config/
      judge0.js
    middleware/
      logger.js
      validateRunRequest.js
    routes/
      run.js
    services/
      judge0Service.js
    utils/
      languageMap.js
```

## Requirements

- Node.js 18+
- npm
- A running self-hosted Judge0 server at `http://YOUR_SERVER_IP:2358`

## Setup

```bash
cd judge_nodejs
npm install
cp .env.example .env
```

Update `.env`:

```env
PORT=3000
JUDGE0_URL=http://YOUR_SERVER_IP:2358
CORS_ORIGIN=*
```

Start the server:

```bash
npm start
```

For development:

```bash
npm run dev
```

## API

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "judge0Url": "http://YOUR_SERVER_IP:2358",
  "uptime": 12.34
}
```

### Run Code

```http
POST /run
Content-Type: application/json
```

Request body:

```json
{
  "language": "python",
  "code": "print(input())",
  "input": "Hello Judge0"
}
```

Supported languages:

| Language | Judge0 ID |
| --- | ---: |
| `python` | 71 |
| `java` | 62 |
| `c` | 50 |
| `cpp` | 54 |

Response:

```json
{
  "stdout": "Hello Judge0\n",
  "stderr": null,
  "compile_output": null,
  "status": {
    "id": 3,
    "description": "Accepted"
  },
  "memory": 3300,
  "time": "0.01"
}
```

## VPS Deployment

1. Install Node.js and npm.

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Upload or clone this project on the VPS.

```bash
git clone <your-repo-url>
cd <your-repo>/judge_nodejs
npm install --omit=dev
cp .env.example .env
```

3. Edit `.env`.

```bash
nano .env
```

Set:

```env
NODE_ENV=production
PORT=3000
JUDGE0_URL=http://YOUR_SERVER_IP:2358
CORS_ORIGIN=https://your-frontend-domain.com
```

4. Open the backend port if needed.

```bash
sudo ufw allow 3000/tcp
```

For production, put Nginx in front of the Node app and proxy HTTPS traffic to `localhost:3000`.

## Run With PM2

Install PM2:

```bash
sudo npm install -g pm2
```

Start the app:

```bash
cd judge_nodejs
pm2 start src/server.js --name judge-nodejs
```

Save and enable startup:

```bash
pm2 save
pm2 startup
```

Useful commands:

```bash
pm2 logs judge-nodejs
pm2 restart judge-nodejs
pm2 status
```

## Connect Flutter Frontend

Send a POST request from Flutter to your backend, not directly to Judge0.

For Android emulator:

```dart
const backendUrl = 'http://10.0.2.2:3000/run';
```

For a real device on the same Wi-Fi:

```dart
const backendUrl = 'http://YOUR_COMPUTER_LAN_IP:3000/run';
```

For production:

```dart
const backendUrl = 'https://api.your-domain.com/run';
```

Example Flutter request:

```dart
final response = await http.post(
  Uri.parse(backendUrl),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'language': 'python',
    'code': 'print(input())',
    'input': 'Hello from Flutter',
  }),
);
```

The backend returns `stdout`, `stderr`, `compile_output`, `status`, `memory`, and `time`.
