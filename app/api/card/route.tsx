import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { obterClassificacao } from "@/lib/classificacao";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nome = searchParams.get("nome")?.slice(0, 32) || "Voce";
  const instagram = searchParams.get("instagram")?.slice(0, 32) || "";
  const pontuacao = Math.max(0, Math.min(10, Number(searchParams.get("score") || 0)));
  const classificacao = obterClassificacao(pontuacao);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "82px",
          color: "#f8f0dc",
          background:
            classificacao.fundo === "sunset"
              ? "linear-gradient(160deg, #070707 0%, #3d1706 48%, #f5a51b 100%)"
              : classificacao.fundo === "cabine"
                ? "linear-gradient(160deg, #050505 0%, #151515 45%, #1c6c4b 100%)"
                : classificacao.fundo === "oficina"
                  ? "linear-gradient(160deg, #080808 0%, #222 50%, #165c94 100%)"
                  : classificacao.fundo === "cidade"
                    ? "linear-gradient(160deg, #050505 0%, #2a1606 50%, #d86c1f 100%)"
                    : "linear-gradient(160deg, #050505 0%, #181818 50%, #d4b318 100%)",
          fontFamily: "Arial"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 10%, rgba(255,255,255,.22), transparent 280px), repeating-linear-gradient(45deg, rgba(255,255,255,.07) 0 4px, transparent 4px 20px)",
            opacity: .5
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              padding: "14px 22px",
              borderRadius: "14px",
              background: "rgba(0,0,0,.55)",
              border: "2px solid rgba(245,181,27,.75)",
              fontSize: "38px",
              fontWeight: 900
            }}
          >
            DESAFIO DO ASFALTO
          </div>
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 800 }}>@zedagraxa.oficial</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "34px", zIndex: 1 }}>
          <div style={{ display: "flex", fontSize: "56px", fontWeight: 800 }}>{nome}</div>
          <div style={{ display: "flex", fontSize: "126px", lineHeight: 1, fontWeight: 950, letterSpacing: "-2px" }}>
            {pontuacao} DE 10
          </div>
          <div
            style={{
              width: "100%",
              height: "12px",
              background: classificacao.cor,
              boxShadow: `0 0 46px ${classificacao.cor}`
            }}
          />
          <div style={{ display: "flex", fontSize: "112px", lineHeight: .95, fontWeight: 950 }}>{classificacao.titulo}</div>
          <div style={{ display: "flex", fontSize: "46px", lineHeight: 1.18, maxWidth: "880px" }}>{classificacao.texto}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 1 }}>
          <div style={{ display: "flex", fontSize: "34px", opacity: .92 }}>{instagram ? `Resultado de ${instagram}` : "Mostra pros parceiros e desafia a turma."}</div>
          <div
            style={{
              display: "flex",
              padding: "18px 26px",
              background: "#f5b51b",
              color: "#15110a",
              fontSize: "32px",
              fontWeight: 900,
              borderRadius: "16px"
            }}
          >
            TESTA AI
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920
    }
  );
}
