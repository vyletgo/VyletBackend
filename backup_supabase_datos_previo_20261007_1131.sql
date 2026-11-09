--
-- PostgreSQL database dump
--

\restrict I1GuHpSjigDJvAyEfVqC1NoBEFPMxPnJ4vHi0q2hoGapkQOggaZy4fszeqcjYAJ

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: cargos_empresa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cargos_empresa (id, nombre, descripcion, activo) FROM stdin;
\.


--
-- Data for Name: categorias_evento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categorias_evento (id, nombre, descripcion, activo) FROM stdin;
\.


--
-- Data for Name: categorias_negocio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categorias_negocio (id, nombre, descripcion, icono, color, permite_productos, permite_reservas, permite_habitaciones, permite_mesas, permite_canchas, activo, fecha_creacion) FROM stdin;
1	Restaurante				t	t	f	f	f	t	2026-09-23 11:42:10.637
\.


--
-- Data for Name: categorias_producto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categorias_producto (id, nombre, descripcion, activo) FROM stdin;
\.


--
-- Data for Name: provincias; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.provincias (id, nombre, descripcion, activo, fecha_creacion, imagen) FROM stdin;
1	Azuay	\N	t	2026-09-22 22:15:52.586	\N
2	Bolívar	\N	t	2026-09-22 22:15:53.107	\N
3	Cañar	\N	t	2026-09-22 22:15:53.613	\N
4	Carchi	\N	t	2026-09-22 22:15:54.116	\N
5	Chimborazo	\N	t	2026-09-22 22:15:54.62	\N
6	Cotopaxi	\N	t	2026-09-22 22:15:55.122	\N
7	El Oro	\N	t	2026-09-22 22:15:55.623	\N
8	Esmeraldas	\N	t	2026-09-22 22:15:56.125	\N
9	Guayas	\N	t	2026-09-22 22:15:56.627	\N
10	Imbabura	\N	t	2026-09-22 22:15:57.127	\N
11	Loja	\N	t	2026-09-22 22:15:57.634	\N
12	Los Ríos	\N	t	2026-09-22 22:15:58.134	\N
13	Manabí	\N	t	2026-09-22 22:15:58.636	\N
14	Morona Santiago	\N	t	2026-09-22 22:15:59.139	\N
15	Napo	\N	t	2026-09-22 22:15:59.653	\N
16	Orellana	\N	t	2026-09-22 22:16:00.171	\N
17	Pastaza	\N	t	2026-09-22 22:16:00.673	\N
18	Pichincha	\N	t	2026-09-22 22:16:01.174	\N
19	Santa Elena	\N	t	2026-09-22 22:16:01.675	\N
20	Santo Domingo de los Tsáchilas	\N	t	2026-09-22 22:16:02.175	\N
21	Sucumbíos	\N	t	2026-09-22 22:16:02.675	\N
22	Tungurahua	\N	t	2026-09-22 22:16:03.175	\N
23	Zamora Chinchipe	\N	t	2026-09-22 22:16:03.675	\N
24	Galápagos	\N	t	2026-09-22 22:16:04.174	\N
\.


--
-- Data for Name: ciudades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ciudades (id, provincia_id, nombre, slug, descripcion, historia, imagen_principal, latitud, longitud, altitud, temperatura_min, temperatura_max, poblacion, distincion, es_turistica, activo, fecha_creacion) FROM stdin;
2	9	Guayaquil	guayaquil	La ciudad más grande y poblada de Ecuador, principal puerto marítimo y centro comercial del país.	Fundada en 1537 por Francisco de Orellana, Guayaquil ha sido testigo de numerosas transformaciones. Su Malecón 2000 es uno de los paseos ribereños más emblemáticos de Sudamérica.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868141/vylet/general/dfc1yszesy9k0emngke0.jpg	\N	\N	4	24	32	2700000	Puerto principal	f	t	2026-09-22 22:16:04.603
5	11	Loja	loja	Ciudad cultural de Ecuador, conocida por su música, poesía y como puerta de entrada al Parque Nacional Podocarpus.	Loja fue fundada en 1546 por Carlos Arias de los Ríos. Ha sido cuna de grandes músicos, poetas y escritores ecuatorianos, ganándose el título de "Ciudad Musical".	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868901/vylet/general/neumbmcl39hiypdl3yue.jpg	\N	\N	2060	14	22	250000	Ciudad Musical	f	t	2026-09-22 22:16:04.915
6	7	Machala	machala	Capital bananera del mundo, ciudad portuaria ubicada en la costa sur de Ecuador con acceso a las islas Galápagos.	Machala fue fundada en 1549 y ha crecido como centro agrícola y comercial. Su economía se basa principalmente en el banano, cacao y arroz.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868810/vylet/general/z0badz7awq5aadeiurha.jpg	\N	\N	5	24	31	300000	Capital bananera	f	t	2026-09-22 22:16:05.019
7	13	Portoviejo	portoviejo	Capital de la provincia de Manabí, ciudad agrícola y comercial con una rica tradición cultural.	Fundada en 1535 por Francisco Pacheco, Portoviejo es una de las ciudades más antiguas de la costa ecuatoriana. Su nombre proviene del río que la atraviesa.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869039/vylet/general/jghy3x64xzgwsjerylrh.jpg	\N	\N	60	24	30	250000	Ciudad agrícola	f	t	2026-09-22 22:16:05.123
8	10	Ibarra	ibarra	Ciudad blanca del norte de Ecuador, conocida por su arquitectura colonial y proximidad al lago San Pablo.	Fundada en 1607 por Pedro de Ampudia, Ibarra fue nombrada por el virrey del Perú. Su centro histórico fue restaurado tras el terremoto de 1868.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868872/vylet/general/km5tssj6xzils67oa3lx.jpg	\N	\N	2225	14	22	180000	Ciudad blanca	f	t	2026-09-22 22:16:05.226
10	3	Azogues	azogues	Capital de la provincia de Cañar, ciudad intermedia entre Cuenca y el Austro ecuatoriano.	Azogues fue fundada en 1563 y debe su nombre al mercurio (azogue) que se extraía en la zona. Es conocida por su artesanía en hilo.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868327/vylet/general/dndrxima1mr8ow10wxjv.jpg	\N	\N	2620	12	20	80000	Ciudad del hilo	f	t	2026-09-22 22:16:05.433
11	12	Babahoyo	babahoyo	Capital de la provincia de Los Ríos, ciudad agrícola en el corazón del fértil valle del río Babahoyo.	Babahoyo fue fundada en 1580 por Francisco de Orellana. Su nombre proviene del río Babahoyo. Es centro de la producción arrocera y bananera del Ecuador.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869013/vylet/general/epbyc9yfwdycv13wkt8n.jpg	\N	\N	50	23	32	95000	Puerta del Litoral	f	t	2026-09-22 22:16:05.537
12	13	Bahía de Caráquez	bahia-de-caraquez	Ciudad costera en Manabí, conocida por su malecón, pesca artesanal y proximidad a la Reserva Muisne.	Bahía de Caráquez fue fundada en el siglo XVI y ha sido históricamente un puerto pesquero. Su ecoturismo ha crecido en los últimos años con la protección de manglares.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869166/vylet/general/hjv5qgdbx0ra4ykzhi9x.jpg	\N	\N	10	24	30	35000	Ciudad pesquera	f	t	2026-09-22 22:16:05.64
14	18	Cayambe	cayambe	Ciudad de los Altos al pie del volcán Cayambe, punto de paso hacia las comunidades indígenas del norte.	Cayambe es célebre por el volcán homónimo, el único punto del ecuador terrestre que toca la línea equinoccial. La zona es famosa por su producción de leche y rosas.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868153/vylet/general/habyjtsxo9laftvbsod6.jpg	\N	\N	2830	8	18	40000	Tierra del equinoccio	f	t	2026-09-22 22:16:05.851
15	9	Durán	duran	Ciudad satélite de Guayaquil, conectada por el Puente de la Unidad Nacional sobre el río Guayas.	Durán fue fundada en 1878 como estación del ferrocarril. Su crecimiento se aceleró con la construcción del Puente de la Unidad Nacional que la conecta con Guayaquil.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868169/vylet/general/rin7setl3pwa5jwxrbgt.jpg	\N	\N	4	24	32	300000	Ciudad puente	f	t	2026-09-22 22:16:05.954
16	8	Esmeraldas	esmeraldas	Capital de la provincia de Esmeraldas, conocida por su costa, cultura afroecuatoriana y el canto de marimba.	Esmeraldas fue fundada en 1526 por Bartolomé Ruiz. La zona es cuna de la cultura afroecuatoriana, con influencias musicales como el cununú y la marimba.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868823/vylet/general/uaoj17he7itgj1d2o98e.jpg	\N	\N	5	25	30	150000	Costa de esmeraldas	f	t	2026-09-22 22:16:06.058
17	16	Francisco de Orellana	francisco-de-orellana	Ciudad amazónica en la provincia de Orellana, puerta de entrada a la selva y al Parque Nacional Yasuní.	Nombrada en honor al explorador Francisco de Orellana, primer europeo en navegar el río Amazonas. La zona es rica en petróleo y biodiversidad amazónica.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869632/vylet/general/x8zstv1itreuxhqkpdcc.jpg	\N	\N	250	22	32	35000	Puerta del Yasuní	f	t	2026-09-22 22:16:06.161
18	1	Gualaceo	gualaceo	Ciudad del Valle de Gualaceo en la provincia de Azuay, conocida por su artesanía en hilo y tradiciones.	Gualaceo fue fundada en 1570 y es conocida por su artesanía textil, especialmente la "ikát" o pintura de hilos.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868211/vylet/general/bhvrznozeyizuvtbwjy2.jpg	\N	\N	2300	12	22	35000	Ciudad del ikát	f	t	2026-09-22 22:16:06.263
20	6	Latacunga	latacunga	Capital de la provincia de Cotopaxi, ciudad colonial al pie del volcán Cotopaxi, Patrimonio Cultural de la Humanidad.	Latacunga fue fundada en 1584. Su centro histórico fue declarado Patrimonio Cultural de la Humanidad por la UNESCO en 1998.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868798/vylet/general/rjomziqzpysa5v8f0ezi.jpg	\N	\N	2780	10	20	85000	Patrimonio UNESCO	f	t	2026-09-22 22:16:06.469
21	14	Macas	macas	Capital de la provincia de Morona Santiago, puerta de entrada a la Amazonía sur del Ecuador.	Macas fue fundada en 1559 como una de las primeras ciudades españolas en la Amazonía.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869598/vylet/general/osk9j6klk3cxx5tr1uww.jpg	\N	\N	1050	18	28	30000	Capital amazónica	f	t	2026-09-22 22:16:06.574
1	18	Quito	quito	La ciudad más antigua de América del Sur y capital de Ecuador, declarada Patrimonio Cultural de la Humanidad por la UNESCO en 1978.	Fundada por los españoles en 1534 sobre las ruinas de una ciudad inca, Quito conserva uno de los centros históricos mejor preservados del continente. Su arquitectura colonial barroca mezclada con elementos indígenas la convierten en un destino turístico único.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787867688/vylet/general/e2zqqft9ujiyabw2buwt.jpg	\N	\N	2850	12	22	2800000	Patrimonio UNESCO	f	t	2026-09-22 22:16:04.489
3	1	Cuenca	cuenca	Ciudad colonial fundada en 1557, conocida por su arquitectura barroca, ríos y por ser la tercera ciudad más importante del Ecuador.	Cuenca fue fundada por Gil Ramírez Dávalos y debe su nombre a la ciudad española de Cuenca. Su centro histórico fue declarado Patrimonio Cultural de la Humanidad por la UNESCO en 1999.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868198/vylet/general/ay3hfy1ng8m5avuccgas.jpg	\N	\N	2550	10	21	600000	Patrimonio UNESCO	f	t	2026-09-22 22:16:04.708
9	8	Atacames	atacames	Playa volcánica de arena negra en la provincia de Esmeraldas, destino popular de bañistas y surfistas.	Atacames fue escenario de batallas históricas durante la conquista española. Hoy es uno de los balnearios más visitados de la costa ecuatoriana, conocido por su playa de arena negra volcánica.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868834/vylet/general/rbkttvxtecwmjciv4bnw.jpg	\N	\N	3	25	32	35000	Playa de arena negra	f	t	2026-09-22 22:16:05.33
13	22	Baños de Agua Santa	banos-de-agua-santa	Ciudad turística al pie del volcán Tungurahua, famosa por sus aguas termales y deportes de aventura.	Baños debe su nombre a las aguas termales medicinales descubiertas por los españoles. La ciudad ha reconstruido repetidamente tras erupciones del Tungurahua.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869747/vylet/general/ovbdp5vmurjefpcl9m7w.jpg	\N	\N	1820	14	22	20000	Ciudad del Volcán	f	t	2026-09-22 22:16:05.748
19	2	Guaranda	guaranda	Capital de la provincia de Bolívar, conocida como la "Ciudad de las Siete Colinas" y por su festival del Inti Raymi.	Guaranda fue fundada en 1571. Se le conoce como la Ciudad de las Siete Colinas por sus siete cerros.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868314/vylet/general/x95unh04whg9itivv9nh.jpg	\N	\N	2750	10	20	100000	Ciudad de las Siete Colinas	f	t	2026-09-22 22:16:06.366
23	9	Milagro	milagro	Ciudad de la provincia de Guayas, conocida por su feria provincial y producción de banano.	Milagro fue fundada en 1784. Su nombre proviene de un supuesto hallazgo de una imagen de la Virgen del Milagro.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868184/vylet/general/axe7vlp1zvhq6pdbofv6.jpg	\N	\N	10	24	32	120000	Ciudad del banano	f	t	2026-09-22 22:16:06.783
24	9	Montañita	montanita	Pueblo surfista en la costa de Guayas, destino popular de surf, fiesta y ambiente relajado.	Montañita era un pequeño pueblo pesquero hasta que los surfistas descubrieron sus olas perfectas en los años 80.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869707/vylet/general/xuuuddqwopvk9tebxcyf.jpg	\N	\N	5	24	30	5000	Capital del surf	f	t	2026-09-22 22:16:06.887
25	21	Nueva Loja	nueva-loja	Ciudad petrolera en Sucumbíos, puerta de entrada al Parque Nacional Cuyabeno.	Nueva Loja fue fundada en los años 60 durante el boom petrolero. Es punto de partida para excursiones al Cuyabeno.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869733/vylet/general/sgsfwpbuvjgyke5ebl9q.jpg	\N	\N	350	22	30	25000	Ciudad petrolera	f	t	2026-09-22 22:16:06.991
27	24	Puerto Ayora	puerto-ayora	Ciudad principal de las Islas Galápagos, centro de operaciones para el turismo en la isla Santa Cruz.	Puerto Ayora es la ciudad más poblada de Galápagos. Alberga la Estación Científica Charles Darwin.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868860/vylet/general/qpdkcbzdsfbcudxqimmz.jpg	\N	\N	10	22	30	12000	Galápagos	f	t	2026-09-22 22:16:07.199
28	24	Puerto Baquerizo Moreno	puerto-baquerizo-moreno	Capital de la provincia de Galápagos, ubicada en la isla San Cristóbal.	Puerto Baquerizo Moreno es la capital provincial y segundo centro poblado de Galápagos.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868848/vylet/general/a7omq8pyf0rxxos8vtwg.jpg	\N	\N	15	22	28	8000	Capital de Galápagos	f	t	2026-09-22 22:16:07.303
29	13	Puerto López	puerto-lopez	Ciudad costera en Manabí, puerta de entrada al Parque Nacional Machalilla y las playas de los Frailes.	Puerto López es la puerta de entrada al Parque Nacional Machalilla.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869586/vylet/general/xdmou1v9oark4ctockda.jpg	\N	\N	5	24	30	20000	Puerta de Machalilla	f	t	2026-09-22 22:16:07.406
30	17	Puyo	puyo	Ciudad amazónica en Pastaza, puerta de entrada a la selva y las cascadas del Napo.	Puyo fue fundada en 1897 como un puesto avanzado de la misión yate.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869646/vylet/general/nj7ihlbq4rjra4idnvvr.jpg	\N	\N	950	20	30	25000	Puerta de la Amazonía	f	t	2026-09-22 22:16:07.508
32	5	Riobamba	riobamba	Capital de la provincia de Chimborazo, conocida como la "Ciudad de la Azul", al pie del Chimborazo.	Riobamba fue fundada en 1534 y fue la primera capital del Ecuador.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868788/vylet/general/pbkmw9vsd7wqtjjwwphb.jpg	\N	\N	2750	10	20	250000	Ciudad de la Azul	f	t	2026-09-22 22:16:07.716
33	19	Salinas	salinas	Ciudad balneario en la costa de Santa Elena, conocida por su playa, deportes náuticos y vida nocturna.	Salinas fue un pequeño pueblo pesquero hasta que se convirtió en el principal balneario del Ecuador.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869684/vylet/general/v4hm24tdc6xsmsmof9ng.jpg	\N	\N	3	22	28	40000	Capital del Pacífico	f	t	2026-09-22 22:16:07.82
34	19	Santa Elena	santa-elena	Capital de la provincia de Santa Elena, ciudad costera con playas y reserva ecológica.	Santa Elena fue fundada en 1898 como parte de la provincia del Guayas.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869670/vylet/general/yqtpz4tgboblkiblj5ow.jpg	\N	\N	10	22	28	50000	Península de Santa Elena	f	t	2026-09-22 22:16:07.924
36	15	Tena	tena	Ciudad amazónica en Napo, puerta de entrada al Parque Nacional Sumaco y el río Napo.	Tena fue fundada en 1925 como centro de la misión dominica. Es conocida como la "Ciudad del Cacao".	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869612/vylet/general/wmdkzdydbjk96dd5oqtu.jpg	\N	\N	500	22	30	30000	Ciudad del Cacao	f	t	2026-09-22 22:16:08.13
37	4	Tulcán	tulcan	Capital de la provincia de Carchi, ciudad fronteriza con Colombia conocida por su jardín de dedos de gigante.	Tulcán fue fundada en 1628 y es la ciudad más septentrional del Ecuador.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868775/vylet/general/ql1ciiz8kfunzo8mxklv.jpg	\N	\N	2980	8	18	100000	Frontera norte	f	t	2026-09-22 22:16:08.232
38	23	Zamora	zamora	Ciudad amazónica en Zamora Chinchipe, puerta de entrada al Parque Nacional Podocarpus y minas de oro.	Zamora fue fundada en 1556 como punto de partida de las expediciones al oriente.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869758/vylet/general/avs0ybx1bw2ntr67pv4r.jpg	\N	\N	920	18	28	20000	Ciudad minera	f	t	2026-09-22 22:16:08.335
22	13	Manta	manta	Ciudad portuaria y turística de Manabí, conocida por su playa, el aeropuerto internacional y el Festival del Boniato.	Manta fue un importante centro ceremonial precolombino de la cultura manteña. Hoy es la segunda ciudad más importante de Manabí.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869051/vylet/general/fqnom6tpdjpdsiijpapo.jpg	\N	\N	7	23	30	250000	Ciudad portuaria	f	t	2026-09-22 22:16:06.677
26	10	Otavalo	otavalo	Ciudad indígena del norte, famosa por su mercado de artesanías indígenas declarado Patrimonio Cultural inmaterial.	Otavalo es hogar del pueblo Otavalo, famoso por su arte textil y su mercado indígena, el más grande de Sudamérica.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787868889/vylet/general/ar5ppbcoc114bi1uvnyu.jpg	\N	\N	2530	10	20	40000	Mercado indígena	f	t	2026-09-22 22:16:07.096
31	12	Quevedo	quevedo	Ciudad comercial en Los Ríos, importante centro agrícola y de transformación de banano.	Quevedo fue fundada en 1853 y se ha convertido en el centro de distribución de banano más importante del Ecuador.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869026/vylet/general/gjyx1roh4sex40f1bf4m.jpg	\N	\N	70	24	32	170000	Capital del banano	f	t	2026-09-22 22:16:07.613
35	20	Santo Domingo	santo-domingo	Capital de la provincia de Santo Domingo de los Tsáchilas, puerta de entrada entre la costa y la sierra.	Santo Domingo fue fundada en 1950 por colonos de la costa.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787869721/vylet/general/sc51se0lz1oeyavcw5qt.jpg	\N	\N	600	20	30	300000	Puerta entre regiones	f	t	2026-09-22 22:16:08.027
4	22	Ambato	ambato	Conocida como la "Ciudad de las Flores y las Frutas", famosa por su Festival de las Flores y Frutas que se celebra cada febrero.	Ambato fue fundada en 1698 tras un terremoto que destruyó la ciudad anterior. Es cuna de Juan León Mera, autor de la letra del himno nacional ecuatoriano.	https://res.cloudinary.com/dejbqvh2l/image/upload/v1787867811/vylet/general/gc6gvhkutjwpurg0tuhb.jpg	\N	\N	2577	12	21	400000	Ciudad de las Flores	f	t	2026-09-22 22:16:04.811
\.


--
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.empresas (id, categoria_id, nombre, descripcion, logo, email, sitio_web, facebook, instagram, tiktok, propietario, latitud, longitud, verificado, destacado, activo, fecha_creacion, estado, ruc) FROM stdin;
\.


--
-- Data for Name: etiquetas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.etiquetas (id, nombre) FROM stdin;
\.


--
-- Data for Name: planes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.planes (id, nombre, descripcion, precio, cantidad_sucursales, cantidad_empresas, cantidad_productos, permite_publicidad, permite_destacados, permite_cupones, permite_reservas, permite_cartillas, dias_duracion, destacado, activo) FROM stdin;
\.


--
-- Data for Name: suscripciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.suscripciones (id, empresa_id, cedula, plan_id, fecha_inicio, fecha_fin, estado) FROM stdin;
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pagos (id, empresa_id, suscripcion_id, monto, metodo_pago, referencia_pago, estado, fecha_pago) FROM stdin;
\.


--
-- Data for Name: permisos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permisos (id, nombre, descripcion) FROM stdin;
1	configuraciones:ver	configuraciones ver
2	configuraciones:editar	configuraciones editar
3	empresas:ver	empresas ver
4	empresas:editar	empresas editar
5	empresas:crear	empresas crear
6	empresas:eliminar	empresas eliminar
7	usuarios:listar	usuarios listar
8	usuarios:crear	usuarios crear
9	usuarios:ver	usuarios ver
10	usuarios:editar	usuarios editar
11	usuarios:bloquear	usuarios bloquear
12	usuarios:eliminar	usuarios eliminar
13	roles:listar	roles listar
14	roles:asignar	roles asignar
15	permisos:asignar	permisos asignar
16	publicidad:ver	publicidad ver
17	publicidad:editar	publicidad editar
18	sucursales:crear	sucursales crear
19	sucursales:eliminar	sucursales eliminar
20	sucursales:ver	sucursales ver
21	sucursales:editar	sucursales editar
22	productos:ver	productos ver
23	productos:editar	productos editar
24	productos:crear	productos crear
25	productos:eliminar	productos eliminar
26	reservas:ver	reservas ver
27	reservas:editar	reservas editar
28	habitaciones:ver	habitaciones ver
29	habitaciones:editar	habitaciones editar
30	eventos:ver	eventos ver
31	eventos:editar	eventos editar
32	cupones:ver	cupones ver
33	cupones:editar	cupones editar
34	marcas:ver	marcas ver
35	marcas:editar	marcas editar
\.


--
-- Data for Name: permisos_empresa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permisos_empresa (id, nombre, descripcion) FROM stdin;
1	gestionar_productos	Crear y editar productos y servicios
2	gestionar_eventos	Gestionar eventos de la empresa
3	gestionar_reservas	Ver y administrar reservas
4	gestionar_habitaciones	Administrar habitaciones
5	gestionar_cupones	Crear y editar cupones
6	gestionar_publicidad	Crear publicidad para la empresa
7	gestionar_resenas	Moderar reseñas
8	gestionar_empleados	Contratar y gestionar empleados
9	gestionar_reportes	Ver reportes y estadísticas
10	gestionar_informacion	Editar la información de la empresa y sucursales
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, nombre, descripcion, activo, fecha_creacion) FROM stdin;
1	admin	Administrador del sistema	t	2026-09-22 22:23:14.892
2	superadmin	Super administrador	t	2026-09-22 22:23:15.371
3	cliente	Cliente estándar	t	2026-09-22 22:23:15.841
5	empleado_empresa	Empleado de empresa	t	2026-09-22 22:23:16.779
6	gerente	Gerente de plataforma	t	2026-09-22 22:23:17.246
4	dueno_empresa	Dueño de empresa	t	2026-09-22 22:23:16.308
\.


--
-- Data for Name: rol_permisos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rol_permisos (id, rol_id, permiso_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	1	5
6	1	6
7	1	7
8	1	8
9	1	9
10	1	10
11	1	11
12	1	12
13	1	13
14	1	14
15	1	15
16	1	16
17	1	17
18	1	18
19	1	19
20	1	20
21	1	21
22	1	22
23	1	23
24	1	24
25	1	25
26	1	26
27	1	27
28	1	28
29	1	29
30	1	30
31	1	31
32	1	32
33	1	33
34	2	1
35	2	2
36	2	3
37	2	4
38	2	5
39	2	6
40	2	7
41	2	8
42	2	9
43	2	10
44	2	11
45	2	12
46	2	13
47	2	14
48	2	15
49	2	16
50	2	17
51	2	18
52	2	19
53	2	20
54	2	21
55	2	22
56	2	23
57	2	24
58	2	25
59	2	26
60	2	27
61	2	28
62	2	29
63	2	30
64	2	31
65	2	32
66	2	33
67	4	32
68	4	33
69	4	3
70	4	4
71	4	5
72	4	6
73	4	28
74	4	29
75	4	15
76	4	22
77	4	23
78	4	24
79	4	25
80	4	26
81	4	27
82	4	18
83	4	19
84	4	20
85	4	21
86	1	34
87	1	35
88	2	34
89	2	35
\.


--
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.servicios (id, nombre, descripcion, activo) FROM stdin;
\.


--
-- Data for Name: tipos_interes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tipos_interes (id, nombre, descripcion, activo) FROM stdin;
\.


--
-- Name: cargos_empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cargos_empresa_id_seq', 1, false);


--
-- Name: categorias_evento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_evento_id_seq', 1, false);


--
-- Name: categorias_negocio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_negocio_id_seq', 1, true);


--
-- Name: categorias_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_producto_id_seq', 1, false);


--
-- Name: ciudades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ciudades_id_seq', 38, true);


--
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.empresas_id_seq', 1, false);


--
-- Name: etiquetas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.etiquetas_id_seq', 1, false);


--
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pagos_id_seq', 1, false);


--
-- Name: permisos_empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permisos_empresa_id_seq', 10, true);


--
-- Name: permisos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permisos_id_seq', 35, true);


--
-- Name: planes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.planes_id_seq', 1, false);


--
-- Name: provincias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.provincias_id_seq', 24, true);


--
-- Name: rol_permisos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rol_permisos_id_seq', 89, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 6, true);


--
-- Name: servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.servicios_id_seq', 1, false);


--
-- Name: suscripciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.suscripciones_id_seq', 1, false);


--
-- Name: tipos_interes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tipos_interes_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict I1GuHpSjigDJvAyEfVqC1NoBEFPMxPnJ4vHi0q2hoGapkQOggaZy4fszeqcjYAJ

