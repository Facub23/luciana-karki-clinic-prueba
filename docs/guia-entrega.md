# Guia de entrega

## Web publicada

- Dominio principal: `https://dralucianakarki.com`
- `www.dralucianakarki.com` redirige al dominio principal.
- Hosting: Render.
- Dominio/DNS: IONOS.
- SSL: emitido desde Render.

## Accesos que debe conservar la doctora

- IONOS: dominio `dralucianakarki.com`.
- Render: hosting de la web.
- Supabase: base de datos, leads, reservas, contenido y usuarios admin.
- Google Sheets: copia de leads.
- Resend/Gmail: envio y recepcion de emails de leads.
- Panel admin: `https://dralucianakarki.com/admin`.

Recomendacion: que la doctora cambie cualquier contrasena temporal despues de la
entrega.

## Formularios, WhatsApp y leads

La web ya guarda leads en tres lugares:

- Panel admin.
- Google Sheets.
- Email.

Tambien abre WhatsApp con el mensaje preparado para contacto comercial.

Prueba recomendada antes de entregar:

1. Entrar a `https://dralucianakarki.com`.
2. Enviar un formulario de prueba.
3. Confirmar que aparece en el panel admin.
4. Confirmar que llega a Google Sheets.
5. Confirmar que llega el email.
6. Confirmar que WhatsApp abre con el mensaje correcto.

## Google Tag Manager

La web nueva ya tiene el codigo preparado. Solo falta cargar el ID real:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Pasos en Render:

1. Entrar a Render.
2. Abrir el servicio de la web.
3. Ir a `Environment`.
4. Buscar `NEXT_PUBLIC_GTM_ID`.
5. Poner el ID real, por ejemplo `GTM-ABC1234`.
6. Guardar con `Save, rebuild, and deploy`.
7. Esperar a que termine el deploy.
8. Probar con Tag Assistant.

## Como instalar GTM en WordPress

Esto solo aplica si tambien quieren medir una web antigua hecha en WordPress.
La web nueva no usa WordPress.

Opcion recomendada con Site Kit:

1. Entrar al panel de WordPress como administrador.
2. Ir a `Plugins > Anadir nuevo`.
3. Buscar `Site Kit by Google`.
4. Instalar y activar.
5. Conectar la cuenta de Google.
6. Activar Tag Manager.
7. Seleccionar el contenedor GTM correcto.
8. Guardar.
9. Probar con Tag Assistant.

Opcion con plugin GTM:

1. Entrar al panel de WordPress como administrador.
2. Ir a `Plugins > Anadir nuevo`.
3. Buscar un plugin tipo `Google Tag Manager`.
4. Instalar y activar.
5. Pegar el ID `GTM-XXXXXXX`.
6. Guardar.
7. Probar con Tag Assistant.

Importante: no instalar el mismo GTM dos veces en la misma web.

## Google Ads

La conexion se hace desde GTM:

1. Crear o abrir la cuenta de Google Ads.
2. Crear una conversion para formulario enviado.
3. Copiar `Conversion ID` y `Conversion Label`.
4. En GTM, crear etiqueta `Google Ads Conversion Tracking`.
5. Usar como trigger el evento `generate_lead`.
6. Publicar el contenedor.
7. Probar con Tag Assistant.

Tambien se puede importar la conversion desde GA4 si prefieren centralizar la
medicion en Analytics.

## Search Console

Pasos recomendados:

1. Entrar a Google Search Console.
2. Crear propiedad para `dralucianakarki.com`.
3. Verificar el dominio con DNS en IONOS o verificar URL con etiqueta/archivo.
4. Enviar sitemap:

```text
https://dralucianakarki.com/sitemap.xml
```

5. Pedir indexacion de la home y paginas principales.

## Checklist final de entrega

- Dominio carga correctamente.
- SSL activo.
- `www` redirige al dominio principal.
- Formulario probado.
- WhatsApp probado.
- Panel admin probado.
- Google Sheets probado.
- Email de leads probado.
- Acceso admin entregado.
- Guia entregada.
- GTM pendiente solo del ID real, si aun no lo pasaron.
- Google Ads pendiente de conversiones, si aun no tienen cuenta o campanas.
