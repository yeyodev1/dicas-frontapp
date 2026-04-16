import { v2 as cloudinary } from 'cloudinary';
import { writeFileSync } from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: 'dvq6znk71',
  api_key: '159869349288522',
  api_secret: 'NrrVRUmHaE2Mub1GUgF4QcoxZd4',
});

const STOCK_DIR = './src/assets/stock';

const images = [
  {
    file: 'WhatsApp Image Apr 10 2026 (2).jpeg',
    description: 'CEO cuerpo completo, blazer blanco, fondo beige neutro, brazos relajados al costado, mirada directa a cámara. Pose formal y segura.',
    tags: ['ceo', 'full-body', 'white-blazer', 'studio', 'formal'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (3).jpeg',
    description: 'CEO 3/4 cuerpo, blazer blanco, fondo beige, leve sonrisa, manos juntas al frente. Pose accesible y profesional.',
    tags: ['ceo', 'three-quarter', 'white-blazer', 'studio', 'smiling'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (4).jpeg',
    description: 'CEO cuerpo completo, traje azul marino, fondo neutro, postura segura y erguida. Look ejecutivo clásico.',
    tags: ['ceo', 'full-body', 'navy-suit', 'studio', 'confident'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (5).jpeg',
    description: 'CEO retrato busto, blazer blanco, fondo beige, sonrisa cálida y cercana. Ideal para presentaciones personales.',
    tags: ['ceo', 'portrait', 'white-blazer', 'studio', 'warm-smile'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (6).jpeg',
    description: 'CEO cuerpo completo, traje azul marino, pose dinámica tipo caminata. Energía y movimiento en ambiente de estudio.',
    tags: ['ceo', 'full-body', 'navy-suit', 'studio', 'dynamic'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (7).jpeg',
    description: 'CEO 3/4 cuerpo, blazer blanco, fondo beige, brazos cruzados, mirada intensa y directa. Pose de autoridad.',
    tags: ['ceo', 'three-quarter', 'white-blazer', 'studio', 'arms-crossed'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (8).jpeg',
    description: 'CEO retrato close-up, traje azul marino, mirada directa a cámara. Expresión segura y ejecutiva.',
    tags: ['ceo', 'portrait', 'navy-suit', 'studio', 'close-up'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (9).jpeg',
    description: 'CEO en postura sentada o semi-apoyada, traje azul marino, actitud relajada pero profesional en estudio.',
    tags: ['ceo', 'seated', 'navy-suit', 'studio', 'relaxed'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (10).jpeg',
    description: 'CEO de pie, blazer blanco, fondo beige, manos en caderas, postura segura y decidida.',
    tags: ['ceo', 'full-body', 'white-blazer', 'studio', 'hands-on-hips'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (11).jpeg',
    description: 'CEO 3/4, traje azul marino, pose pensativa con mano cerca del rostro. Expresión reflexiva y estratégica.',
    tags: ['ceo', 'three-quarter', 'navy-suit', 'studio', 'thoughtful'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (12).jpeg',
    description: 'CEO cuerpo completo, blazer blanco, de pie en estudio, expresión neutral y profesional.',
    tags: ['ceo', 'full-body', 'white-blazer', 'studio', 'neutral'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (13).jpeg',
    description: 'CEO retrato busto, traje azul marino, ángulo lateral, mirada al frente. Composición editorial.',
    tags: ['ceo', 'portrait', 'navy-suit', 'studio', 'side-angle'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (14).jpeg',
    description: 'CEO cuerpo completo, blazer blanco, ligera sonrisa, pose cómoda y accesible en estudio profesional.',
    tags: ['ceo', 'full-body', 'white-blazer', 'studio', 'approachable'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (15).jpeg',
    description: 'CEO 3/4 cuerpo, traje azul marino, postura erguida, manos al costado o juntas. Imagen corporativa clásica.',
    tags: ['ceo', 'three-quarter', 'navy-suit', 'studio', 'corporate'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (16).jpeg',
    description: 'CEO cuerpo completo, traje azul marino, manos entrelazadas al frente, mirada directa. Pose de liderazgo formal.',
    tags: ['ceo', 'full-body', 'navy-suit', 'studio', 'hands-clasped'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (17).jpeg',
    description: 'CEO retrato busto, traje azul marino, sonrisa cálida y auténtica. Ideal para testimonios o bienvenida.',
    tags: ['ceo', 'portrait', 'navy-suit', 'studio', 'warm-smile'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (18).jpeg',
    description: 'CEO cuerpo completo, traje azul marino, pose pensativa apoyando barbilla, expresión introspectiva.',
    tags: ['ceo', 'full-body', 'navy-suit', 'studio', 'thoughtful-chin'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (19).jpeg',
    description: 'CEO cuerpo completo, traje blanco/claro, ángulo lateral, manos entrelazadas al frente. Elegancia y calma.',
    tags: ['ceo', 'full-body', 'white-suit', 'studio', 'side-angle'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (20).jpeg',
    description: 'CEO cuerpo completo, traje blanco, sonrisa natural, ángulo lateral. Imagen luminosa y positiva.',
    tags: ['ceo', 'full-body', 'white-suit', 'studio', 'smiling'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (21).jpeg',
    description: 'CEO cuerpo completo, traje blanco, expresión neutral, manos juntas. Composición limpia y simétrica.',
    tags: ['ceo', 'full-body', 'white-suit', 'studio', 'neutral'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (22).jpeg',
    description: 'CEO 3/4 cuerpo, traje blanco, brazos cruzados, mirada intensa sobre el hombro. Pose poderosa y editorial.',
    tags: ['ceo', 'three-quarter', 'white-suit', 'studio', 'arms-crossed', 'over-shoulder'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (23).jpeg',
    description: 'CEO cuerpo completo, traje blanco, postura segura con brazos al costado, mirada directa al frente.',
    tags: ['ceo', 'full-body', 'white-suit', 'studio', 'confident'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (24).jpeg',
    description: 'CEO cuerpo completo o 3/4, traje blanco, pose profesional relajada, expresión abierta y cálida.',
    tags: ['ceo', 'full-body', 'white-suit', 'studio', 'relaxed'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (25).jpeg',
    description: 'CEO 3/4, traje azul marino, mirada directa a cámara, expresión segura y ejecutiva.',
    tags: ['ceo', 'three-quarter', 'navy-suit', 'studio', 'direct-gaze'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (26).jpeg',
    description: 'CEO cuerpo completo, traje azul marino, pose dinámica o caminata, actitud enérgica.',
    tags: ['ceo', 'full-body', 'navy-suit', 'studio', 'dynamic'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (27).jpeg',
    description: 'CEO retrato close-up, traje blanco, sonrisa cálida y genuina. Imagen humana y cercana.',
    tags: ['ceo', 'portrait', 'white-suit', 'studio', 'close-up', 'warm-smile'],
  },
  {
    file: 'WhatsApp Image Apr 10 2026 (28).jpeg',
    description: 'CEO cuerpo completo, traje azul marino, brazos cruzados, postura segura y resolutiva.',
    tags: ['ceo', 'full-body', 'navy-suit', 'studio', 'arms-crossed', 'confident'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (2).jpeg',
    description: 'CEO en segunda sesión fotográfica, atuendo profesional, fondo de estudio. Variante alternativa de la serie principal.',
    tags: ['ceo', 'studio', 'session-2', 'professional'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (3).jpeg',
    description: 'CEO sesión alternativa, pose profesional, iluminación de estudio. Serie complementaria para uso editorial.',
    tags: ['ceo', 'studio', 'session-2', 'editorial'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (4).jpeg',
    description: 'CEO sesión alternativa, atuendo ejecutivo, fondo neutro. Imagen con enfoque en confianza y presencia.',
    tags: ['ceo', 'studio', 'session-2', 'confident'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (5).jpeg',
    description: 'CEO sesión alternativa, postura erguida y segura, expresión profesional en estudio.',
    tags: ['ceo', 'studio', 'session-2', 'upright'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (6).jpeg',
    description: 'CEO sesión alternativa, ángulo o pose diferente, actitud calmada y ejecutiva.',
    tags: ['ceo', 'studio', 'session-2', 'calm'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (7).jpeg',
    description: 'CEO sesión alternativa, pose dinámica o semi-perfil, energía y movimiento en estudio.',
    tags: ['ceo', 'studio', 'session-2', 'dynamic'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (8).jpeg',
    description: 'CEO sesión alternativa, retrato busto o 3/4, expresión abierta y accesible.',
    tags: ['ceo', 'studio', 'session-2', 'approachable'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (9).jpeg',
    description: 'CEO sesión alternativa, pose relajada pero profesional, imagen natural y auténtica.',
    tags: ['ceo', 'studio', 'session-2', 'natural'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (10).jpeg',
    description: 'CEO sesión alternativa, postura segura, mirada directa. Imagen de liderazgo y presencia ejecutiva.',
    tags: ['ceo', 'studio', 'session-2', 'leadership'],
  },
  {
    file: 'WhatsApp Imagen Abr 10 2026 (11).jpeg',
    description: 'CEO sesión alternativa, imagen final de la serie, pose elegante y profesional en estudio.',
    tags: ['ceo', 'studio', 'session-2', 'elegant'],
  },
];

async function uploadImage(item) {
  const filePath = path.join(STOCK_DIR, item.file);
  const publicId = `dicas/ceo/${item.file.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_')}`;

  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    folder: 'dicas/ceo',
    context: { description: item.description },
    tags: item.tags,
    overwrite: true,
  });

  console.log(`✅ Uploaded: ${item.file}`);
  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    description: item.description,
    tags: item.tags,
    originalFile: item.file,
  };
}

async function main() {
  console.log(`Uploading ${images.length} CEO images to Cloudinary...\n`);
  const results = [];

  for (const item of images) {
    try {
      const data = await uploadImage(item);
      results.push(data);
    } catch (err) {
      console.error(`❌ Failed: ${item.file} — ${err.message}`);
    }
  }

  const outputPath = './src/assets/ceo-images.json';
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Done! ${results.length}/${images.length} uploaded.`);
  console.log(`📄 JSON saved to ${outputPath}`);
}

main();
