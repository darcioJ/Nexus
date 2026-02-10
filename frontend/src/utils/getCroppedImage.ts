// utils/image.ts

/**
 * Cria um objeto Image HTML a partir de uma URL
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

/**
 * Esta função recebe a imagem original e as coordenadas de corte
 * e retorna a nova imagem cortada em Base64 (JPEG comprimido).
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  targetWidth = 300, // Largura final desejada (3:4 = 300x400)
  targetHeight = 400
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível criar o contexto 2D do canvas");
  }

  // Configura o tamanho do canvas para o tamanho final desejado (ex: 300x400)
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Desenha a imagem cortada no canvas
  // drawImage(imagem, cropX, cropY, cropWidth, cropHeight, canvasX, canvasY, canvasWidth, canvasHeight)
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  // Exporta como JPEG comprimido (0.7 de qualidade)
  return canvas.toDataURL("image/jpeg", 0.7);
}