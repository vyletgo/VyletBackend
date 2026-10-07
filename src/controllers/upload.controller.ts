import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

// Valida el tipo real por cabecera binaria (no se confía en el MIME declarado)
function detectarImagen(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true; // JPEG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true; // PNG
  if (buf.toString('ascii', 0, 4) === 'GIF8') return true; // GIF
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return true; // WebP
  if (buf.toString('ascii', 0, 2) === 'BM') return true; // BMP
  if (buf.toString('ascii', 4, 8) === 'ftyp') {
    const marca = buf.toString('ascii', 8, 12).toLowerCase();
    // HEIC/HEIF (fotos de iPhone) y AVIF
    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1', 'heif', 'avif', 'avis'].includes(marca)) return true;
  }
  return false;
}

// POST /api/upload  (autenticado) — recibe { data: dataURI, carpeta?: string }
export const upload = async (req: Request, res: Response) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ error: 'Cloudinary no está configurado. Agrega las credenciales en .env' });
    }

    const { data, carpeta } = req.body ?? {};
    if (!data || typeof data !== 'string') {
      return res.status(400).json({ error: 'El campo data (imagen en base64) es requerido' });
    }
    if (Buffer.byteLength(data, 'utf8') > MAX_BYTES) {
      return res.status(400).json({ error: 'La imagen supera los 10 MB' });
    }

    const base64 = data.includes(',') ? data.slice(data.indexOf(',') + 1) : data;
    const binario = Buffer.from(base64, 'base64');
    if (!detectarImagen(binario)) {
      return res
        .status(400)
        .json({ error: 'Formato no permitido. Sube una imagen JPEG, PNG, WebP, GIF, HEIC o AVIF.' });
    }

    const folder = ['empresas', 'eventos', 'habitaciones', 'productos', 'publicidad', 'sucursales'].includes(carpeta)
      ? `vylet/${carpeta}`
      : 'vylet/general';

    const resultado = await cloudinary.uploader.upload(data, {
      folder,
      resource_type: 'image',
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
    });

    res.json({ url: resultado.secure_url, public_id: resultado.public_id });
  } catch (error: any) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ error: error?.message ?? 'Error al subir la imagen' });
  }
};