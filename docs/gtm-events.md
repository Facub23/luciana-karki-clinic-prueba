# Eventos GTM

La web empuja eventos a `window.dataLayer` aunque el contenedor GTM todavía no
esté configurado. Cuando se agregue `NEXT_PUBLIC_GTM_ID`, GTM podrá escucharlos.

## Eventos disponibles

### `lead_form_submit`

Se dispara después de intentar guardar el formulario.

Campos:

- `status`: `saved` o `error`
- `treatment`
- `page`

### `whatsapp_click`

Se dispara cuando el usuario hace clic en un CTA de WhatsApp.

Campos:

- `location`: por ejemplo `navbar_cta`, `hero_cta`, `lead_form`,
  `compact_lead_form`, `about_cta`, `footer_link`, `floating_button`
- `treatment`: cuando aplica
- `page`: cuando aplica

### `treatment_interest`

Se dispara cuando el usuario abre una página de tratamiento desde la grilla o el
footer.

Campos:

- `treatment`
- `slug`
- `location`: `treatments_grid` o `footer`

## Eventos recomendados en GA4

- Conversión principal: `lead_form_submit` con `status = saved`
- Conversión secundaria: `whatsapp_click`
- Interés por tratamiento: `treatment_interest`
