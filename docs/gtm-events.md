# Google Tag Manager, GA4 y Google Ads

La web ya esta preparada para medicion por Google Tag Manager. No hace falta
tocar codigo para conectar GA4 o Google Ads: solo hay que cargar el ID del
contenedor GTM en Render.

## Variable necesaria en Render

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Ruta en Render:

1. Abrir el servicio `luciana-karki-clinic-prueba`.
2. Entrar en `Environment`.
3. Editar o agregar `NEXT_PUBLIC_GTM_ID`.
4. Guardar con `Save, rebuild, and deploy`.
5. Esperar a que el deploy termine.

El dominio oficial de la web es:

```text
https://dralucianakarki.com
```

## Eventos disponibles

### `generate_lead`

Evento principal recomendado para GA4 y Google Ads. Se dispara solo cuando el
formulario se guarda correctamente.

Campos:

- `method`: `lead_form`
- `treatment`
- `page`

Uso recomendado:

- Marcar como conversion principal en GA4.
- Importar esa conversion desde Google Ads o disparar una etiqueta de
  conversion de Google Ads desde GTM.

### `lead_form_submit`

Se dispara despues de intentar guardar el formulario, tanto si sale bien como si
falla.

Campos:

- `status`: `saved` o `error`
- `treatment`
- `page`

Uso recomendado:

- Crear un trigger en GTM para `lead_form_submit`.
- Filtrar `status equals saved` si se quiere usar como conversion.
- Usarlo tambien para depurar errores de formularios.

### `whatsapp_click`

Se dispara cuando el usuario hace clic en un CTA de WhatsApp.

Campos:

- `location`: por ejemplo `navbar_cta`, `hero_cta`, `lead_form`,
  `compact_lead_form`, `about_cta`, `footer_link`, `floating_button`
- `treatment`: cuando aplica
- `page`: cuando aplica

Uso recomendado:

- Conversion secundaria.
- Audiencia de remarketing.

### `treatment_interest`

Se dispara cuando el usuario abre una pagina de tratamiento desde la grilla o el
footer.

Campos:

- `treatment`
- `slug`
- `location`: `treatments_grid` o `footer`

Uso recomendado:

- Audiencias por interes de tratamiento.
- Medicion de tratamientos mas consultados.

### `footer_legal_click`

Se dispara cuando el usuario abre enlaces legales del footer.

Uso recomendado:

- Evento informativo, no conversion.

## Configuracion recomendada en GTM

1. Crear una etiqueta de GA4 Configuration con el Measurement ID de GA4.
2. Crear triggers de tipo `Custom Event` para:
   - `generate_lead`
   - `lead_form_submit`
   - `whatsapp_click`
   - `treatment_interest`
3. Crear etiquetas GA4 Event para esos eventos.
4. Marcar `generate_lead` como conversion en GA4.
5. Vincular GA4 con Google Ads.
6. Importar la conversion `generate_lead` en Google Ads.
7. Opcional: usar `whatsapp_click` como conversion secundaria.

## Configuracion directa de Google Ads desde GTM

Si prefieren no importar conversiones desde GA4, crear una etiqueta de Google
Ads Conversion Tracking en GTM:

- Trigger: Custom Event `generate_lead`
- Conversion ID: provisto por Google Ads
- Conversion Label: provisto por Google Ads

Para WhatsApp:

- Trigger: Custom Event `whatsapp_click`
- Usarlo como conversion secundaria o solo para remarketing.

## WordPress

La web nueva no depende de WordPress. Si existe una web antigua en WordPress y
tambien quieren medirla, instalar alli el mismo contenedor GTM o documentar que
contenedor mide cada web.

Recomendacion:

- Web nueva en Render: usar `NEXT_PUBLIC_GTM_ID`.
- WordPress antiguo: instalar GTM con Site Kit o un plugin de GTM.
- Evitar duplicar el mismo GTM dos veces en la misma web.

## Prueba final

1. Abrir Tag Assistant.
2. Conectar con `https://dralucianakarki.com`.
3. Enviar un formulario de prueba.
4. Confirmar que aparecen:
   - `lead_form_submit`
   - `generate_lead`
   - `whatsapp_click`, si se abre WhatsApp
5. Confirmar que el lead entra en:
   - panel admin
   - Google Sheets
   - email
6. En GA4 DebugView, confirmar que llega `generate_lead`.
