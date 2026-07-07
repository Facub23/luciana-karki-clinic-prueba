# Guia para vincular GTM, Analytics, Google Ads y Search Console

Esta guia es para el equipo de la doctora. La web ya esta preparada
tecnicamente; solo falta que ellos creen o conecten sus cuentas de Google.

## Datos de la web

- Dominio principal: `https://dralucianakarki.com`
- Sitemap: `https://dralucianakarki.com/sitemap.xml`
- Panel admin: `https://dralucianakarki.com/admin`
- Hosting: Render
- Dominio/DNS: IONOS

## 1. Google Tag Manager

Google Tag Manager es el contenedor donde se instalan Analytics, Google Ads y
eventos de conversion sin tocar codigo.

Pasos:

1. Entrar a `https://tagmanager.google.com/`.
2. Crear una cuenta nueva o usar una existente.
3. Nombre de cuenta recomendado: `Dra. Luciana Karki Martin`.
4. Pais: Espana.
5. Crear un contenedor web.
6. Nombre del contenedor recomendado: `dralucianakarki.com`.
7. Tipo de plataforma: `Web`.
8. Crear.
9. Copiar el ID que empieza por `GTM-`, por ejemplo `GTM-ABC1234`.
10. Pasarnos ese ID para cargarlo en Render.

Importante: no tienen que copiar codigos manualmente en la web. Solo deben
pasarnos el ID `GTM-XXXXXXX`.

## 2. Google Analytics 4

GA4 sirve para medir visitas, paginas vistas, eventos y conversiones.

Pasos:

1. Entrar a `https://analytics.google.com/`.
2. Crear una propiedad nueva de GA4.
3. Nombre recomendado: `Dra. Luciana Karki - Web`.
4. Zona horaria: Espana.
5. Moneda: EUR.
6. Crear flujo de datos tipo `Web`.
7. URL del sitio: `https://dralucianakarki.com`.
8. Nombre del flujo: `Web principal`.
9. Copiar el Measurement ID, por ejemplo `G-XXXXXXXXXX`.
10. Entrar a Google Tag Manager.
11. Crear una etiqueta de Google Analytics.
12. Pegar el Measurement ID.
13. Activar la etiqueta en todas las paginas.
14. Publicar el contenedor.

Eventos recomendados para marcar como conversion:

- `generate_lead`: formulario enviado correctamente.
- `whatsapp_click`: clic en WhatsApp, como conversion secundaria.

## 3. Google Ads

Google Ads sirve para hacer campanas y medir conversiones.

Pasos:

1. Entrar a `https://ads.google.com/`.
2. Crear o abrir la cuenta de Google Ads.
3. Vincular Google Ads con Google Analytics:
   - En Google Ads, ir a Herramientas.
   - Entrar en cuentas vinculadas.
   - Buscar Google Analytics.
   - Vincular la propiedad GA4 de la web.
4. Crear conversion de formulario:
   - Ir a Objetivos o Conversiones.
   - Crear nueva conversion.
   - Elegir sitio web.
   - Dominio: `dralucianakarki.com`.
   - Conversion recomendada: formulario enviado.
5. Opcion recomendada:
   - Importar la conversion `generate_lead` desde GA4.
6. Opcion alternativa:
   - Crear una etiqueta de conversion de Google Ads en GTM.
   - Usar como disparador el evento `generate_lead`.

Conversiones recomendadas:

- Principal: `generate_lead`.
- Secundaria: `whatsapp_click`.

## 4. Google Search Console

Search Console sirve para indexacion, SEO y estado de busqueda en Google.

Pasos:

1. Entrar a `https://search.google.com/search-console`.
2. Crear propiedad nueva.
3. Opcion recomendada: `Dominio`.
4. Dominio: `dralucianakarki.com`.
5. Google dara un registro TXT para verificar.
6. Ese TXT se debe agregar en IONOS, dentro del DNS del dominio.
7. Esperar la verificacion.
8. Cuando este verificado, ir a `Sitemaps`.
9. Enviar:

```text
https://dralucianakarki.com/sitemap.xml
```

10. Pedir indexacion de:

- `https://dralucianakarki.com`
- Paginas principales de tratamientos.

## 5. Como probar que todo funciona

Despues de vincular GTM:

1. Abrir `https://tagassistant.google.com/`.
2. Conectar con `https://dralucianakarki.com`.
3. Navegar por la web.
4. Enviar un formulario de prueba.
5. Confirmar que aparecen estos eventos:
   - `lead_form_submit`
   - `generate_lead`
   - `whatsapp_click`, si se hace clic en WhatsApp
6. En GA4, abrir DebugView y confirmar que llegan los eventos.
7. En Google Ads, revisar que la conversion quede activa.

## 6. Que deben enviarnos

Para dejarlo instalado en la web, necesitamos solo:

```text
ID de Google Tag Manager: GTM-XXXXXXX
```

Opcional, si quieren que tambien ayudemos a revisar conversiones:

```text
Measurement ID de GA4: G-XXXXXXXXXX
Conversion ID de Google Ads: AW-XXXXXXXXX
Conversion Label de Google Ads: XXXXXXXXX
```

## 7. Importante sobre WordPress

La web nueva no esta hecha en WordPress. Esta publicada en Render.

Solo necesitan acceso a WordPress si quieren medir una web antigua que siga
existiendo en WordPress.

Para la web nueva:

- No hace falta WordPress.
- No hace falta instalar plugins.
- Solo hace falta cargar el ID de GTM en Render.

Si tambien quieren instalar GTM en WordPress:

1. Entrar al admin de WordPress.
2. Instalar `Site Kit by Google` o un plugin de Google Tag Manager.
3. Conectar el mismo contenedor GTM.
4. Verificar con Tag Assistant.

No instalar el mismo GTM dos veces en la misma web.
