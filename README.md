# ⚡Powerful Node Express Drizzle API

[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/gopinaathk/node-express-drizzle-api?include_prereleases)](https://img.shields.io/github/v/release/gopinaathk/node-express-drizzle-api?include_prereleases)
[![GitHub last commit](https://img.shields.io/github/last-commit/gopinaathk/node-express-drizzle-api)](https://img.shields.io/github/last-commit/gopinaathk/node-express-drizzle-api)
[![GitHub issues](https://img.shields.io/github/issues-raw/gopinaathk/node-express-drizzle-api)](https://img.shields.io/github/issues-raw/gopinaathk/node-express-drizzle-api)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/gopinaathk/node-express-drizzle-api)](https://img.shields.io/github/issues-pr/gopinaathk/node-express-drizzle-api)
[![GitHub](https://img.shields.io/github/license/gopinaathk/node-express-drizzle-api)](https://img.shields.io/github/license/gopinaathk/node-express-drizzle-api)

A high-performance, type-safe, and modern, scalable Node.js backend. Built with Express, Bun, Drizzle ORM, Redis, and PostgreSQL, focused on developer experience, maintainability, and extensibility.

<h2 id="technologies">💻 Technologies</h2>

⚡ Bun Runtime for blazing fast startup & performance

🧠 Type-safe codebase with TypeScript

🧰 Modular Express architecture (routes, controllers, middlewares, services)

🧵 Session-based authentication with cookie-parser and Redis

🚀 Drizzle ORM with PostgreSQL: type-safe schema, migrations, and queries

🛑 Conditional rate limiting with express-rate-limit (via .env)

🧾 File uploads with multer and support for multipart/form-data

🔐 Environment configuration with dotenv

♻️ CORS handling with custom config

📦 Redis health check for robust monitoring

📜 RESTful routing structure

🧪 Ready for testing & containerization

## Getting Started

⚙️ Requirements

Bun (v1.1+)

PostgreSQL (local or remote)

Redis (optional)

Node.js (optional if using Bun only)

# Installation

```shell
git clone https://github.com/gopinaathk/node-express-drizzle-api

cd node-express-drizzle-api

bun install
```

<h3>Config .env variables</h2>

```yaml
# Application Configuration

# Change this to your application's name, e.g., "Node Express Drizzle"
APP_NAME=ExampleApp 

# Change this to your application's URL, e.g., http://localhost:8000 for local development
APP_URL=http://example.com 

# https://example.com,https://admin.example.com for multiple URLs
FRONTEND_APP_URL=http://app.example.com 

# Change this to the port your application will run on
PORT=3000 

# Environment Configuration
NODE_ENV=development # development or production

# Rate Limiting
RATE_LIMIT_ENABLED=true # true or false

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/exampledb # Adjust the user, password, host, and database name as needed

# Redis Configuration
REDIS_ENABLED=false # true or false
REDIS_HOST=127.0.0.1  # If you are using a different host for Redis, change it accordingly
REDIS_PASSWORD=null # If you have a password for Redis, set it here
REDIS_PORT=6379 # If you are using a different port for Redis, change it accordingly
```

<h3>Starting</h3>

How to start your project

```bash

# Run the following to generate schema types:
bunx drizzle-kit generate

# Push new schema/migration:
bunx drizzle-kit push

# Run Development Server
bun run dev
```

## License

Distributed under the MIT License. See [MIT License](https://opensource.org/licenses/MIT) for more information.
