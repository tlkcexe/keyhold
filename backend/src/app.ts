import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { env, isProd } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { globalRateLimiter } from './middleware/rateLimit';

const app = express();

// --- Security headers ---
app.use(helmet());

// --- CORS: only the configured client origin, with credentials for cookies ---
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// --- Body / cookie parsing ---
app.use(express.json({ limit: '10kb' })); // small limit mitigates body-based DoS
app.use(cookieParser(env.COOKIE_SECRET));

// --- Logging ---
app.use(morgan(isProd ? 'combined' : 'dev'));

// --- Rate limiting (general) ---
app.use('/api', globalRateLimiter);

// --- API docs ---
const openapiDocument = YAML.load(path.join(__dirname, 'config/openapi.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

// --- Health check ---
app.get('/api/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// --- Routes ---
app.use('/api', routes);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
