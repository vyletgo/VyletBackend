import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const IMAGENES: Record<string, string> = {
  'quito': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787867688/vylet/general/e2zqqft9ujiyabw2buwt.jpg',
  'guayaquil': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868141/vylet/general/dfc1yszesy9k0emngke0.jpg',
  'cuenca': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868198/vylet/general/ay3hfy1ng8m5avuccgas.jpg',
  'ambato': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787867811/vylet/general/gc6gvhkutjwpurg0tuhb.jpg',
  'loja': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868901/vylet/general/neumbmcl39hiypdl3yue.jpg',
  'machala': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868810/vylet/general/z0badz7awq5aadeiurha.jpg',
  'portoviejo': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869039/vylet/general/jghy3x64xzgwsjerylrh.jpg',
  'ibarra': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868872/vylet/general/km5tssj6xzils67oa3lx.jpg',
  'atacames': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868834/vylet/general/rbkttvxtecwmjciv4bnw.jpg',
  'azogues': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868327/vylet/general/dndrxima1mr8ow10wxjv.jpg',
  'babahoyo': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869013/vylet/general/epbyc9yfwdycv13wkt8n.jpg',
  'bahia-de-caraquez': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869166/vylet/general/hjv5qgdbx0ra4ykzhi9x.jpg',
  'banos-de-agua-santa': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869747/vylet/general/ovbdp5vmurjefpcl9m7w.jpg',
  'cayambe': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868153/vylet/general/habyjtsxo9laftvbsod6.jpg',
  'duran': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868169/vylet/general/rin7setl3pwa5jwxrbgt.jpg',
  'esmeraldas': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868823/vylet/general/uaoj17he7itgj1d2o98e.jpg',
  'francisco-de-orellana': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869632/vylet/general/x8zstv1itreuxhqkpdcc.jpg',
  'gualaceo': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868211/vylet/general/bhvrznozeyizuvtbwjy2.jpg',
  'guaranda': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868314/vylet/general/x95unh04whg9itivv9nh.jpg',
  'latacunga': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868798/vylet/general/rjomziqzpysa5v8f0ezi.jpg',
  'macas': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869598/vylet/general/osk9j6klk3cxx5tr1uww.jpg',
  'manta': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869051/vylet/general/fqnom6tpdjpdsiijpapo.jpg',
  'milagro': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868184/vylet/general/axe7vlp1zvhq6pdbofv6.jpg',
  'montanita': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869707/vylet/general/xuuuddqwopvk9tebxcyf.jpg',
  'nueva-loja': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869733/vylet/general/sgsfwpbuvjgyke5ebl9q.jpg',
  'otavalo': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868889/vylet/general/ar5ppbcoc114bi1uvnyu.jpg',
  'puerto-ayora': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868860/vylet/general/qpdkcbzdsfbcudxqimmz.jpg',
  'puerto-baquerizo-moreno': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868848/vylet/general/a7omq8pyf0rxxos8vtwg.jpg',
  'puerto-lopez': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869586/vylet/general/xdmou1v9oark4ctockda.jpg',
  'puyo': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869646/vylet/general/nj7ihlbq4rjra4idnvvr.jpg',
  'quevedo': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869026/vylet/general/gjyx1roh4sex40f1bf4m.jpg',
  'riobamba': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868788/vylet/general/pbkmw9vsd7wqtjjwwphb.jpg',
  'salinas': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869684/vylet/general/v4hm24tdc6xsmsmof9ng.jpg',
  'santa-elena': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869670/vylet/general/yqtpz4tgboblkiblj5ow.jpg',
  'santo-domingo': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869721/vylet/general/sc51se0lz1oeyavcw5qt.jpg',
  'tena': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869612/vylet/general/wmdkzdydbjk96dd5oqtu.jpg',
  'tulcan': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868775/vylet/general/ql1ciiz8kfunzo8mxklv.jpg',
  'zamora': 'https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869758/vylet/general/avs0ybx1bw2ntr67pv4r.jpg',
};

async function main() {
  console.log('Copiando imágenes de ciudades a Supabase...');
  let count = 0;

  for (const [slug, imagen] of Object.entries(IMAGENES)) {
    const result = await prisma.ciudades.updateMany({
      where: { slug },
      data: { imagen_principal: imagen },
    });
    if (result.count > 0) count++;
    console.log(`  ${slug}: ${result.count > 0 ? 'OK' : 'NO ENCONTRADA'}`);
  }

  console.log(`\n¡Listo! ${count} imágenes copiadas.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
