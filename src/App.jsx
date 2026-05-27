import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function App() {
  const [cultura, setCultura] = useState("");
  const [regiao, setRegiao] = useState("");
  const [problema, setProblema] = useState("");
  const [ndvi, setNdvi] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);

  const analisar = async () => {
    if (!cultura || !regiao || !problema || !ndvi) {
      alert("Preencha todos os campos");
      return;
    }
    setCarregando(true);
    setResposta("");

    try {
      // Inicializa a API do Gemini com a chave do seu arquivo .env
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
      // Usando o modelo gemini-1.5-flash (rápido e gratuito para testes)
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
        Você é um assistente agrícola especializado em monitoramento satelital. 
        Responda sempre em português, em linguagem simples e direta, como se estivesse explicando para um agricultor sem conhecimento técnico. 
        Seja objetivo e dê recomendações práticas baseadas nos seguintes dados:

        Dados da lavoura:
        - Tipo de Cultura: ${cultura}
        - Região: ${regiao}
        - Problema observado pelo agricultor: ${problema}
        - Índice NDVI atual da área: ${ndvi}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setResposta(response.text());
    } catch (err) {
      console.error(err);
      setResposta("Erro ao conectar com o Gemini. Verifique se sua chave de API está correta no arquivo .env.");
    }
    setCarregando(false);
  };

  return (
    <div style={{
      backgroundColor: "#1B1B2F", minHeight: "100vh",
      display: "flex", justifyContent: "center",
      alignItems: "center", fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#2C2C4A", padding: "40px",
        borderRadius: "16px", width: "500px"
      }}>
        <h1 style={{ color: "#2D6A4F", marginBottom: "8px" }}>🌱 OrbitAgro</h1>
      
        <label style={{ color: "#fff", display: "block" }}>Tipo de Cultura</label>
        <select onChange={e => setCultura(e.target.value)} style={inputStyle}>
          <option value="">Selecione</option>
          <option>Soja</option>
          <option>Milho</option>
          <option>Feijão</option>
          <option>Café</option>
          <option>Outro</option>
        </select>

        <label style={{ color: "#fff", display: "block" }}>Região</label>
        <select onChange={e => setRegiao(e.target.value)} style={inputStyle}>
          <option value="">Selecione</option>
          <option>Mato Grosso</option>
          <option>São Paulo</option>
          <option>Minas Gerais</option>
          <option>Paraná</option>
          <option>Goiás</option>
          <option>Bahia</option>
          <option>Outros</option>
        </select>

        <label style={{ color: "#fff", display: "block" }}>Problema Observado</label>
        <textarea
          placeholder="Ex: Folhas amareladas na área norte, solo muito seco..."
          onChange={e => setProblema(e.target.value)}
          style={{ ...inputStyle, height: "80px", resize: "none" }}
        />

        <label style={{ color: "#fff", display: "block" }}>Índice NDVI Atual (0 a 1)</label>
        <input
          type="number" min="0" max="1" step="0.01"
          placeholder="Ex: 0.35"
          onChange={e => setNdvi(e.target.value)}
          style={inputStyle}
        />

        <button onClick={analisar} disabled={carregando}
          style={{
            backgroundColor: "#2D6A4F", color: "#fff",
            border: "none", borderRadius: "8px",
            padding: "14px", width: "100%",
            fontSize: "16px", cursor: "pointer",
            marginTop: "8px"
          }}>
          {carregando ? "Analisando..." : "Analisar com IA 🛰️"}
        </button>

        {resposta && (
          <div style={{
            marginTop: "24px", backgroundColor: "#1B1B2F",
            border: "1px solid #2D6A4F", borderRadius: "12px",
            padding: "20px", color: "#fff", lineHeight: "1.6"
          }}>
            <strong style={{ color: "#2D6A4F" }}>Recomendação da IA:</strong>
            <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>{resposta}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px",
  marginBottom: "16px", marginTop: "4px",
  borderRadius: "8px", border: "1px solid #444",
  backgroundColor: "#1B1B2F", color: "#fff",
  fontSize: "14px", boxSizing: "border-box"
};