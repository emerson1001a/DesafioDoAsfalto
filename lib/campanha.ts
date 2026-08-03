export const CAMPANHA_INICIO = "2026-08-15T00:00:00-03:00";
export const CAMPANHA_FIM = "2026-09-15T23:59:59.999-03:00";
export const CAMPANHA_SORTEIO = "2026-09-20T12:00:00-03:00";

// Temporário: permite validar o fluxo completo antes da abertura oficial.
// Voltar para false e limpar os cadastros de teste antes de 15/08/2026.
export const CAMPANHA_TESTE_LIBERADO = true;

export type StatusCampanha = "aguardando" | "ativa" | "encerrada";

export function obterStatusCampanha(agora = Date.now()): StatusCampanha {
  if (agora < Date.parse(CAMPANHA_INICIO)) return CAMPANHA_TESTE_LIBERADO ? "ativa" : "aguardando";
  if (agora > Date.parse(CAMPANHA_FIM)) return "encerrada";
  return "ativa";
}
