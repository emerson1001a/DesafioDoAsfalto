import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { obterClassificacao } from "@/lib/classificacao";

export const runtime = "edge";

const textoCard: Record<string, string> = {
  "RODANDO NO PREJUÍZO": "Errei quase tudo e nem tô com vergonha. Se acha que sabe mais que eu, prova.",
  "NOVATO NO ASFALTO": "Ainda tô pegando o jeito da estrada. Bora ver se você vai melhor.",
  "FRETE CERTO": "Acertei metade, no ponto certo. Duvido você fazer muito diferente.",
  "LOBO RODADO": "Rodei o suficiente pra saber das coisas. Poucos chegam perto disso.",
  "REI DA ESTRADA": "Não errei quase nada. Bota à prova se acha que consegue igual.",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nome = searchParams.get("nome")?.slice(0, 32) || "Você";
  const instagram = searchParams.get("instagram")?.slice(0, 32) || "";
  const pontuacao = Math.max(0, Math.min(10, Number(searchParams.get("score") || 0)));
  const classificacao = obterClassificacao(pontuacao);
  const imagemPassageiro = new URL("/images/passageiro-carona.png", request.url).toString();
  const usarImagemPassageiro = classificacao.fundo === "passageiro";

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
          position: "relative",
          overflow: "hidden",
          background:
            usarImagemPassageiro
              ? "#050505"
              : classificacao.fundo === "sunset"
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
        {usarImagemPassageiro && (
          <img
            src={imagemPassageiro}
            alt=""
            width="1080"
            height="1920"
            style={{
              position: "absolute",
              inset: 0,
              width: "1080px",
              height: "1920px",
              objectFit: "cover",
              objectPosition: "64% center"
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              usarImagemPassageiro
                ? "linear-gradient(180deg, rgba(0,0,0,.38) 0%, rgba(0,0,0,.18) 34%, rgba(0,0,0,.82) 76%, rgba(0,0,0,.96) 100%), linear-gradient(90deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.42) 48%, rgba(0,0,0,.20) 100%)"
                : "radial-gradient(circle at 20% 10%, rgba(255,255,255,.22), transparent 280px), repeating-linear-gradient(45deg, rgba(255,255,255,.07) 0 4px, transparent 4px 20px)",
            opacity: usarImagemPassageiro ? 1 : .5
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "34px",
            zIndex: 1,
            maxWidth: usarImagemPassageiro ? "820px" : "100%"
          }}
        >
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
          <div style={{ display: "flex", fontSize: "46px", lineHeight: 1.18, maxWidth: "880px" }}>
            {textoCard[classificacao.id] ?? classificacao.texto}
          </div>
          <div
            style={{
              display: "flex",
              padding: "28px 40px",
              borderRadius: "20px",
              background: "rgba(245, 181, 27, 0.15)",
              border: "2px solid rgba(245, 181, 27, 0.5)",
              fontSize: "50px",
              fontWeight: 800,
              color: "#f5d94a",
            }}
          >
            🏆 R$500 no Pix pra quem topar o desafio
          </div>
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
            TESTA AÍ
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
