import { BrasilApiClient, BrasilApiClientError } from './index';

describe('BrasilApiClient', () => {
  let client: BrasilApiClient;

  beforeAll(() => {
    client = new BrasilApiClient({
      timeout: 15000,
    });
  });

  describe('CEP', () => {
    it('should fetch CEP v2', async () => {
      const result = await client.getCepV2('01310100');
      expect(result).toBeDefined();
      expect(result.cep).toBeDefined();
      expect(result.city).toBeDefined();
      expect(result.state).toBeDefined();
    }, 15000);

    it('should fetch CEP v1', async () => {
      const result = await client.getCepV1('01310100');
      expect(result).toBeDefined();
      expect(result.cep).toBeDefined();
    }, 15000);

    it('should throw error for invalid CEP', async () => {
      await expect(client.getCepV2('00000000')).rejects.toThrow(BrasilApiClientError);
    }, 15000);
  });

  describe('CNPJ', () => {
    it('should handle invalid CNPJ gracefully', async () => {
      await expect(client.getCnpj('00000000000000')).rejects.toThrow(BrasilApiClientError);
    }, 15000);
  });

  describe('Banks', () => {
    it('should list banks', async () => {
      const result = await client.getBanks();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].code).toBeDefined();
      expect(result[0].name).toBeDefined();
    }, 15000);

    it('should get bank by code', async () => {
      const result = await client.getBankByCode(1);
      expect(result).toBeDefined();
      expect(result.code).toBe(1);
    }, 15000);
  });

  describe('DDD', () => {
    it('should fetch DDD', async () => {
      const result = await client.getDdd('11');
      expect(result).toBeDefined();
      expect(result.state).toBeDefined();
      expect(Array.isArray(result.cities)).toBe(true);
    }, 15000);
  });

  describe('Holidays', () => {
    it('should fetch national holidays', async () => {
      const result = await client.getHolidays(2024);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    }, 15000);
  });

  describe('FIPE', () => {
    it('should list car brands', async () => {
      const result = await client.getFipeBrands('carros');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    }, 15000);
  });

  describe('IBGE', () => {
    it('should list states', async () => {
      const result = await client.getIbgeStates();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(27); // 26 states + DF
    }, 15000);

    it('should list cities by state', async () => {
      const result = await client.getIbgeCitiesByState('SP');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    }, 15000);
  });

  describe('ISBN', () => {
    it('should handle invalid ISBN gracefully', async () => {
      await expect(client.getIsbn('0000000000')).rejects.toThrow(BrasilApiClientError);
    }, 15000);
  });

  describe('NCM', () => {
    it('should fetch NCM', async () => {
      const result = await client.getNcm('84713012');
      expect(result).toBeDefined();
      expect(result.codigo).toBeDefined();
      expect(result.descricao).toBeDefined();
    }, 15000);
  });

  describe('CPF', () => {
    it('should validate CPF', async () => {
      const result = await client.validateCpf('12345678900');
      expect(result).toBeDefined();
      expect(typeof result.isValid).toBe('boolean');
    }, 15000);
  });

  describe('Status', () => {
    it('should get API status', async () => {
      const result = await client.getStatus();
      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
    }, 15000);
  });

  describe('Error Handling', () => {
    it('should throw BrasilApiClientError on 404', async () => {
      try {
        await client.getCepV2('00000000');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BrasilApiClientError);
        expect((error as BrasilApiClientError).statusCode).toBe(404);
      }
    }, 15000);
  });
});