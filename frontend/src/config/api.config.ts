const getBaseUrl = () => {
  // Se estivermos no navegador, pegamos o IP da URL. 
  // Se for mobile/node, usamos localhost como fallback.
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  
  // Porta do seu Backend (Core)
  const PORT = "3001";
  
  return `http://${hostname}:${PORT}`;
};

export const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api`;