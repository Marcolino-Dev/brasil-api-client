import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { createBrasilApiClient, BrasilApiClientError } from './index';

const app = express();
const PORT = process.env.PORT || 3000;

const client = createBrasilApiClient({ timeout: 15000 });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const getParam = (req: Request, key: string): string => {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
};

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'brasil-api-local', timestamp: new Date().toISOString() });
});

// Root route - API documentation
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Brasil API Local Server',
    version: '1.0.0',
    description: 'Local proxy for Brasil API (brasilapi.com.br)',
    endpoints: {
      health: 'GET /health',
      cep: {
        v1: 'GET /api/cep/v1/:cep',
        v2: 'GET /api/cep/v2/:cep (com geolocalização)',
        v3: 'GET /api/cep/v3/:cep (detalhado)',
      },
      cnpj: 'GET /api/cnpj/:cnpj',
      banks: {
        list: 'GET /api/banks',
        byCode: 'GET /api/banks/:code',
      },
      ddd: 'GET /api/ddd/:ddd',
      holidays: 'GET /api/holidays/:year',
      cpf: 'GET /api/cpf/:cpf',
      status: 'GET /api/status',
    },
    examples: {
      cep: 'http://localhost:3000/api/cep/v2/01310100',
      banks: 'http://localhost:3000/api/banks',
      holidays: 'http://localhost:3000/api/holidays/2024',
    },
    source: 'https://brasilapi.com.br',
  });
});

// ============================================
// CEP Routes
// ============================================
app.get('/api/cep/v1/:cep', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await client.getCepV1(getParam(req, 'cep'));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/cep/v2/:cep', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await client.getCepV2(getParam(req, 'cep'));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/cep/v3/:cep', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await client.getCepV3(getParam(req, 'cep'));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================
// CNPJ Routes
// ============================================
app.get('/api/cnpj/:cnpj', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await client.getCnpj(getParam(req, 'cnpj'));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================
// Banks Routes
// ============================================
app.get('/api/banks', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await client.getBanks();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/banks/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = parseInt(getParam(req, 'code'), 10);
    const result = await client.getBankByCode(code);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================
// DDD Routes
// ============================================
app.get('/api/ddd/:ddd', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await client.getDdd(getParam(req, 'ddd'));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================
// Holidays Routes
// ============================================
app.get('/api/holidays/:year', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const year = parseInt(getParam(req, 'year'), 10);
    const result = await client.getHolidays(year);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================
// CPF Routes
// ============================================
app.get('/api/cpf/:cpf', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await client.validateCpf(getParam(req, 'cpf'));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================
// Status Routes
// ============================================
app.get('/api/status', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await client.getStatus();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================
// Error Handler
// ============================================
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof BrasilApiClientError) {
    return res.status(error.statusCode).json({
      error: error.message,
      type: error.type,
      statusCode: error.statusCode,
    });
  }

  console.error('Server error:', error);
  return res.status(500).json({
    error: 'Internal server error',
    type: 'internal_error',
    statusCode: 500,
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    type: 'not_found',
    statusCode: 404,
  });
});

app.listen(PORT, () => {
  console.log(`
🇧🇷 Brasil API Local Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Running on: http://localhost:${PORT}
📋 Health: http://localhost:${PORT}/health

Endpoints disponíveis:
  GET /api/cep/v1/:cep
  GET /api/cep/v2/:cep
  GET /api/cep/v3/:cep
  GET /api/cnpj/:cnpj
  GET /api/banks
  GET /api/banks/:code
  GET /api/ddd/:ddd
  GET /api/holidays/:year
  GET /api/cpf/:cpf
  GET /api/status
  `);
});

export { app };