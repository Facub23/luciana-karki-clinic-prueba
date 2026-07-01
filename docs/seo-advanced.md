# SEO avanzado

La web incluye una capa SEO profesional:

- Metadata global avanzada.
- Metadata por tratamiento.
- Canonical URLs.
- OpenGraph y Twitter cards.
- `sitemap.xml` dinámico.
- `robots.txt` dinámico.
- JSON-LD para `MedicalClinic`.
- JSON-LD para cada tratamiento como `MedicalProcedure`.

## Dominio

Antes de publicar, configurar:

```env
NEXT_PUBLIC_SITE_URL=https://dominio-final.com
```

Si no se configura, el sitio usa un dominio placeholder.

## Rutas generadas

- `/sitemap.xml`
- `/robots.txt`
- `/tratamientos/[slug]`

## Pendiente manual

- Confirmar dominio final.
- Confirmar textos finales con la doctora.
- Confirmar precios reales.
- Confirmar imágenes definitivas para compartir en redes.
- Enviar `/sitemap.xml` a Google Search Console después de publicar.
