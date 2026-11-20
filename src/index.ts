import axios, { AxiosInstance, AxiosError } from 'axios';

// ============================================
// Types
// ============================================

export interface BrasilApiError {
  message: string;
  type: string;
  name?: string;
  statusCode: number;
}

export interface CepData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string | null;
  street: string | null;
  service: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  timezoneName?: string;
}

export interface CnpjData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal: string;
  cnae_fiscal_descricao: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
  municipio: string;
  abertura: string;
  situacao_cadastral: string;
  data_situacao_cadastral: string;
  natureza_juridica: string;
  capital_social: number;
  qsa: Array<{
    nome: string;
    qual: string;
    pais_origem: string;
    qual_socio: string;
    cnpj_cpf_socio: string;
    entrada_sociedade: string;
  }>;
}

export interface BankData {
  ispb: string;
  name: string;
  code: number | null;
  fullName: string;
}

export interface DddData {
  ddd?: string;
  state: string;
  cities: string[];
}

export interface HolidayData {
  date: string;
  name: string;
  type: string;
  level: string;
}

export interface CpfData {
  isValid: boolean;
}

export interface StatusData {
  status: string;
  timestamp?: string;
}

// ============================================
// Error Class
// ============================================

export class BrasilApiClientError extends Error {
  public readonly statusCode: number;
  public readonly type: string;
  public readonly originalError?: Error;

  constructor(message: string, statusCode: number, type: string, originalError?: Error) {
    super(message);
    this.name = 'BrasilApiClientError';
    this.statusCode = statusCode;
    this.type = type;
    this.originalError = originalError;
  }

  static fromAxiosError(error: AxiosError): BrasilApiClientError {
    const statusCode = error.response?.status ?? 500;
    const data = error.response?.data as BrasilApiError | undefined;
    const message = data?.message ?? error.message;
    const type = data?.type ?? 'unknown_error';
    return new BrasilApiClientError(message, statusCode, type, error);
  }
}

// ============================================
// Client Configuration
// ============================================

export interface BrasilApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

const DEFAULT_BASE_URL = 'https://brasilapi.com.br/api';

// ============================================
// Main Client Class
// ============================================

export class BrasilApiClient {
  private client: AxiosInstance;

  constructor(config: BrasilApiClientConfig = {}) {
    this.client = axios.create({
      baseURL: config.baseURL ?? DEFAULT_BASE_URL,
      timeout: config.timeout ?? 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        throw BrasilApiClientError.fromAxiosError(error);
      }
    );
  }

  // ============================================
  // CEP Endpoints
  // ============================================

  /**
   * Busca CEP (v1 - básico)
   */
  async getCepV1(cep: string): Promise<CepData> {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await this.client.get<CepData>(`/cep/v1/${cleanCep}`);
    return response.data;
  }

  /**
   * Busca CEP com geolocalização (v2 - recomendado)
   */
  async getCepV2(cep: string): Promise<CepData> {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await this.client.get<CepData>(`/cep/v2/${cleanCep}`);
    return response.data;
  }

  /**
   * Busca CEP com mais detalhes (v3)
   */
  async getCepV3(cep: string): Promise<CepData> {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await this.client.get<CepData>(`/cep/v3/${cleanCep}`);
    return response.data;
  }

  // ============================================
  // CNPJ Endpoints
  // ============================================

  /**
   * Busca CNPJ
   */
  async getCnpj(cnpj: string): Promise<CnpjData> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const response = await this.client.get<CnpjData>(`/cnpj/v1/${cleanCnpj}`);
    return response.data;
  }

  // ============================================
  // Banks Endpoints
  // ============================================

  /**
   * Lista todos os bancos
   */
  async getBanks(): Promise<BankData[]> {
    const response = await this.client.get<BankData[]>('/banks/v1');
    return response.data;
  }

  /**
   * Busca banco por código
   */
  async getBankByCode(code: number): Promise<BankData> {
    const response = await this.client.get<BankData>(`/banks/v1/${code}`);
    return response.data;
  }

  // ============================================
  // DDD Endpoints
  // ============================================

  /**
   * Busca DDD
   */
  async getDdd(ddd: string): Promise<DddData> {
    const response = await this.client.get<DddData>(`/ddd/v1/${ddd}`);
    return response.data;
  }

  // ============================================
  // Holidays (Feriados) Endpoints
  // ============================================

  /**
   * Lista feriados nacionais por ano
   */
  async getHolidays(year: number): Promise<HolidayData[]> {
    const response = await this.client.get<HolidayData[]>(`/feriados/v1/${year}`);
    return response.data;
  }

  // ============================================
  // CPF Endpoints
  // ============================================

  /**
   * Valida CPF
   * Returns { isValid: boolean }
   */
  async validateCpf(cpf: string): Promise<CpfData> {
    const cleanCpf = cpf.replace(/\D/g, '');
    const response = await this.client.get<CpfData>(`/cpf/v1/${cleanCpf}`);
    return response.data;
  }

  // ============================================
  // Status/Health Check
  // ============================================

  /**
   * Verifica status da API
   */
  async getStatus(): Promise<StatusData> {
    const response = await this.client.get<StatusData>('/status/v1');
    return response.data;
  }
}

// ============================================
// Default Instance & Helper Functions
// ============================================

let defaultClient: BrasilApiClient | null = null;

export function createBrasilApiClient(config?: BrasilApiClientConfig): BrasilApiClient {
  return new BrasilApiClient(config);
}

export function getDefaultClient(): BrasilApiClient {
  if (!defaultClient) {
    defaultClient = new BrasilApiClient();
  }
  return defaultClient;
}

// Convenience functions using default client
export const cep = {
  v1: (cep: string) => getDefaultClient().getCepV1(cep),
  v2: (cep: string) => getDefaultClient().getCepV2(cep),
  v3: (cep: string) => getDefaultClient().getCepV3(cep),
};

export const cnpj = {
  get: (cnpj: string) => getDefaultClient().getCnpj(cnpj),
};

export const banks = {
  list: () => getDefaultClient().getBanks(),
  byCode: (code: number) => getDefaultClient().getBankByCode(code),
};

export const ddd = {
  get: (ddd: string) => getDefaultClient().getDdd(ddd),
};

export const holidays = {
  byYear: (year: number) => getDefaultClient().getHolidays(year),
};

export const cpf = {
  validate: (cpf: string) => getDefaultClient().validateCpf(cpf),
};

export const status = {
  get: () => getDefaultClient().getStatus(),
};

// Export all types and the main class
export * from './index';