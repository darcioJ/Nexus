import jwt from "jsonwebtoken";

export const extractUser = (req, res, next) => {
  req.user = null; // 🛡️ Reset obrigatório para garantir sinal limpo

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "nexus_omega_7",
    );
    req.user = decoded;
  } catch (err) {
    // Se o token expirou ou é lixo, req.user continua null
  }
  next();
};

// 2. Trava de Segurança: Se estiver logado (Real User), não entra no Forger
export const blockAuthenticated = (req, res, next) => {
  if (req.user && !req.user.isGuest && req.user.role !== "MASTER") {
    return res.status(403).json({
      error:
        "Protocolo Negado: Operativos registrados devem usar o Dashboard principal.",
    });
  }
  next();
};

export const protectUser = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Sinal de acesso não encontrado." });

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "nexus_omega_7",
    );

    // Agora o req.user pode ter userId (usuário real) ou characterId (convidado)
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido." });
  }
};

export const authorizeMaster = (req: any, res: any, next: any) => {
  if (req.user.role !== "MASTER") {
    return res
      .status(403)
      .json({ error: "Acesso negado. Requer nível de Mestre." });
  }
  next();
};
