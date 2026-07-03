# Eventos GTM, GA4 y Google Ads

La web ya queda preparada para medición por Google Tag Manager. No hay que tocar
código para conectar Google Ads: solo configurar el contenedor GTM y cargar el ID
en la variable `NEXT_PUBLIC_GTM_ID`.

## Variable necesaria

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Cuando el sitio esté publicado en el dominio real, agregar esa variable en Vercel
y redeployar. Si también se instala GTM en WordPress, usar el mismo contenedor o
documentar cuál contenedor mide cada propiedad.

## Eventos disponibles

### `generate_lead`

Evento estándar recomendado para GA4 y Google Ads. Se dispara solo cuando el
formulario se guarda correctamente.

Campos:

- `method`: `lead_form`
- `treatment`
- `page`

Uso recomendado:

- Marcar como conversión principal en GA4.
- Importar esa conversión desde Google Ads o disparar una etiqueta de conversión
  de Google Ads desde GTM.

### `lead_form_submit`

Se dispara después de intentar guardar el formulario, tanto si sale bien como si
falla.

Campos:

- `status`: `saved` o `error`
- `treatment`
- `page`

Uso recomendado:

- Crear un trigger en GTM para `lead_form_submit`.
- Filtrar `status equals saved` si se quiere usar como conversión.
- Usarlo también para depurar errores de formularios.

### `whatsapp_click`

Se dispara cuando el usuario hace clic en un CTA de WhatsApp.

Campos:

- `location`: por ejemplo `navbar_cta`, `hero_cta`, `lead_form`,
  `compact_lead_form`, `about_cta`, `footer_link`, `floating_button`
- `treatment`: cuando aplica
- `page`: cuando aplica

Uso recomendado:

- Conversión secundaria.
- Audiencia de remarketing.

### `treatment_interest`

Se dispara cuando el usuario abre una página de tratamiento desde la grilla o el
footer.

Campos:

- `treatment`
- `slug`
- `location`: `treatments_grid` o `footer`

Uso recomendado:

- Audiencias por interés de tratamiento.
- Medición de tratamientos más consultados.

## Configuración recomendada en GTM

1. Crear etiqueta de GA4 Configuration con el Measurement ID de GA4.
2. Crear eventos GA4:
   - `generate_lead`
   - `lead_form_submit`
   - `whatsapp_click`
   - `treatment_interest`
3. Crear trigger de Custom Event para cada nombre de evento.
4. Marcar `generate_lead` como conversión en GA4.
5. Vincular GA4 con Google Ads e importar la conversión `generate_lead`.
6. Opcional: crear una conversión secundaria para `whatsapp_click`.

## Configuración directa de Google Ads desde GTM

Si no quieren importar conversiones desde GA4, pueden crear una etiqueta de
Google Ads Conversion Tracking en GTM:

- Trigger: Custom Event `generate_lead`
- Conversion ID: provisto por Google Ads
- Conversion Label: provisto por Google Ads

Para WhatsApp:

- Trigger: Custom Event `whatsapp_click`
- Usarlo como conversión secundaria o solo remarketing.

## Prueba final

1. Abrir Tag Assistant.
2. Enviar un formulario de prueba.
3. Confirmar que aparecen:
   - `lead_form_submit`
   - `generate_lead`
   - `whatsapp_click`
4. Confirmar que el lead entra en:
   - panel admin
   - Google Sheets
   - email
5. En GA4 DebugView, confirmar que llega `generate_lead`.
