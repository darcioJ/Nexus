import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Character } from "../models/Character.js";

const JWT_SECRET = process.env.JWT_SECRET || "nexus_omega_7";

export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Verificação básica de sinal
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "E-mail já indexado." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || "PLAYER",
    });

    res.status(201).json({ message: "Usuário registrado!", id: newUser._id });
  } catch (error) {
    res.status(500).json({ error: "Falha no protocolo de registro." });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { name: user.name, role: user.role, id: user._id },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro no processamento de login." });
  }
};
export const finalize = async (req, res) => {
  try {
    const { characterId, name, password } = req.body;

    // 1. Gerar o e-mail automático baseado no nome do personagem
    const email = `${name.replace(/\s+/g, "").toLowerCase()}@nexus.com`;

    // 2. Verificar se o e-mail já existe (segurança)
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Este sinal já foi reivindicado." });

    // 3. Criar o Usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      role: "PLAYER", // Ou MASTER, dependendo da sua lógica
    });

    // 4. VINCULAR: Atualizar a ficha com o novo userId
    await Character.findByIdAndUpdate(characterId, { userId: newUser._id });

    // 5. Gerar o Token Real (Nível 7)
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log(
      `🔐 Nexus_Finalize: Usuário ${email} vinculado à ficha ${characterId}.`,
    );

    res.status(201).json({
      token,
      user: { name: newUser.name, email: newUser.email, id: newUser._id },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro no protocolo de finalização." });
  }
};
