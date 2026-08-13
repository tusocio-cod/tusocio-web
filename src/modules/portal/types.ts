export type UserRole = 'cliente' | 'funcionario' | 'contador' | 'admin';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Cliente extends Usuario {
  cpf: string;
  telefone: string;
  empresasIds: string[];
}

export interface Empresa {
  id: string;
  clienteId: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  regimeTributario: 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real' | 'MEI';
  status: 'ativa' | 'inativa' | 'em_abertura';
}

export type ProcessoStatus = 'novo' | 'em_analise' | 'aguardando_cliente' | 'aguardando_pagamento' | 'em_execucao' | 'aguardando_orgao_externo' | 'concluido' | 'cancelado';

export interface Processo {
  id: string;
  protocolo?: string;
  clienteId: string;
  empresaId?: string;
  clienteNome?: string;
  empresaNome?: string;
  empresaCnpj?: string;
  tipo: 'Abertura de Empresa' | 'Alteração Contratual' | 'Regularização' | 'Baixa de Empresa' | 'Emissão de Nota Fiscal' | 'Imposto de Renda' | 'RNM' | 'CPF' | 'Marketplace' | 'Assessoria Imobiliária' | 'Contabilidade Mensal' | 'Outros';
  titulo: string;
  descricao?: string;
  status: ProcessoStatus;
  prioridade?: 'baixa' | 'normal' | 'alta' | 'urgente';
  responsavel?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  previsaoConclusao?: string;
  proximoPasso?: string;
  documentosIds?: string[];
  notasFiscaisIds?: string[];
  pagamentosIds?: string[];
  observacoesCliente?: string;
  observacoesInternas?: string;
  historico?: { data: string; acao: string; usuario?: string }[];
  progresso?: number; // 0 a 100
}

export type DocumentoStatus = 'pendente_envio' | 'enviado' | 'em_analise' | 'aprovado' | 'rejeitado' | 'precisa_reenviar' | 'vencido';

export interface Documento {
  id: string;
  clienteId: string;
  empresaId?: string;
  clienteNome?: string;
  empresaNome?: string;
  processoId?: string;
  processoNome?: string;
  notaFiscalId?: string;
  notaFiscalTitulo?: string;
  titulo: string; // ou nomeDocumento
  descricao?: string;
  tipo: 'Contrato Social' | 'Documento de Identidade' | 'Comprovante de Endereço' | 'Procuração' | 'Cartão CNPJ' | 'Certificado Digital' | 'Comprovante de Pagamento' | 'Documento do Tomador' | 'Documento de Marketplace' | 'Outros';
  status: DocumentoStatus;
  urlArquivo?: string;
  arquivoNome?: string;
  arquivoTipo?: string;
  arquivoTamanho?: string;
  obrigatorio?: boolean;
  prazo?: string;
  dataSolicitacao: string;
  dataEnvio?: string;
  atualizadoEm?: string;
  mensagem?: string;
  motivoRejeicao?: string;
  observacoesCliente?: string;
  observacoesInternas?: string;
  responsavel?: string;
  historico?: { data: string; acao: string; usuario?: string }[];
}

export type PagamentoStatus = 'pendente' | 'pago' | 'vencido' | 'em_analise' | 'cancelado' | 'reembolsado';

export interface Pagamento {
  id: string;
  clienteId: string;
  empresaId?: string;
  clienteNome?: string;
  empresaNome?: string;
  empresaCnpj?: string;
  titulo: string;
  descricao?: string;
  tipoCobranca: 'mensalidade_contabil' | 'servico_avulso' | 'abertura_empresa' | 'alteracao_contratual' | 'imposto_renda' | 'documentacao' | 'assessoria_imobiliaria' | 'treinamento_marketplace' | 'emissao_nota' | 'suporte_operacional' | 'outro';
  servicoRelacionado?: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: PagamentoStatus;
  metodoPagamento?: 'PIX' | 'Cartão de Crédito' | 'Boleto' | 'Transferência' | 'Dinheiro' | 'Outro';
  linkPagamento?: string;
  processoId?: string;
  processoTitulo?: string;
  notaFiscalId?: string;
  notaFiscalTitulo?: string;
  documentoId?: string;
  documentoTitulo?: string;
  comprovante?: {
    arquivoNome: string;
    arquivoTipo: string;
    arquivoTamanho: string;
    enviadoEm: string;
    statusAnalise?: string;
  };
  recibo?: {
    numero: string;
    emitidoEm: string;
    valor: number;
    descricao?: string;
    disponivel: boolean;
  };
  observacoesCliente?: string;
  observacoesInternas?: string;
  responsavel?: string;
  historico?: { data: string; acao: string; usuario?: string }[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export type SolicitacaoNotaStatus = 'rascunho' | 'aguardando_dados' | 'em_revisao' | 'aguardando_pagamento' | 'pronta_para_emissao' | 'emitida' | 'erro_emissao' | 'cancelada';

export interface NotaFiscalSolicitacao {
  id: string;
  clienteId: string;
  empresaId: string;
  clienteNome?: string;
  empresaNome?: string;
  empresaCnpj?: string;
  tipoNota: 'servico' | 'produto';
  canal: 'servico_direto' | 'shopee' | 'tiktok_shop' | 'shein' | 'mercado_livre' | 'loja_fisica' | 'outro';
  tomadorNome: string;
  tomadorDocumento: string;
  tomadorEmail: string;
  tomadorCidade: string;
  tomadorUf: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  dataCompetencia: string;
  status: SolicitacaoNotaStatus;
  proximoPasso?: string;
  observacoesCliente?: string;
  observacoesInternas?: string;
  anexos?: { id: string; nome: string; url: string }[];
  historico?: { data: string; acao: string; usuario?: string }[];
  responsavel?: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface MarketplaceLoja {
  id: string;
  empresaId: string;
  plataforma: 'Mercado Livre' | 'Shopee' | 'Amazon' | 'Magalu' | 'Outro';
  nomeLoja: string;
  statusIntegracao: 'conectado' | 'desconectado' | 'pendente';
}
