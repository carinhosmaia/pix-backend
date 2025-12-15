import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_TOKEN = process.env.INVICTUS_API_TOKEN;
const BASE_URL = "https://api.invictuspay.app.br/api/public/v1";

// Criar PIX
app.post("/criar-pix", async (req, res) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/transactions?api_token=${API_TOKEN}`,
      {
        amount: 1487, // centavos
        offer_hash: "SEU_OFFER_HASH_AQUI",
        payment_method: "pix",
        customer: {
          name: "Cliente Teste",
          email: "cliente@email.com",
          phone_number: "21999999999",
          document: "09115751031",
          street_name: "Rua Teste",
          number: "123",
          neighborhood: "Centro",
          city: "Rio de Janeiro",
          state: "RJ",
          zip_code: "20000000"
        },
        cart: [
          {
            product_hash: "HASH_DO_PRODUTO",
            title: "Produto Teste",
            price: 1487,
            quantity: 1,
            operation_type: 1,
            tangible: false
          }
        ],
        installments: 1,
        expire_in_days: 1,
        transaction_origin: "api"
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao criar PIX" });
  }
});

// Status da transação
app.get("/status/:hash", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/transactions/${req.params.hash}?api_token=${API_TOKEN}`
    );

    res.json({ status: response.data.status });
  } catch (err) {
    res.status(500).json({ error: "Erro ao consultar status" });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend PIX rodando na porta 3000");
});
