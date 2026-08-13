import { Cliente, Empresa, Processo, Documento, Pagamento, NotaFiscalSolicitacao, MarketplaceLoja } from './types';

export const mockCliente: Cliente = {
  id: 'cli_001',
  nome: 'Juan Pérez',
  email: 'juan.perez@example.com',
  role: 'cliente',
  cpf: '123.456.789-00',
  telefone: '+55 11 98765-4321',
  empresasIds: ['emp_001'],
  avatarUrl: 'https://i.pravatar.cc/150?u=cli_001',
};

export const mockEmpresa: Empresa = {
  id: 'emp_001',
  clienteId: 'cli_001',
  cnpj: '00.000.000/0001-00',
  razaoSocial: 'Juan Pérez Importados LTDA',
  nomeFantasia: 'JP Imports',
  regimeTributario: 'Simples Nacional',
  status: 'ativa',
};

export const mockProcessos: Processo[] = [
  {
    id: 'proc_001',
    protocolo: 'PRC-2026-05A1',
    clienteId: 'cli_001',
    empresaId: 'emp_001',
    clienteNome: 'Juan Pérez',
    empresaNome: 'JP Imports',
    empresaCnpj: '00.000.000/0001-00',
    titulo: 'Abertura de Empresa',
    descricao: 'Proceso completo de apertura de empresa LTDA para venta de importados.',
    tipo: 'Abertura de Empresa',
    status: 'aguardando_orgao_externo',
    prioridade: 'alta',
    responsavel: 'Maria (Contabilidade)',
    dataCriacao: '2026-05-10T10:00:00Z',
    dataAtualizacao: '2026-05-28T14:30:00Z',
    previsaoConclusao: '2026-06-15T00:00:00Z',
    proximoPasso: 'Aguardando la emisión del CNPJ por la Receita Federal.',
    documentosIds: ['doc_001', 'doc_002', 'doc_003'],
    historico: [
      { data: '2026-05-10T10:00:00Z', acao: 'Proceso iniciado', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-15T09:00:00Z', acao: 'Documentos solicitados', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-17T10:00:00Z', acao: 'Documentos aprobados', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-28T14:30:00Z', acao: 'Solicitud enviada a la Receita Federal', usuario: 'Maria (Contabilidade)' }
    ],
    progresso: 75,
  },
  {
    id: 'proc_002',
    protocolo: 'PRC-2026-05B2',
    clienteId: 'cli_001',
    empresaId: 'emp_001',
    clienteNome: 'Juan Pérez',
    empresaNome: 'JP Imports',
    titulo: 'Alteración Contractual',
    descricao: 'Actualización de dirección en el contrato social de la empresa.',
    tipo: 'Alteração Contratual',
    status: 'aguardando_cliente',
    prioridade: 'normal',
    responsavel: 'Carlos (Legal)',
    dataCriacao: '2026-05-25T09:00:00Z',
    dataAtualizacao: '2026-05-29T11:00:00Z',
    proximoPasso: 'Necesitamos que firmes el nuevo contrato y lo envíes.',
    historico: [
      { data: '2026-05-25T09:00:00Z', acao: 'Proceso iniciado a pedido del cliente', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-29T11:00:00Z', acao: 'Nuevo contrato generado y aguardando firma', usuario: 'Carlos (Legal)' }
    ],
    progresso: 30,
  },
  {
    id: 'proc_003',
    protocolo: 'PRC-2026-05C3',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    titulo: 'Emisión de Documento RNM',
    descricao: 'Solicitud y regularización del Registro Nacional Migratorio.',
    tipo: 'RNM',
    status: 'em_analise',
    prioridade: 'urgente',
    responsavel: 'Ana (Migração)',
    dataCriacao: '2026-05-20T10:00:00Z',
    dataAtualizacao: '2026-05-25T15:20:00Z',
    proximoPasso: 'Nuestro equipo está analizando tu comprobante de dirección.',
    documentosIds: ['doc_004'],
    pagamentosIds: ['pag_002'],
    historico: [
      { data: '2026-05-20T10:00:00Z', acao: 'Proceso iniciado', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-25T15:20:00Z', acao: 'Documento recibido y en análisis', usuario: 'Ana (Migração)' }
    ],
    progresso: 50,
  },
  {
    id: 'proc_004',
    protocolo: 'PRC-2026-05D4',
    clienteId: 'cli_001',
    empresaId: 'emp_001',
    clienteNome: 'Juan Pérez',
    empresaNome: 'JP Imports',
    titulo: 'Emisión de Nota Fiscal (Servicio)',
    descricao: 'Asistencia para la emisión de la nota fiscal de servicios de consultoría.',
    tipo: 'Emissão de Nota Fiscal',
    status: 'concluido',
    prioridade: 'normal',
    dataCriacao: '2026-05-29T16:00:00Z',
    dataAtualizacao: '2026-05-30T10:00:00Z',
    notasFiscaisIds: ['nf_001'],
    historico: [
      { data: '2026-05-29T16:00:00Z', acao: 'Solicitud de emisión recibida', usuario: 'Juan Pérez' },
      { data: '2026-05-30T10:00:00Z', acao: 'Nota emitida y enviada al cliente', usuario: 'Equipo Tu Socio' }
    ],
    progresso: 100,
  },
  {
    id: 'proc_005',
    protocolo: 'PRC-2026-05E5',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    titulo: 'Declaración de Impuesto de Renta',
    descricao: 'Preparación y envío de la declaración anual de impuesto de renta para persona física.',
    tipo: 'Imposto de Renda',
    status: 'aguardando_pagamento',
    prioridade: 'alta',
    responsavel: 'Roberto (Financeiro)',
    dataCriacao: '2026-04-15T09:00:00Z',
    dataAtualizacao: '2026-05-01T14:00:00Z',
    proximoPasso: 'Aguardando confirmación de pago de la tarifa de servicio.',
    pagamentosIds: ['pag_001'],
    historico: [
      { data: '2026-04-15T09:00:00Z', acao: 'Proceso iniciado', usuario: 'Equipo Tu Socio' },
      { data: '2026-04-20T10:00:00Z', acao: 'Documentación analizada', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-01T14:00:00Z', acao: 'Declaración lista, aguardando pago', usuario: 'Roberto (Financeiro)' }
    ],
    progresso: 90,
  },
  {
    id: 'proc_006',
    protocolo: 'PRC-2026-05F6',
    clienteId: 'cli_001',
    empresaId: 'emp_001',
    clienteNome: 'Juan Pérez',
    empresaNome: 'JP Imports',
    titulo: 'Integración Shopee',
    descricao: 'Configuración y sincronización de la tienda en el marketplace Shopee.',
    tipo: 'Marketplace',
    status: 'novo',
    prioridade: 'normal',
    responsavel: 'Lucas (Tech)',
    dataCriacao: '2026-05-30T09:00:00Z',
    proximoPasso: 'Iniciaremos la configuración en breve.',
    historico: [
      { data: '2026-05-30T09:00:00Z', acao: 'Proceso creado', usuario: 'Juan Pérez' }
    ],
    progresso: 0,
  }
];

export const mockDocumentos: Documento[] = [
  {
    id: 'doc_001',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    empresaId: 'emp_001',
    empresaNome: 'JP Imports',
    titulo: 'Documento de Identidade (RNM)',
    descricao: 'Por favor, envíe una copia legible de su RNM (frente y reverso).',
    tipo: 'Documento de Identidade',
    status: 'pendente_envio',
    obrigatorio: true,
    dataSolicitacao: '2026-05-20T10:00:00Z',
    historico: [
      { data: '2026-05-20T10:00:00Z', acao: 'Documento solicitado', usuario: 'Equipo Tu Socio' }
    ]
  },
  {
    id: 'doc_002',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    empresaId: 'emp_001',
    empresaNome: 'JP Imports',
    titulo: 'Comprovante de Endereço',
    descricao: 'Cuenta de luz, agua o internet a su nombre, con máximo 3 meses de antigüedad.',
    tipo: 'Comprovante de Endereço',
    status: 'em_analise',
    obrigatorio: true,
    dataSolicitacao: '2026-05-20T10:00:00Z',
    dataEnvio: '2026-05-25T15:20:00Z',
    arquivoNome: 'comprovante_endereco_sp.pdf',
    arquivoTamanho: '1.2 MB',
    historico: [
      { data: '2026-05-20T10:00:00Z', acao: 'Documento solicitado', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-25T15:20:00Z', acao: 'Documento enviado para revisión', usuario: 'Juan Pérez' }
    ]
  },
  {
    id: 'doc_003',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    empresaId: 'emp_001',
    empresaNome: 'JP Imports',
    titulo: 'Contrato Social Registrado',
    tipo: 'Contrato Social',
    status: 'aprovado',
    processoId: 'proc_001',
    processoNome: 'Abertura de Empresa',
    obrigatorio: true,
    dataSolicitacao: '2026-05-15T09:00:00Z',
    dataEnvio: '2026-05-16T14:00:00Z',
    atualizadoEm: '2026-05-17T10:00:00Z',
    arquivoNome: 'contrato_social_assinado.pdf',
    historico: [
      { data: '2026-05-15T09:00:00Z', acao: 'Documento solicitado', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-16T14:00:00Z', acao: 'Documento enviado', usuario: 'Juan Pérez' },
      { data: '2026-05-17T10:00:00Z', acao: 'Documento aprobado', usuario: 'Equipo Tu Socio' }
    ]
  },
  {
    id: 'doc_004',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    empresaId: 'emp_001',
    empresaNome: 'JP Imports',
    titulo: 'Selfie con Documento',
    descricao: 'Selfie sosteniendo su RNM cerca del rostro.',
    tipo: 'Documento de Identidade',
    status: 'rejeitado',
    obrigatorio: true,
    dataSolicitacao: '2026-05-20T10:00:00Z',
    dataEnvio: '2026-05-22T11:00:00Z',
    atualizadoEm: '2026-05-23T09:00:00Z',
    motivoRejeicao: 'La imagen está borrosa y no es posible leer los datos del documento.',
    arquivoNome: 'selfie_borrosa.jpg',
    historico: [
      { data: '2026-05-20T10:00:00Z', acao: 'Documento solicitado', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-22T11:00:00Z', acao: 'Documento enviado', usuario: 'Juan Pérez' },
      { data: '2026-05-23T09:00:00Z', acao: 'Documento rechazado', usuario: 'Equipo Tu Socio' }
    ]
  }
];

export const mockPagamentos: Pagamento[] = [
  {
    id: 'pag_001',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    empresaId: 'emp_001',
    empresaNome: 'JP Imports',
    titulo: 'Mensalidade Contabilidade - Maio',
    descricao: 'Honorarios contables referentes al mes de mayo.',
    tipoCobranca: 'mensalidade_contabil',
    servicoRelacionado: 'Contabilidade Mensal',
    valor: 250.00,
    dataVencimento: '2026-05-05T23:59:59Z',
    dataPagamento: '2026-05-04T10:00:00Z',
    status: 'pago',
    metodoPagamento: 'PIX',
    recibo: {
      numero: 'REC-2026-05-001',
      emitidoEm: '2026-05-04T10:05:00Z',
      valor: 250.00,
      disponivel: true
    },
    historico: [
      { data: '2026-05-01T09:00:00Z', acao: 'Cobrança gerada', usuario: 'Sistema' },
      { data: '2026-05-04T10:00:00Z', acao: 'Pagamento confirmado', usuario: 'Sistema' }
    ],
    criadoEm: '2026-05-01T09:00:00Z'
  },
  {
    id: 'pag_002',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    titulo: 'Emissão de Documento RNM',
    descricao: 'Tasa administrativa para regularización del Registro Nacional Migratorio.',
    tipoCobranca: 'servico_avulso',
    servicoRelacionado: 'Regularização',
    processoId: 'proc_003',
    processoTitulo: 'Emissão de Documento RNM',
    valor: 150.00,
    dataVencimento: '2026-05-25T23:59:59Z',
    status: 'em_analise',
    metodoPagamento: 'PIX',
    comprovante: {
      arquivoNome: 'comprobante_pix_rnm.jpg',
      arquivoTipo: 'image/jpeg',
      arquivoTamanho: '850 KB',
      enviadoEm: '2026-05-24T14:30:00Z',
      statusAnalise: 'em_analise'
    },
    historico: [
      { data: '2026-05-20T10:00:00Z', acao: 'Cobrança gerada', usuario: 'Ana (Migração)' },
      { data: '2026-05-24T14:30:00Z', acao: 'Comprovante enviado para revisão', usuario: 'Juan Pérez' }
    ],
    criadoEm: '2026-05-20T10:00:00Z',
    atualizadoEm: '2026-05-24T14:30:00Z'
  },
  {
    id: 'pag_003',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    empresaId: 'emp_001',
    empresaNome: 'JP Imports',
    titulo: 'Apertura de Empresa (Taxa Única)',
    descricao: 'Pago único por la apertura de la empresa LTDA.',
    tipoCobranca: 'abertura_empresa',
    servicoRelacionado: 'Abertura de Empresa',
    processoId: 'proc_001',
    processoTitulo: 'Abertura de Empresa',
    valor: 800.00,
    dataVencimento: '2026-05-15T23:59:59Z',
    dataPagamento: '2026-05-12T11:00:00Z',
    status: 'pago',
    metodoPagamento: 'Cartão de Crédito',
    recibo: {
      numero: 'REC-2026-05-003',
      emitidoEm: '2026-05-12T11:05:00Z',
      valor: 800.00,
      disponivel: true
    },
    historico: [
      { data: '2026-05-10T10:00:00Z', acao: 'Cobrança gerada', usuario: 'Sistema' },
      { data: '2026-05-12T11:00:00Z', acao: 'Pagamento confirmado', usuario: 'Sistema' }
    ],
    criadoEm: '2026-05-10T10:00:00Z'
  },
  {
    id: 'pag_004',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    titulo: 'Servicio de Documentación',
    descricao: 'Honorarios por servicio de traducción y apostillado.',
    tipoCobranca: 'documentacao',
    servicoRelacionado: 'Tradução',
    valor: 120.00,
    dataVencimento: '2026-05-28T23:59:59Z',
    status: 'vencido',
    historico: [
      { data: '2026-05-20T09:00:00Z', acao: 'Cobrança gerada', usuario: 'Equipo Tu Socio' }
    ],
    criadoEm: '2026-05-20T09:00:00Z',
    observacoesInternas: 'Cliente solicitou prazo extra, aguardando pagamento.'
  },
  {
    id: 'pag_005',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    empresaId: 'emp_001',
    empresaNome: 'JP Imports',
    titulo: 'Alteración Contractual',
    descricao: 'Tasa para actualización de dirección.',
    tipoCobranca: 'alteracao_contratual',
    servicoRelacionado: 'Alteração Contratual',
    processoId: 'proc_002',
    processoTitulo: 'Alteración Contractual',
    valor: 350.00,
    dataVencimento: '2026-06-10T23:59:59Z',
    status: 'pendente',
    metodoPagamento: 'PIX',
    linkPagamento: 'https://pix.example.com/pay/78910',
    historico: [
      { data: '2026-05-25T09:00:00Z', acao: 'Cobrança gerada', usuario: 'Carlos (Legal)' }
    ],
    criadoEm: '2026-05-25T09:00:00Z'
  },
  {
    id: 'pag_006',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    titulo: 'Declaración de Impuesto de Renta',
    descricao: 'Servicio de preparación y envío de IRPF 2026.',
    tipoCobranca: 'imposto_renda',
    servicoRelacionado: 'Imposto de Renda',
    processoId: 'proc_005',
    processoTitulo: 'Declaración de Impuesto de Renta',
    valor: 200.00,
    dataVencimento: '2026-05-15T23:59:59Z',
    dataPagamento: '2026-05-10T14:20:00Z',
    status: 'pago',
    metodoPagamento: 'PIX',
    recibo: {
      numero: 'REC-2026-05-006',
      emitidoEm: '2026-05-10T14:25:00Z',
      valor: 200.00,
      disponivel: true
    },
    historico: [
      { data: '2026-05-01T14:00:00Z', acao: 'Cobrança gerada', usuario: 'Roberto (Financeiro)' },
      { data: '2026-05-10T14:20:00Z', acao: 'Pagamento confirmado', usuario: 'Sistema' }
    ],
    criadoEm: '2026-05-01T14:00:00Z'
  },
  {
    id: 'pag_007',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    empresaId: 'emp_001',
    empresaNome: 'JP Imports',
    titulo: 'Entrenamiento Marketplace',
    descricao: 'Curso y consultoría para ventas en Shopee.',
    tipoCobranca: 'treinamento_marketplace',
    servicoRelacionado: 'Consultoria Marketplace',
    processoId: 'proc_006',
    processoTitulo: 'Integración Shopee',
    valor: 450.00,
    dataVencimento: '2026-06-15T23:59:59Z',
    status: 'pendente',
    metodoPagamento: 'Boleto',
    linkPagamento: 'https://boleto.example.com/pay/111222',
    historico: [
      { data: '2026-05-30T09:00:00Z', acao: 'Cobrança gerada', usuario: 'Lucas (Tech)' }
    ],
    criadoEm: '2026-05-30T09:00:00Z'
  },
  {
    id: 'pag_008',
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez',
    empresaId: 'emp_001',
    empresaNome: 'JP Imports',
    titulo: 'Tasa de Emisión de Factura Especial',
    descricao: 'Tasa por emisión de nota fiscal con retención de impuestos.',
    tipoCobranca: 'emissao_nota',
    servicoRelacionado: 'Emissão de Nota Fiscal',
    notaFiscalId: 'nf_001',
    notaFiscalTitulo: 'Serviços de consultoria em vendas',
    valor: 50.00,
    dataVencimento: '2026-05-20T23:59:59Z',
    status: 'cancelado',
    historico: [
      { data: '2026-05-15T10:00:00Z', acao: 'Cobrança gerada', usuario: 'Equipo Tu Socio' },
      { data: '2026-05-18T09:00:00Z', acao: 'Cobrança cancelada por motivo operacional', usuario: 'Equipo Tu Socio' }
    ],
    criadoEm: '2026-05-15T10:00:00Z',
    observacoesInternas: 'Cancelado pois o serviço estava coberto no plano mensal.'
  }
];

export const mockNotasFiscais: NotaFiscalSolicitacao[] = [
  {
    id: 'nf_001',
    clienteId: 'cli_001',
    empresaId: 'emp_001',
    clienteNome: 'Juan Pérez',
    empresaNome: 'JP Imports',
    tipoNota: 'servico',
    canal: 'servico_direto',
    tomadorNome: 'Cliente Final Silva',
    tomadorDocumento: '111.222.333-44',
    tomadorEmail: 'cliente@exemplo.com',
    tomadorCidade: 'São Paulo',
    tomadorUf: 'SP',
    descricao: 'Serviços de consultoria em vendas',
    quantidade: 1,
    valorUnitario: 1500.00,
    valorTotal: 1500.00,
    dataCompetencia: '2026-05-29',
    status: 'em_revisao',
    criadoEm: '2026-05-29T16:00:00Z',
    historico: [
      { data: '2026-05-29T16:00:00Z', acao: 'Solicitud enviada para revisión', usuario: 'Juan Pérez' }
    ]
  },
  {
    id: 'nf_002',
    clienteId: 'cli_001',
    empresaId: 'emp_001',
    clienteNome: 'Juan Pérez',
    empresaNome: 'JP Imports',
    tipoNota: 'produto',
    canal: 'shopee',
    tomadorNome: 'Maria Souza',
    tomadorDocumento: '999.888.777-66',
    tomadorEmail: 'maria@exemplo.com',
    tomadorCidade: 'Rio de Janeiro',
    tomadorUf: 'RJ',
    descricao: 'Venda de Eletrônicos (Pedido SHP-123)',
    quantidade: 2,
    valorUnitario: 150.00,
    valorTotal: 300.00,
    dataCompetencia: '2026-05-25',
    status: 'emitida',
    criadoEm: '2026-05-25T10:00:00Z',
    atualizadoEm: '2026-05-26T11:00:00Z',
    historico: [
      { data: '2026-05-25T10:00:00Z', acao: 'Solicitud enviada para revisión', usuario: 'Juan Pérez' },
      { data: '2026-05-26T11:00:00Z', acao: 'Nota emitida correctamente', usuario: 'Equipo Tu Socio' }
    ]
  }
];

export const mockLojas: MarketplaceLoja[] = [
  {
    id: 'loja_001',
    empresaId: 'emp_001',
    plataforma: 'Mercado Livre',
    nomeLoja: 'JP Imports Oficial',
    statusIntegracao: 'conectado',
  },
  {
    id: 'loja_002',
    empresaId: 'emp_001',
    plataforma: 'Shopee',
    nomeLoja: 'JP Imports Brasil',
    statusIntegracao: 'pendente',
  }
];
