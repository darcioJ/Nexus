import mongoose from "mongoose";
import "dotenv/config";

const vaultUrl = process.env.DATABASE_URL;

if (!vaultUrl) {
  throw new Error("❌ DATABASE_URL não encontrada no .env");
}

export const connectVault = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(vaultUrl);
    console.log("🔓 Nexus Vault: Acesso via Mongoose Confirmado");
  } catch (error) {
    console.error("❌ Falha crítica na conexão com o Vault:", error);
  }
};