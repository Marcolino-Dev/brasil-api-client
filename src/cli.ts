#!/usr/bin/env node
import {
  createBrasilApiClient,
  BrasilApiClientError,
  CepData,
  CnpjData,
  BankData,
  DddData,
  HolidayData,
  FipeBrandData,
  FipeModelData,
  FipeYearData,
  FipePriceData,
  IbgeStateData,
  IbgeCityData,
  IsbnData,
  NcmData,
  CpfData,
  StatusData
} from './index';

const client = createBrasilApiClient();

interface Command {
  name: string;
  description: string;
  usage: string;
  handler: (args: string[]) => Promise<void>;
}

const commands: Command[] = [
  {
    name: 'cep',
    description: 'Busca CEP (v2 com geolocalização)',
    usage: 'cep <CEP>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('CEP é obrigatório');
      const result = await client.getCepV2(args[0]);
      printCep(result);
    }
  },
  {
    name: 'cep-v1',
    description: 'Busca CEP (v1 básico)',
    usage: 'cep-v1 <CEP>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('CEP é obrigatório');
      const result = await client.getCepV1(args[0]);
      printCep(result);
    }
  },
  {
    name: 'cep-v3',
    description: 'Busca CEP (v3 detalhado)',
    usage: 'cep-v3 <CEP>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('CEP é obrigatório');
      const result = await client.getCepV3(args[0]);
      printCep(result);
    }
  },
  {
    name: 'cnpj',
    description: 'Busca CNPJ',
    usage: 'cnpj <CNPJ>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('CNPJ é obrigatório');
      const result = await client.getCnpj(args[0]);
      printCnpj(result);
    }
  },
  {
    name: 'banks',
    description: 'Lista todos os bancos',
    usage: 'banks',
    handler: async () => {
      const result = await client.getBanks();
      console.log(`\n📋 Total de bancos: ${result.length}\n`);
      result.forEach(b => console.log(`  ${String(b.code ?? 'N/A').padStart(3)} - ${b.name} (${b.fullName})`));
    }
  },
  {
    name: 'bank',
    description: 'Busca banco por código',
    usage: 'bank <CÓDIGO>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('Código do banco é obrigatório');
      const result = await client.getBankByCode(parseInt(args[0], 10));
      printBank(result);
    }
  },
  {
    name: 'ddd',
    description: 'Busca DDD',
    usage: 'ddd <DDD>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('DDD é obrigatório');
      const result = await client.getDdd(args[0]);
      printDdd(result);
    }
  },
  {
    name: 'holidays',
    description: 'Lista feriados nacionais por ano',
    usage: 'holidays <ANO>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('Ano é obrigatório');
      const year = parseInt(args[0], 10);
      const result = await client.getHolidays(year);
      printHolidays(result, ' (Nacionais)');
    }
  },
  {
    name: 'fipe-brands',
    description: 'Lista marcas de veículos FIPE',
    usage: 'fipe-brands [carros|motos|caminhoes]',
    handler: async (args) => {
      const type = (args[0] as 'carros' | 'motos' | 'caminhoes') || 'carros';
      const result = await client.getFipeBrands(type);
      console.log(`\n🚗 Marcas de ${type}: ${result.length}\n`);
      result.slice(0, 20).forEach(b => console.log(`  ${b.valor} - ${b.nome}`));
      if (result.length > 20) console.log(`  ... e mais ${result.length - 20}`);
    }
  },
  {
    name: 'fipe-models',
    description: 'Lista modelos por marca FIPE',
    usage: 'fipe-models <carros|motos|caminhoes> <CÓDIGO_MARCA>',
    handler: async (args) => {
      if (args.length < 2) throw new Error('Tipo e código da marca são obrigatórios');
      const type = args[0] as 'carros' | 'motos' | 'caminhoes';
      const brandCode = args[1];
      const result = await client.getFipeModels(type, brandCode);
      console.log(`\n🚗 Modelos: ${result.length}\n`);
      result.slice(0, 20).forEach(m => console.log(`  ${m.valor} - ${m.modelo}`));
      if (result.length > 20) console.log(`  ... e mais ${result.length - 20}`);
    }
  },
  {
    name: 'fipe-years',
    description: 'Lista anos por modelo FIPE',
    usage: 'fipe-years <carros|motos|caminhoes> <CÓDIGO_MARCA> <CÓDIGO_MODELO>',
    handler: async (args) => {
      if (args.length < 3) throw new Error('Tipo, código da marca e código do modelo são obrigatórios');
      const type = args[0] as 'carros' | 'motos' | 'caminhoes';
      const brandCode = args[1];
      const modelCode = args[2];
      const result = await client.getFipeYears(type, brandCode, modelCode);
      console.log(`\n📅 Anos disponíveis: ${result.length}\n`);
      result.forEach(y => console.log(`  ${y.valor} - ${y.nome}`));
    }
  },
  {
    name: 'fipe-price',
    description: 'Busca preço FIPE pelo código FIPE',
    usage: 'fipe-price <CÓDIGO_FIPE>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('Código FIPE é obrigatório');
      const result = await client.getFipePrice(args[0]);
      printFipe(result);
    }
  },
  {
    name: 'ibge-states',
    description: 'Lista todos os estados (IBGE)',
    usage: 'ibge-states',
    handler: async () => {
      const result = await client.getIbgeStates();
      console.log(`\n🗺️  Estados: ${result.length}\n`);
      result.forEach(s => console.log(`  ${s.sigla} - ${s.nome} (${s.regiao.nome})`));
    }
  },
  {
    name: 'ibge-cities',
    description: 'Lista cidades por estado (IBGE)',
    usage: 'ibge-cities <UF>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('UF é obrigatória');
      const result = await client.getIbgeCitiesByState(args[0]);
      console.log(`\n🏙️  Cidades em ${args[0].toUpperCase()}: ${result.length}\n`);
      result.slice(0, 30).forEach(c => console.log(`  ${c.codigo_ibge} - ${c.nome}`));
      if (result.length > 30) console.log(`  ... e mais ${result.length - 30}`);
    }
  },
  {
    name: 'isbn',
    description: 'Busca livro por ISBN',
    usage: 'isbn <ISBN>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('ISBN é obrigatório');
      const result = await client.getIsbn(args[0]);
      printIsbn(result);
    }
  },
  {
    name: 'ncm',
    description: 'Busca NCM',
    usage: 'ncm <CÓDIGO_NCM>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('Código NCM é obrigatório');
      const result = await client.getNcm(args[0]);
      printNcm(result);
    }
  },
  {
    name: 'cpf',
    description: 'Valida CPF',
    usage: 'cpf <CPF>',
    handler: async (args) => {
      if (args.length < 1) throw new Error('CPF é obrigatório');
      const result = await client.validateCpf(args[0]);
      printCpf(result);
    }
  },
  {
    name: 'status',
    description: 'Verifica status da API',
    usage: 'status',
    handler: async () => {
      const result = await client.getStatus();
      console.log('\n📡 Status da API:');
      console.log(`  Status: ${result.status}`);
      console.log(`  Timestamp: ${result.timestamp ?? 'N/A'}`);
    }
  },
  {
    name: 'help',
    description: 'Mostra esta ajuda',
    usage: 'help [COMANDO]',
    handler: async (args) => {
      if (args.length > 0) {
        const cmd = commands.find(c => c.name === args[0]);
        if (cmd) {
          console.log(`\n${cmd.name} - ${cmd.description}`);
          console.log(`Uso: ${cmd.usage}\n`);
        } else {
          console.log(`Comando "${args[0]}" não encontrado.`);
        }
      } else {
        printHelp();
      }
    }
  }
];

function printHelp() {
  console.log('\n🇧🇷 Brasil API CLI - Comandos Disponíveis\n');
  console.log('Uso: npx ts-node src/cli.ts <comando> [argumentos]\n');
  commands.forEach(cmd => {
    console.log(`  ${cmd.name.padEnd(15)} - ${cmd.description}`);
    console.log(`  ${' '.repeat(15)}   Uso: ${cmd.usage}\n`);
  });
}

function printCep(data: CepData) {
  console.log('\n📍 CEP Encontrado:');
  console.log(`  CEP: ${data.cep}`);
  console.log(`  Logradouro: ${data.street || 'N/A'}`);
  console.log(`  Bairro: ${data.neighborhood || 'N/A'}`);
  console.log(`  Cidade: ${data.city}`);
  console.log(`  Estado: ${data.state}`);
  console.log(`  Serviço: ${data.service}`);
  if (data.location) {
    console.log(`  Coordenadas: ${data.location.coordinates[1]}, ${data.location.coordinates[0]}`);
  }
  if (data.timezoneName) {
    console.log(`  Timezone: ${data.timezoneName}`);
  }
}

function printCnpj(data: CnpjData) {
  console.log('\n🏢 CNPJ Encontrado:');
  console.log(`  CNPJ: ${data.cnpj}`);
  console.log(`  Razão Social: ${data.razao_social}`);
  console.log(`  Nome Fantasia: ${data.nome_fantasia || 'N/A'}`);
  console.log(`  CNAE: ${data.cnae_fiscal} - ${data.cnae_fiscal_descricao}`);
  console.log(`  Endereço: ${data.logradouro}, ${data.numero} ${data.complemento ? `- ${data.complemento}` : ''}`);
  console.log(`  Bairro: ${data.bairro}`);
  console.log(`  CEP: ${data.cep}`);
  console.log(`  Cidade/UF: ${data.municipio}/${data.uf}`);
  console.log(`  Abertura: ${data.abertura}`);
  console.log(`  Situação: ${data.situacao_cadastral} (${data.data_situacao_cadastral})`);
  console.log(`  Natureza Jurídica: ${data.natureza_juridica}`);
  console.log(`  Capital Social: R$ ${data.capital_social.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  if (data.qsa.length > 0) {
    console.log(`  Sócios (${data.qsa.length}):`);
    data.qsa.slice(0, 5).forEach(s => console.log(`    - ${s.nome} (${s.qual_socio})`));
    if (data.qsa.length > 5) console.log(`    ... e mais ${data.qsa.length - 5}`);
  }
}

function printBank(data: BankData) {
  console.log('\n🏦 Banco Encontrado:');
  console.log(`  ISPB: ${data.ispb}`);
  console.log(`  Código: ${data.code ?? 'N/A'}`);
  console.log(`  Nome: ${data.name}`);
  console.log(`  Nome Completo: ${data.fullName}`);
}

function printDdd(data: DddData) {
  console.log('\n📞 DDD Encontrado:');
  console.log(`  DDD: ${data.ddd}`);
  console.log(`  Estado: ${data.state}`);
  console.log(`  Cidades (${data.cities.length}):`);
  data.cities.slice(0, 20).forEach(c => console.log(`    - ${c}`));
  if (data.cities.length > 20) console.log(`    ... e mais ${data.cities.length - 20}`);
}

function printHolidays(data: HolidayData[], label: string) {
  console.log(`\n📅 Feriados${label}: ${data.length}\n`);
  data.forEach(h => console.log(`  ${h.date} - ${h.name} (${h.type}, ${h.level})`));
}

function printFipe(data: FipePriceData) {
  console.log('\n💰 Preço FIPE:');
  console.log(`  Código FIPE: ${data.codigoFipe}`);
  console.log(`  Marca: ${data.marca}`);
  console.log(`  Modelo: ${data.modelo}`);
  console.log(`  Ano: ${data.anoModelo}`);
  console.log(`  Combustível: ${data.combustivel}`);
  console.log(`  Valor: ${data.valor}`);
  console.log(`  Referência: ${data.mesReferencia}`);
  console.log(`  Consulta: ${data.dataConsulta}`);
}

function printIsbn(data: IsbnData) {
  console.log('\n📚 Livro Encontrado:');
  console.log(`  ISBN: ${data.isbn}`);
  console.log(`  Título: ${data.titulo}`);
  console.log(`  Autores: ${data.autores.join(', ')}`);
  console.log(`  Editora: ${data.editora}`);
  console.log(`  Páginas: ${data.numeroPaginas}`);
  console.log(`  Ano: ${data.anoPublicacao}`);
  console.log(`  Idioma: ${data.idioma}`);
  console.log(`  Peso: ${data.peso}g`);
  console.log(`  Dimensões: ${data.dimensoes.altura}x${data.dimensoes.largura}x${data.dimensoes.profundidade}cm`);
}

function printNcm(data: NcmData) {
  console.log('\n📦 NCM Encontrado:');
  console.log(`  Código: ${data.codigo}`);
  console.log(`  Descrição: ${data.descricao}`);
  console.log(`  Início Vigência: ${data.data_inicio}`);
  console.log(`  Fim Vigência: ${data.data_fim}`);
  console.log(`  Tipo Ato: ${data.tipo_ato}`);
  console.log(`  Número Ato: ${data.numero_ato}`);
  console.log(`  Ano Ato: ${data.ano_ato}`);
}

function printCpf(data: CpfData) {
  console.log('\n🆔 CPF Validado:');
  console.log(`  Válido: ${data.isValid ? '✅ Sim' : '❌ Não'}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const commandName = args[0];
  const commandArgs = args.slice(1);

  const command = commands.find(c => c.name === commandName);

  if (!command) {
    console.error(`\n❌ Comando "${commandName}" não encontrado.`);
    console.log('Use "help" para ver comandos disponíveis.');
    process.exit(1);
  }

  try {
    await command.handler(commandArgs);
  } catch (error) {
    if (error instanceof BrasilApiClientError) {
      console.error('\n❌ Erro da API:');
      console.error(`  ${error.message}`);
      console.error(`  Código: ${error.statusCode}`);
      console.error(`  Tipo: ${error.type}`);
    } else if (error instanceof Error) {
      console.error('\n❌ Erro:', error.message);
    } else {
      console.error('\n❌ Erro desconhecido:', error);
    }
    process.exit(1);
  }
}

main();