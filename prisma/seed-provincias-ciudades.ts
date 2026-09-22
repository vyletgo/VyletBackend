import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const provincias = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',
  'Esmeraldas', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí',
  'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',
  'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos',
  'Tungurahua', 'Zamora Chinchipe', 'Galápagos',
];

const ciudadesConProvincia = [
  { nombre: 'Quito', slug: 'quito', provincia: 'Pichincha', descripcion: 'La ciudad más antigua de América del Sur y capital de Ecuador, declarada Patrimonio Cultural de la Humanidad por la UNESCO en 1978.', historia: 'Fundada por los españoles en 1534 sobre las ruinas de una ciudad inca, Quito conserva uno de los centros históricos mejor preservados del continente. Su arquitectura colonial barroca mezclada con elementos indígenas la convierten en un destino turístico único.', altitud: 2850, temperatura_min: 12, temperatura_max: 22, poblacion: 2800000, distincion: 'Patrimonio UNESCO' },
  { nombre: 'Guayaquil', slug: 'guayaquil', provincia: 'Guayas', descripcion: 'La ciudad más grande y poblada de Ecuador, principal puerto marítimo y centro comercial del país.', historia: 'Fundada en 1537 por Francisco de Orellana, Guayaquil ha sido testigo de numerosas transformaciones. Su Malecón 2000 es uno de los paseos ribereños más emblemáticos de Sudamérica.', altitud: 4, temperatura_min: 24, temperatura_max: 32, poblacion: 2700000, distincion: 'Puerto principal' },
  { nombre: 'Cuenca', slug: 'cuenca', provincia: 'Azuay', descripcion: 'Ciudad colonial fundada en 1557, conocida por su arquitectura barroca, ríos y por ser la tercera ciudad más importante del Ecuador.', historia: 'Cuenca fue fundada por Gil Ramírez Dávalos y debe su nombre a la ciudad española de Cuenca. Su centro histórico fue declarado Patrimonio Cultural de la Humanidad por la UNESCO en 1999.', altitud: 2550, temperatura_min: 10, temperatura_max: 21, poblacion: 600000, distincion: 'Patrimonio UNESCO' },
  { nombre: 'Ambato', slug: 'ambato', provincia: 'Tungurahua', descripcion: 'Conocida como la "Ciudad de las Flores y las Frutas", famosa por su Festival de las Flores y Frutas que se celebra cada febrero.', historia: 'Ambato fue fundada en 1698 tras un terremoto que destruyó la ciudad anterior. Es cuna de Juan León Mera, autor de la letra del himno nacional ecuatoriano.', altitud: 2577, temperatura_min: 12, temperatura_max: 21, poblacion: 400000, distincion: 'Ciudad de las Flores' },
  { nombre: 'Loja', slug: 'loja', provincia: 'Loja', descripcion: 'Ciudad cultural de Ecuador, conocida por su música, poesía y como puerta de entrada al Parque Nacional Podocarpus.', historia: 'Loja fue fundada en 1546 por Carlos Arias de los Ríos. Ha sido cuna de grandes músicos, poetas y escritores ecuatorianos, ganándose el título de "Ciudad Musical".', altitud: 2060, temperatura_min: 14, temperatura_max: 22, poblacion: 250000, distincion: 'Ciudad Musical' },
  { nombre: 'Machala', slug: 'machala', provincia: 'El Oro', descripcion: 'Capital bananera del mundo, ciudad portuaria ubicada en la costa sur de Ecuador con acceso a las islas Galápagos.', historia: 'Machala fue fundada en 1549 y ha crecido como centro agrícola y comercial. Su economía se basa principalmente en el banano, cacao y arroz.', altitud: 5, temperatura_min: 24, temperatura_max: 31, poblacion: 300000, distincion: 'Capital bananera' },
  { nombre: 'Portoviejo', slug: 'portoviejo', provincia: 'Manabí', descripcion: 'Capital de la provincia de Manabí, ciudad agrícola y comercial con una rica tradición cultural.', historia: 'Fundada en 1535 por Francisco Pacheco, Portoviejo es una de las ciudades más antiguas de la costa ecuatoriana. Su nombre proviene del río que la atraviesa.', altitud: 60, temperatura_min: 24, temperatura_max: 30, poblacion: 250000, distincion: 'Ciudad agrícola' },
  { nombre: 'Ibarra', slug: 'ibarra', provincia: 'Imbabura', descripcion: 'Ciudad blanca del norte de Ecuador, conocida por su arquitectura colonial y proximidad al lago San Pablo.', historia: 'Fundada en 1607 por Pedro de Ampudia, Ibarra fue nombrada por el virrey del Perú. Su centro histórico fue restaurado tras el terremoto de 1868.', altitud: 2225, temperatura_min: 14, temperatura_max: 22, poblacion: 180000, distincion: 'Ciudad blanca' },
  { nombre: 'Atacames', slug: 'atacames', provincia: 'Esmeraldas', descripcion: 'Playa volcánica de arena negra en la provincia de Esmeraldas, destino popular de bañistas y surfistas.', historia: 'Atacames fue escenario de batallas históricas durante la conquista española. Hoy es uno de los balnearios más visitados de la costa ecuatoriana, conocido por su playa de arena negra volcánica.', altitud: 3, temperatura_min: 25, temperatura_max: 32, poblacion: 35000, distincion: 'Playa de arena negra' },
  { nombre: 'Azogues', slug: 'azogues', provincia: 'Cañar', descripcion: 'Capital de la provincia de Cañar, ciudad intermedia entre Cuenca y el Austro ecuatoriano.', historia: 'Azogues fue fundada en 1563 y debe su nombre al mercurio (azogue) que se extraía en la zona. Es conocida por su artesanía en hilo.', altitud: 2620, temperatura_min: 12, temperatura_max: 20, poblacion: 80000, distincion: 'Ciudad del hilo' },
  { nombre: 'Babahoyo', slug: 'babahoyo', provincia: 'Los Ríos', descripcion: 'Capital de la provincia de Los Ríos, ciudad agrícola en el corazón del fértil valle del río Babahoyo.', historia: 'Babahoyo fue fundada en 1580 por Francisco de Orellana. Su nombre proviene del río Babahoyo. Es centro de la producción arrocera y bananera del Ecuador.', altitud: 50, temperatura_min: 23, temperatura_max: 32, poblacion: 95000, distincion: 'Puerta del Litoral' },
  { nombre: 'Bahía de Caráquez', slug: 'bahia-de-caraquez', provincia: 'Manabí', descripcion: 'Ciudad costera en Manabí, conocida por su malecón, pesca artesanal y proximidad a la Reserva Muisne.', historia: 'Bahía de Caráquez fue fundada en el siglo XVI y ha sido históricamente un puerto pesquero. Su ecoturismo ha crecido en los últimos años con la protección de manglares.', altitud: 10, temperatura_min: 24, temperatura_max: 30, poblacion: 35000, distincion: 'Ciudad pesquera' },
  { nombre: 'Baños de Agua Santa', slug: 'banos-de-agua-santa', provincia: 'Tungurahua', descripcion: 'Ciudad turística al pie del volcán Tungurahua, famosa por sus aguas termales y deportes de aventura.', historia: 'Baños debe su nombre a las aguas termales medicinales descubiertas por los españoles. La ciudad ha reconstruido repetidamente tras erupciones del Tungurahua.', altitud: 1820, temperatura_min: 14, temperatura_max: 22, poblacion: 20000, distincion: 'Ciudad del Volcán' },
  { nombre: 'Cayambe', slug: 'cayambe', provincia: 'Pichincha', descripcion: 'Ciudad de los Altos al pie del volcán Cayambe, punto de paso hacia las comunidades indígenas del norte.', historia: 'Cayambe es célebre por el volcán homónimo, el único punto del ecuador terrestre que toca la línea equinoccial. La zona es famosa por su producción de leche y rosas.', altitud: 2830, temperatura_min: 8, temperatura_max: 18, poblacion: 40000, distincion: 'Tierra del equinoccio' },
  { nombre: 'Durán', slug: 'duran', provincia: 'Guayas', descripcion: 'Ciudad satélite de Guayaquil, conectada por el Puente de la Unidad Nacional sobre el río Guayas.', historia: 'Durán fue fundada en 1878 como estación del ferrocarril. Su crecimiento se aceleró con la construcción del Puente de la Unidad Nacional que la conecta con Guayaquil.', altitud: 4, temperatura_min: 24, temperatura_max: 32, poblacion: 300000, distincion: 'Ciudad puente' },
  { nombre: 'Esmeraldas', slug: 'esmeraldas', provincia: 'Esmeraldas', descripcion: 'Capital de la provincia de Esmeraldas, conocida por su costa, cultura afroecuatoriana y el canto de marimba.', historia: 'Esmeraldas fue fundada en 1526 por Bartolomé Ruiz. La zona es cuna de la cultura afroecuatoriana, con influencias musicales como el cununú y la marimba.', altitud: 5, temperatura_min: 25, temperatura_max: 30, poblacion: 150000, distincion: 'Costa de esmeraldas' },
  { nombre: 'Francisco de Orellana', slug: 'francisco-de-orellana', provincia: 'Orellana', descripcion: 'Ciudad amazónica en la provincia de Orellana, puerta de entrada a la selva y al Parque Nacional Yasuní.', historia: 'Nombrada en honor al explorador Francisco de Orellana, primer europeo en navegar el río Amazonas. La zona es rica en petróleo y biodiversidad amazónica.', altitud: 250, temperatura_min: 22, temperatura_max: 32, poblacion: 35000, distincion: 'Puerta del Yasuní' },
  { nombre: 'Gualaceo', slug: 'gualaceo', provincia: 'Azuay', descripcion: 'Ciudad del Valle de Gualaceo en la provincia de Azuay, conocida por su artesanía en hilo y tradiciones.', historia: 'Gualaceo fue fundada en 1570 y es conocida por su artesanía textil, especialmente la "ikát" o pintura de hilos.', altitud: 2300, temperatura_min: 12, temperatura_max: 22, poblacion: 35000, distincion: 'Ciudad del ikát' },
  { nombre: 'Guaranda', slug: 'guaranda', provincia: 'Bolívar', descripcion: 'Capital de la provincia de Bolívar, conocida como la "Ciudad de las Siete Colinas" y por su festival del Inti Raymi.', historia: 'Guaranda fue fundada en 1571. Se le conoce como la Ciudad de las Siete Colinas por sus siete cerros.', altitud: 2750, temperatura_min: 10, temperatura_max: 20, poblacion: 100000, distincion: 'Ciudad de las Siete Colinas' },
  { nombre: 'Latacunga', slug: 'latacunga', provincia: 'Cotopaxi', descripcion: 'Capital de la provincia de Cotopaxi, ciudad colonial al pie del volcán Cotopaxi, Patrimonio Cultural de la Humanidad.', historia: 'Latacunga fue fundada en 1584. Su centro histórico fue declarado Patrimonio Cultural de la Humanidad por la UNESCO en 1998.', altitud: 2780, temperatura_min: 10, temperatura_max: 20, poblacion: 85000, distincion: 'Patrimonio UNESCO' },
  { nombre: 'Macas', slug: 'macas', provincia: 'Morona Santiago', descripcion: 'Capital de la provincia de Morona Santiago, puerta de entrada a la Amazonía sur del Ecuador.', historia: 'Macas fue fundada en 1559 como una de las primeras ciudades españolas en la Amazonía.', altitud: 1050, temperatura_min: 18, temperatura_max: 28, poblacion: 30000, distincion: 'Capital amazónica' },
  { nombre: 'Manta', slug: 'manta', provincia: 'Manabí', descripcion: 'Ciudad portuaria y turística de Manabí, conocida por su playa, el aeropuerto internacional y el Festival del Boniato.', historia: 'Manta fue un importante centro ceremonial precolombino de la cultura manteña. Hoy es la segunda ciudad más importante de Manabí.', altitud: 7, temperatura_min: 23, temperatura_max: 30, poblacion: 250000, distincion: 'Ciudad portuaria' },
  { nombre: 'Milagro', slug: 'milagro', provincia: 'Guayas', descripcion: 'Ciudad de la provincia de Guayas, conocida por su feria provincial y producción de banano.', historia: 'Milagro fue fundada en 1784. Su nombre proviene de un supuesto hallazgo de una imagen de la Virgen del Milagro.', altitud: 10, temperatura_min: 24, temperatura_max: 32, poblacion: 120000, distincion: 'Ciudad del banano' },
  { nombre: 'Montañita', slug: 'montanita', provincia: 'Guayas', descripcion: 'Pueblo surfista en la costa de Guayas, destino popular de surf, fiesta y ambiente relajado.', historia: 'Montañita era un pequeño pueblo pesquero hasta que los surfistas descubrieron sus olas perfectas en los años 80.', altitud: 5, temperatura_min: 24, temperatura_max: 30, poblacion: 5000, distincion: 'Capital del surf' },
  { nombre: 'Nueva Loja', slug: 'nueva-loja', provincia: 'Sucumbíos', descripcion: 'Ciudad petrolera en Sucumbíos, puerta de entrada al Parque Nacional Cuyabeno.', historia: 'Nueva Loja fue fundada en los años 60 durante el boom petrolero. Es punto de partida para excursiones al Cuyabeno.', altitud: 350, temperatura_min: 22, temperatura_max: 30, poblacion: 25000, distincion: 'Ciudad petrolera' },
  { nombre: 'Otavalo', slug: 'otavalo', provincia: 'Imbabura', descripcion: 'Ciudad indígena del norte, famosa por su mercado de artesanías indígenas declarado Patrimonio Cultural inmaterial.', historia: 'Otavalo es hogar del pueblo Otavalo, famoso por su arte textil y su mercado indígena, el más grande de Sudamérica.', altitud: 2530, temperatura_min: 10, temperatura_max: 20, poblacion: 40000, distincion: 'Mercado indígena' },
  { nombre: 'Puerto Ayora', slug: 'puerto-ayora', provincia: 'Galápagos', descripcion: 'Ciudad principal de las Islas Galápagos, centro de operaciones para el turismo en la isla Santa Cruz.', historia: 'Puerto Ayora es la ciudad más poblada de Galápagos. Alberga la Estación Científica Charles Darwin.', altitud: 10, temperatura_min: 22, temperatura_max: 30, poblacion: 12000, distincion: 'Galápagos' },
  { nombre: 'Puerto Baquerizo Moreno', slug: 'puerto-baquerizo-moreno', provincia: 'Galápagos', descripcion: 'Capital de la provincia de Galápagos, ubicada en la isla San Cristóbal.', historia: 'Puerto Baquerizo Moreno es la capital provincial y segundo centro poblado de Galápagos.', altitud: 15, temperatura_min: 22, temperatura_max: 28, poblacion: 8000, distincion: 'Capital de Galápagos' },
  { nombre: 'Puerto López', slug: 'puerto-lopez', provincia: 'Manabí', descripcion: 'Ciudad costera en Manabí, puerta de entrada al Parque Nacional Machalilla y las playas de los Frailes.', historia: 'Puerto López es la puerta de entrada al Parque Nacional Machalilla.', altitud: 5, temperatura_min: 24, temperatura_max: 30, poblacion: 20000, distincion: 'Puerta de Machalilla' },
  { nombre: 'Puyo', slug: 'puyo', provincia: 'Pastaza', descripcion: 'Ciudad amazónica en Pastaza, puerta de entrada a la selva y las cascadas del Napo.', historia: 'Puyo fue fundada en 1897 como un puesto avanzado de la misión yate.', altitud: 950, temperatura_min: 20, temperatura_max: 30, poblacion: 25000, distincion: 'Puerta de la Amazonía' },
  { nombre: 'Quevedo', slug: 'quevedo', provincia: 'Los Ríos', descripcion: 'Ciudad comercial en Los Ríos, importante centro agrícola y de transformación de banano.', historia: 'Quevedo fue fundada en 1853 y se ha convertido en el centro de distribución de banano más importante del Ecuador.', altitud: 70, temperatura_min: 24, temperatura_max: 32, poblacion: 170000, distincion: 'Capital del banano' },
  { nombre: 'Riobamba', slug: 'riobamba', provincia: 'Chimborazo', descripcion: 'Capital de la provincia de Chimborazo, conocida como la "Ciudad de la Azul", al pie del Chimborazo.', historia: 'Riobamba fue fundada en 1534 y fue la primera capital del Ecuador.', altitud: 2750, temperatura_min: 10, temperatura_max: 20, poblacion: 250000, distincion: 'Ciudad de la Azul' },
  { nombre: 'Salinas', slug: 'salinas', provincia: 'Santa Elena', descripcion: 'Ciudad balneario en la costa de Santa Elena, conocida por su playa, deportes náuticos y vida nocturna.', historia: 'Salinas fue un pequeño pueblo pesquero hasta que se convirtió en el principal balneario del Ecuador.', altitud: 3, temperatura_min: 22, temperatura_max: 28, poblacion: 40000, distincion: 'Capital del Pacífico' },
  { nombre: 'Santa Elena', slug: 'santa-elena', provincia: 'Santa Elena', descripcion: 'Capital de la provincia de Santa Elena, ciudad costera con playas y reserva ecológica.', historia: 'Santa Elena fue fundada en 1898 como parte de la provincia del Guayas.', altitud: 10, temperatura_min: 22, temperatura_max: 28, poblacion: 50000, distincion: 'Península de Santa Elena' },
  { nombre: 'Santo Domingo', slug: 'santo-domingo', provincia: 'Santo Domingo de los Tsáchilas', descripcion: 'Capital de la provincia de Santo Domingo de los Tsáchilas, puerta de entrada entre la costa y la sierra.', historia: 'Santo Domingo fue fundada en 1950 por colonos de la costa.', altitud: 600, temperatura_min: 20, temperatura_max: 30, poblacion: 300000, distincion: 'Puerta entre regiones' },
  { nombre: 'Tena', slug: 'tena', provincia: 'Napo', descripcion: 'Ciudad amazónica en Napo, puerta de entrada al Parque Nacional Sumaco y el río Napo.', historia: 'Tena fue fundada en 1925 como centro de la misión dominica. Es conocida como la "Ciudad del Cacao".', altitud: 500, temperatura_min: 22, temperatura_max: 30, poblacion: 30000, distincion: 'Ciudad del Cacao' },
  { nombre: 'Tulcán', slug: 'tulcan', provincia: 'Carchi', descripcion: 'Capital de la provincia de Carchi, ciudad fronteriza con Colombia conocida por su jardín de dedos de gigante.', historia: 'Tulcán fue fundada en 1628 y es la ciudad más septentrional del Ecuador.', altitud: 2980, temperatura_min: 8, temperatura_max: 18, poblacion: 100000, distincion: 'Frontera norte' },
  { nombre: 'Zamora', slug: 'zamora', provincia: 'Zamora Chinchipe', descripcion: 'Ciudad amazónica en Zamora Chinchipe, puerta de entrada al Parque Nacional Podocarpus y minas de oro.', historia: 'Zamora fue fundada en 1556 como punto de partida de las expediciones al oriente.', altitud: 920, temperatura_min: 18, temperatura_max: 28, poblacion: 20000, distincion: 'Ciudad minera' },
];

async function main() {
  console.log('=== Creando provincias ===');
  const provinciaMap: Record<string, number> = {};

  for (const nombre of provincias) {
    const p = await prisma.provincias.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
    provinciaMap[nombre] = p.id;
  }
  console.log(`${provincias.length} provincias listas.`);

  console.log('\n=== Creando ciudades ===');
  let count = 0;

  for (const data of ciudadesConProvincia) {
    const provinciaId = provinciaMap[data.provincia];
    if (!provinciaId) {
      console.log(`  ${data.slug}: provincia "${data.provincia}" no encontrada, saltando...`);
      continue;
    }

    await prisma.ciudades.upsert({
      where: { slug: data.slug },
      update: {
        nombre: data.nombre,
        provincia_id: provinciaId,
        descripcion: data.descripcion,
        historia: data.historia,
        altitud: data.altitud,
        temperatura_min: data.temperatura_min,
        temperatura_max: data.temperatura_max,
        poblacion: data.poblacion,
        distincion: data.distincion,
      },
      create: {
        nombre: data.nombre,
        slug: data.slug,
        provincia_id: provinciaId,
        descripcion: data.descripcion,
        historia: data.historia,
        altitud: data.altitud,
        temperatura_min: data.temperatura_min,
        temperatura_max: data.temperatura_max,
        poblacion: data.poblacion,
        distincion: data.distincion,
      },
    });
    count++;
    console.log(`  ${data.slug}: OK`);
  }

  console.log(`\n¡Listo! ${provincias.length} provincias, ${count} ciudades creadas.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
