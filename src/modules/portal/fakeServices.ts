/**
 * TODO: BACKEND MIGRATION
 * 
 * Este arquivo contém serviços simulados (mock) para a Fase 1 (MVP Front-end).
 * Para as próximas etapas (Backend real), considere as seguintes implementações:
 * 
 * 1. Autenticação e Segurança:
 *    - Substituir validações de string por tokens JWT.
 *    - Implementar verificação de permissões (Roles: Admin, Funcionario, Cliente).
 *    - Adicionar logs de auditoria para cada ação crítica (quem aprovou o pagamento, quem rejeitou o documento).
 * 
 * 2. Storage Seguro:
 *    - Os uploads de arquivos (comprovantes, documentos) devem usar um bucket seguro (S3, Cloud Storage, ou Supabase Storage).
 *    - Implementar links assinados (Signed URLs) para leitura de documentos restritos e respeitar a LGPD.
 * 
 * 3. Gateway de Pagamentos:
 *    - Substituir as atualizações de status "mock" por Webhooks com Idempotência (ex: Asaas, Stripe, Mercado Pago).
 *    - Nunca salvar dados sensíveis de cartão no banco próprio.
 * 
 * 4. Banco de Dados e APIs:
 *    - Criar camadas de Repositories e Services.
 *    - Substituir a manipulação de array (`mockPagamentos.push`) por transações seguras no PostgreSQL (ex: via Prisma ou Drizzle).
 *    - Usar UUIDs reais ao invés de IDs gerados com Math.random().
 */
import {
  mockCliente,
  mockEmpresa,
  mockProcessos,
  mockDocumentos,
  mockPagamentos,
  mockNotasFiscais,
  mockLojas
} from './mockData';

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPortalDashboard() {
  await delay(800);
  
  // No futuro, isso buscará os dados agregados para o dashboard do cliente
  return {
    cliente: mockCliente,
    empresa: mockEmpresa,
    processosAtivos: mockProcessos.filter(p => !['concluido', 'cancelado'].includes(p.status)),
    documentosPendentes: mockDocumentos.filter(d => ['pendente_envio', 'precisa_reenviar'].includes(d.status)),
    pagamentosPendentes: mockPagamentos.filter(p => ['pendente', 'vencido'].includes(p.status)),
    proximaAcao: mockDocumentos.find(d => d.status === 'pendente_envio') 
      ? { tipo: 'documento', mensagem: 'Necesitamos este documento para continuar', item: mockDocumentos.find(d => d.status === 'pendente_envio') }
      : mockPagamentos.find(p => p.status === 'pendente')
      ? { tipo: 'pagamento', mensagem: 'Tu pago está pendiente', item: mockPagamentos.find(p => p.status === 'pendente') }
      : null
  };
}

export async function getAdminOverview() {
  await delay(800);
  
  return {
    solicitacoesNovas: mockNotasFiscais.filter(s => s.status === 'rascunho' || s.status === 'aguardando_dados'),
    notasEmRevisao: mockNotasFiscais.filter(s => s.status === 'em_revisao'),
    documentosPendentesAnalise: mockDocumentos.filter(d => d.status === 'enviado'),
    pagamentosPendentes: mockPagamentos.filter(p => p.status === 'pendente' || p.status === 'vencido'),
    processosEmAndamento: mockProcessos.filter(p => p.status === 'em_execucao' || p.status === 'em_analise'),
  };
}

export async function getClienteProcessos(clienteId: string) {
  await delay(500);
  return mockProcessos.filter(p => p.clienteId === clienteId).sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
}

export async function getClienteProcessoById(id: string) {
  await delay(500);
  return mockProcessos.find(p => p.id === id);
}

export async function getProcessoDocumentos(id: string) {
  await delay(300);
  const processo = mockProcessos.find(p => p.id === id);
  if (!processo || !processo.documentosIds) return [];
  return mockDocumentos.filter(d => processo.documentosIds.includes(d.id));
}

export async function getProcessoNotas(id: string) {
  await delay(300);
  const processo = mockProcessos.find(p => p.id === id);
  if (!processo || !processo.notasFiscaisIds) return [];
  return mockNotasFiscais.filter(n => processo.notasFiscaisIds.includes(n.id));
}

export async function getProcessoPagamentos(id: string) {
  await delay(300);
  const processo = mockProcessos.find(p => p.id === id);
  if (!processo || !processo.pagamentosIds) return [];
  return mockPagamentos.filter(pag => processo.pagamentosIds.includes(pag.id));
}

export async function getClienteDocumentos(clienteId: string) {
  await delay(500);
  return mockDocumentos.filter(d => d.clienteId === clienteId).sort((a, b) => new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime());
}

export async function getClienteDocumentoById(id: string) {
  await delay(500);
  return mockDocumentos.find(d => d.id === id);
}

export async function mockUploadDocumento(id: string, fileData: any, isReenvio: boolean = false) {
  await delay(1500); // Simulando upload demorado
  const doc = mockDocumentos.find(d => d.id === id);
  if (doc) {
    doc.status = 'em_analise';
    doc.dataEnvio = new Date().toISOString();
    doc.atualizadoEm = new Date().toISOString();
    doc.arquivoNome = fileData.name || 'documento_enviado.pdf';
    doc.arquivoTamanho = fileData.size || '2.5 MB';
    if (!doc.historico) doc.historico = [];
    doc.historico.push({
      data: new Date().toISOString(),
      acao: isReenvio ? 'Documento reenviado para revisión' : 'Documento enviado para revisión',
      usuario: doc.clienteNome || 'Cliente'
    });
    return doc;
  }
  throw new Error('Documento não encontrado');
}

export async function getClientePagamentos(clienteId: string) {
  await delay(500);
  return mockPagamentos.filter(p => p.clienteId === clienteId).sort((a, b) => new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime());
}

export async function getClientePagamentoById(id: string) {
  await delay(500);
  return mockPagamentos.find(p => p.id === id);
}

export async function mockEnviarComprovantePagamento(id: string, fileData: any) {
  await delay(1500); // Simulando upload
  const pag = mockPagamentos.find(p => p.id === id);
  if (pag) {
    pag.status = 'em_analise';
    pag.atualizadoEm = new Date().toISOString();
    pag.comprovante = {
      arquivoNome: fileData.name || 'comprobante_pago.pdf',
      arquivoTipo: fileData.type || 'application/pdf',
      arquivoTamanho: fileData.size || '1.5 MB',
      enviadoEm: new Date().toISOString(),
      statusAnalise: 'em_analise'
    };
    if (!pag.historico) pag.historico = [];
    pag.historico.push({
      data: new Date().toISOString(),
      acao: 'Comprobante enviado para revisión',
      usuario: pag.clienteNome || 'Cliente'
    });
    return pag;
  }
  throw new Error('Pagamento não encontrado');
}

export async function getSolicitacoesNota() {
  await delay(500);
  return [...mockNotasFiscais];
}

// Novos métodos para Nota Fiscal
export async function getClienteNotas(clienteId: string) {
  await delay(500);
  return mockNotasFiscais.filter(n => n.clienteId === clienteId).sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

export async function getNotaFiscalById(id: string) {
  await delay(500);
  return mockNotasFiscais.find(n => n.id === id);
}

export async function createNotaFiscalSolicitacao(data: any) {
  await delay(800);
  const novaNota = {
    ...data,
    id: `nf_${Math.floor(Math.random() * 10000)}`,
    status: 'em_revisao',
    criadoEm: new Date().toISOString(),
    historico: [
      { data: new Date().toISOString(), acao: 'Solicitud enviada para revisión', usuario: data.clienteNome || 'Cliente' }
    ]
  };
  mockNotasFiscais.push(novaNota);
  return novaNota;
}

export async function getAdminNotas() {
  await delay(600);
  return [...mockNotasFiscais].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

export async function getAdminNotaFiscalById(id: string) {
  await delay(500);
  return mockNotasFiscais.find(n => n.id === id);
}

export async function updateNotaFiscalStatus(id: string, status: string, usuario: string = 'Equipo Tu Socio') {
  await delay(600);
  const nota = mockNotasFiscais.find(n => n.id === id);
  if (nota) {
    nota.status = status as any;
    nota.atualizadoEm = new Date().toISOString();
    if (!nota.historico) nota.historico = [];
    nota.historico.push({
      data: new Date().toISOString(),
      acao: `Status alterado para ${status}`,
      usuario
    });
    return nota;
  }
  throw new Error('Nota não encontrada');
}

export async function addNotaFiscalInternalNote(id: string, note: string, usuario: string = 'Equipo Tu Socio') {
  await delay(400);
  const nota = mockNotasFiscais.find(n => n.id === id);
  if (nota) {
    nota.observacoesInternas = nota.observacoesInternas ? `${nota.observacoesInternas}\n\n[${new Date().toLocaleDateString()}] ${usuario}: ${note}` : `[${new Date().toLocaleDateString()}] ${usuario}: ${note}`;
    return nota;
  }
  throw new Error('Nota não encontrada');
}

// Novos métodos para Documentos Administrativos
export async function getAdminDocumentos() {
  await delay(600);
  return [...mockDocumentos].sort((a, b) => new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime());
}

export async function getAdminDocumentoById(id: string) {
  await delay(500);
  return mockDocumentos.find(d => d.id === id);
}

export async function updateDocumentoStatus(id: string, status: string, motivo?: string, usuario: string = 'Equipo Tu Socio') {
  await delay(600);
  const doc = mockDocumentos.find(d => d.id === id);
  if (doc) {
    doc.status = status as any;
    doc.atualizadoEm = new Date().toISOString();
    if (motivo) doc.motivoRejeicao = motivo;
    else doc.motivoRejeicao = undefined;
    
    if (!doc.historico) doc.historico = [];
    let acaoTexto = `Status alterado para ${status}`;
    if (status === 'aprovado') acaoTexto = 'Documento aprobado';
    else if (status === 'rejeitado') acaoTexto = 'Documento rechazado';
    else if (status === 'precisa_reenviar') acaoTexto = 'Solicitado reenvío del documento';
    
    doc.historico.push({
      data: new Date().toISOString(),
      acao: acaoTexto,
      usuario
    });
    return doc;
  }
  throw new Error('Documento não encontrado');
}

export async function addDocumentoInternalNote(id: string, note: string, usuario: string = 'Equipo Tu Socio') {
  await delay(400);
  const doc = mockDocumentos.find(d => d.id === id);
  if (doc) {
    doc.observacoesInternas = doc.observacoesInternas 
      ? `${doc.observacoesInternas}\n\n[${new Date().toLocaleDateString()}] ${usuario}: ${note}` 
      : `[${new Date().toLocaleDateString()}] ${usuario}: ${note}`;
    return doc;
  }
  throw new Error('Documento não encontrado');
}

// Novos métodos para Processos Administrativos
export async function getAdminProcessos() {
  await delay(600);
  return [...mockProcessos].sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
}

export async function getAdminProcessoById(id: string) {
  await delay(500);
  return mockProcessos.find(p => p.id === id);
}

export async function updateProcessoStatus(id: string, status: string, usuario: string = 'Equipo Tu Socio') {
  await delay(600);
  const processo = mockProcessos.find(p => p.id === id);
  if (processo) {
    processo.status = status as any;
    processo.dataAtualizacao = new Date().toISOString();
    
    if (!processo.historico) processo.historico = [];
    processo.historico.push({
      data: new Date().toISOString(),
      acao: `Status alterado para ${status}`,
      usuario
    });
    return processo;
  }
  throw new Error('Processo não encontrado');
}

export async function addProcessoInternalNote(id: string, note: string, usuario: string = 'Equipo Tu Socio') {
  await delay(400);
  const processo = mockProcessos.find(p => p.id === id);
  if (processo) {
    processo.observacoesInternas = processo.observacoesInternas 
      ? `${processo.observacoesInternas}\n\n[${new Date().toLocaleDateString()}] ${usuario}: ${note}` 
      : `[${new Date().toLocaleDateString()}] ${usuario}: ${note}`;
    return processo;
  }
  throw new Error('Processo não encontrado');
}

export async function addProcessoClientMessage(id: string, message: string, usuario: string = 'Equipo Tu Socio') {
  await delay(400);
  const processo = mockProcessos.find(p => p.id === id);
  if (processo) {
    processo.observacoesCliente = processo.observacoesCliente 
      ? `${processo.observacoesCliente}\n\n[${new Date().toLocaleDateString()}] ${usuario}: ${message}` 
      : `[${new Date().toLocaleDateString()}] ${usuario}: ${message}`;
    return processo;
  }
  throw new Error('Processo não encontrado');
}

// Novos métodos para Pagamentos Administrativos
export async function getAdminPagamentos() {
  await delay(600);
  return [...mockPagamentos].sort((a, b) => new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime());
}

export async function getAdminPagamentoById(id: string) {
  await delay(500);
  return mockPagamentos.find(p => p.id === id);
}

export async function createPagamento(data: any, usuario: string = 'Equipo Tu Socio') {
  await delay(800);
  const novoPag = {
    ...data,
    id: `pag_${Math.floor(Math.random() * 10000)}`,
    status: 'pendente',
    criadoEm: new Date().toISOString(),
    historico: [
      { data: new Date().toISOString(), acao: 'Cobrança criada pela equipe Tu Socio.', usuario }
    ]
  };
  mockPagamentos.push(novoPag);
  return novoPag;
}

export async function updatePagamentoStatus(id: string, status: string, motivo?: string, usuario: string = 'Equipo Tu Socio') {
  await delay(600);
  const pag = mockPagamentos.find(p => p.id === id);
  if (pag) {
    pag.status = status as any;
    pag.atualizadoEm = new Date().toISOString();
    
    if (!pag.historico) pag.historico = [];
    let acaoTexto = `Status alterado para ${status}`;
    if (status === 'pago') {
      acaoTexto = 'Pagamento confirmado pela equipe Tu Socio.';
      pag.dataPagamento = new Date().toISOString();
      pag.recibo = {
        numero: `REC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        emitidoEm: new Date().toISOString(),
        valor: pag.valor,
        disponivel: true
      };
    } else if (status === 'vencido') {
      acaoTexto = 'Marcado como vencido';
    } else if (status === 'cancelado') {
      acaoTexto = motivo ? `Cobrança cancelada: ${motivo}` : 'Cobrança cancelada';
    } else if (status === 'reembolsado') {
      acaoTexto = 'Marcado como reembolsado';
    }
    
    pag.historico.push({
      data: new Date().toISOString(),
      acao: acaoTexto,
      usuario
    });
    return pag;
  }
  throw new Error('Pagamento não encontrado');
}

export async function solicitarNovoComprovante(id: string, motivo: string, usuario: string = 'Equipo Tu Socio') {
  await delay(600);
  const pag = mockPagamentos.find(p => p.id === id);
  if (pag) {
    pag.status = 'pendente';
    pag.atualizadoEm = new Date().toISOString();
    if (pag.comprovante) {
      pag.comprovante.statusAnalise = 'rejeitado';
    }
    
    if (!pag.historico) pag.historico = [];
    pag.historico.push({
      data: new Date().toISOString(),
      acao: `Novo comprovante solicitado. Motivo: ${motivo}`,
      usuario
    });
    
    pag.observacoesCliente = pag.observacoesCliente 
      ? `${pag.observacoesCliente}\n\n[${new Date().toLocaleDateString()}] ${usuario}: Necesitamos un comprobante más claro para confirmar tu pago. Motivo: ${motivo}` 
      : `[${new Date().toLocaleDateString()}] ${usuario}: Necesitamos un comprobante más claro para confirmar tu pago. Motivo: ${motivo}`;
      
    return pag;
  }
  throw new Error('Pagamento não encontrado');
}

export async function addPagamentoInternalNote(id: string, note: string, usuario: string = 'Equipo Tu Socio') {
  await delay(400);
  const pag = mockPagamentos.find(p => p.id === id);
  if (pag) {
    pag.observacoesInternas = pag.observacoesInternas 
      ? `${pag.observacoesInternas}\n\n[${new Date().toLocaleDateString()}] ${usuario}: ${note}` 
      : `[${new Date().toLocaleDateString()}] ${usuario}: ${note}`;
    return pag;
  }
  throw new Error('Pagamento não encontrado');
}

export async function addPagamentoClientMessage(id: string, message: string, usuario: string = 'Equipo Tu Socio') {
  await delay(400);
  const pag = mockPagamentos.find(p => p.id === id);
  if (pag) {
    pag.observacoesCliente = pag.observacoesCliente 
      ? `${pag.observacoesCliente}\n\n[${new Date().toLocaleDateString()}] ${usuario}: ${message}` 
      : `[${new Date().toLocaleDateString()}] ${usuario}: ${message}`;
    return pag;
  }
  throw new Error('Pagamento não encontrado');
}
