import {
  BrasilApiClient,
  createBrasilApiClient,
  cep,
  cnpj,
  banks,
  ddd,
  holidays,
  cpf,
  status,
  BrasilApiClientError
} from './index';

// ============================================
// Example Usage
// ============================================

async function main() {
  // Create client instance
  const client = createBrasilApiClient({
    timeout: 15000,
  });

  console.log('🇧🇷 Brasil API Client - Examples\n');

  try {
    // 1. CEP Lookup
    console.log('--- CEP Lookup ---');
    const cepResult = await cep.v2('01310-100');
    console.log('CEP:', cepResult.cep);
    console.log('City:', cepResult.city);
    console.log('State:', cepResult.state);
    console.log('Neighborhood:', cepResult.neighborhood);
    console.log('Street:', cepResult.street);
    if (cepResult.location) {
      console.log('Coordinates:', cepResult.location.coordinates);
    }
    if (cepResult.timezoneName) {
      console.log('Timezone:', cepResult.timezoneName);
    }

    // 2. CNPJ Lookup
    console.log('\n--- CNPJ Lookup ---');
    const cnpjResult = await cnpj.get('00.000.000/0000-00'); // Example
    console.log('Company:', cnpjResult.razao_social);
    console.log('Fantasy Name:', cnpjResult.nome_fantasia);
    console.log('Status:', cnpjResult.situacao_cadastral);

    // 3. Banks List
    console.log('\n--- Banks List ---');
    const banksList = await banks.list();
    console.log(`Total banks: ${banksList.length}`);
    console.log('First 5:', banksList.slice(0, 5).map(b => `${b.code} - ${b.name}`).join(', '));

    // 4. DDD Lookup
    console.log('\n--- DDD Lookup ---');
    const dddResult = await ddd.get('11');
    console.log('DDD:', dddResult.ddd);
    console.log('State:', dddResult.state);
    console.log('Cities (first 5):', dddResult.cities.slice(0, 5).join(', '));

    // 5. Holidays
    console.log('\n--- Holidays 2024 ---');
    const holidaysList = await holidays.byYear(2024);
    console.log(`Total holidays: ${holidaysList.length}`);
    holidaysList.slice(0, 5).forEach(h => {
      console.log(`  ${h.date} - ${h.name} (${h.type})`);
    });

    // 6. CPF Validation
    console.log('\n--- CPF Validation ---');
    const cpfResult = await cpf.validate('123.456.789-00');
    console.log('Valid:', cpfResult.isValid ? '✅ Yes' : '❌ No');

    // 7. Status Check
    console.log('\n--- API Status ---');
    const apiStatus = await status.get();
    console.log('Status:', apiStatus.status);
    console.log('Timestamp:', apiStatus.timestamp ?? 'N/A');

  } catch (error) {
    if (error instanceof BrasilApiClientError) {
      console.error('\n❌ API Error:');
      console.error('  Message:', error.message);
      console.error('  Status Code:', error.statusCode);
      console.error('  Type:', error.type);
    } else {
      console.error('\n❌ Unexpected Error:', error);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main };