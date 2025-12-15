import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());


const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

// Criar PIX
app.post("/criar-pix", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.invictuspay.app.br/api",
      {
        transaction_amount: 14.87,
        description: "Pagamento PIX",
        payment_method_id: "pix",
        payer: { email: "comprador@teste.com" }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      }
    );

    const pix = response.data.point_of_interaction.transaction_data;

    res.json({
      payment_id: response.data.id,
      qr_code: pix.qr_code,
      qr_base64: pix.qr_code_base64
    });
  } catch (e) {
  console.error("ERRO COMPLETO:", {
    message: e.message,
    response: e.response?.data,
    status: e.response?.status
  });

  res.status(500).json({
    error: "Erro ao criar PIX",
    detalhe: e.response?.data || e.message
  });
  }
});

// Ver status
app.get("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://api.invictuspay.app.br/api/${id}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      }
    );

    res.json({ status: response.data.status });
  } catch {
    res.status(500).json({ error: "Erro status" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend PIX rodando");
});

app.listen(process.env.PORT || 3000);











