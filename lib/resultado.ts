import { obterClassificacao } from "./classificacao";

export type ResultadoPayload = {
  classificacao: string;
  pontuacao: number;
  compartilhou: boolean;
  origem: string | null;
  tentativa_numero: number;
  erros: number[];
};

export function montarPayloadResultado(params: {
  pontuacao: number;
  compartilhou?: boolean;
  origem?: string | null;
  tentativaNumero: number;
  erros: number[];
}): ResultadoPayload {
  return {
    classificacao: obterClassificacao(params.pontuacao).id,
    pontuacao: params.pontuacao,
    compartilhou: params.compartilhou ?? false,
    origem: params.origem ?? null,
    tentativa_numero: params.tentativaNumero,
    erros: params.erros
  };
}
