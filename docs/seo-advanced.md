# SEO avanzado

La web incluye una capa SEO profesional:

- Metadata global avanzada.
- Metadata por tratamiento.
- Canonical URLs.
- OpenGraph y Twitter cards.
- `sitemap.xml` dinamico.
- `robots.txt` dinamico.
- JSON-LD para `MedicalClinic`.
- JSON-LD por tratamiento como `MedicalProcedure`.

## Dominio oficial

```env
NEXT_PUBLIC_SITE_URL=https://dralucianakarki.com
```

Esta variable ya esta configurada en Render. Si algun dia cambia el dominio,
hay que actualizarla y redeployar.

## Rutas generadas

- `https://dralucianakarki.com/sitemap.xml`
- `https://dralucianakarki.com/robots.txt`
- `https://dralucianakarki.com/tratamientos/[slug]`

## Pendiente manual para SEO

- Crear propiedad en Google Search Console.
- Verificar el dominio o la URL.
- Enviar `https://dralucianakarki.com/sitemap.xml`.
- Conectar GA4 y Google Ads desde GTM.
- Revisar rendimiento cuando Google empiece a indexar.
