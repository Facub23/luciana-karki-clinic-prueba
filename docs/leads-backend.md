# Leads backend

El formulario envía cada solicitud a `/api/leads` antes de abrir WhatsApp.

## Qué hace ahora

- Valida nombre, teléfono, tratamiento y mensaje.
- Bloquea envíos automatizados con un campo honeypot invisible.
- Limita envíos repetidos por IP para reducir spam.
- Guarda datos de origen, landing page, referrer y campañas UTM.
- Guarda el lead en Supabase cuando `SUPABASE_URL` y
  `SUPABASE_SERVICE_ROLE_KEY` están configurados.
- Envía el lead a Google Sheets mediante `GOOGLE_SHEETS_WEBHOOK_URL`.
- Envía un aviso por email cuando `RESEND_API_KEY` y
  `LEAD_NOTIFICATION_EMAIL_TO` están configurados.
- Si Google Sheets falla, la respuesta del formulario sigue siendo correcta y
  el paciente puede continuar por WhatsApp.

## Flujo recomendado

1. Supabase guarda la base principal de leads.
2. Google Sheets guarda una copia operativa para trabajo rápido.
3. Email avisa de inmediato cada consulta, incluso cuando Supabase y Sheets
   funcionan.
4. El futuro panel admin debe leer desde Supabase.

## Variables de entorno

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/...
RESEND_API_KEY=re_...
LEAD_NOTIFICATION_EMAIL_TO=clinica@dominio.com
LEAD_NOTIFICATION_EMAIL_FROM="Dra. Luciana Karki <noreply@dominio.com>"
SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`LEAD_NOTIFICATION_EMAIL_TO` acepta varios correos separados por coma.

## Supabase

Antes de activar el panel admin, crea la tabla principal ejecutando este archivo
en `SQL Editor` de Supabase:

```txt
docs/supabase-leads-schema.sql
```

La tabla `public.leads` queda con RLS activado y sin acceso público directo. El
backend usa `SUPABASE_SERVICE_ROLE_KEY` solo desde el servidor para insertar
leads.

## Modo desarrollo

Si `GOOGLE_SHEETS_WEBHOOK_URL` no está configurado, los leads se guardan en:

```txt
data/leads.json
```

La carpeta `data/` está ignorada por Git para no subir datos personales.

## Google Sheets

Para guardar leads en Google Sheets, crea un webhook con Google Apps Script y
configura:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/...
```

El webhook recibe un JSON con:

- `id`
- `createdAt`
- `name`
- `phone`
- `treatment`
- `page`
- `landingPage`
- `referrer`
- `message`
- `source`
- `utmSource`
- `utmMedium`
- `utmCampaign`
- `utmTerm`
- `utmContent`
- `ip`
- `userAgent`

Ver la guía completa en:

```txt
docs/google-sheets-setup.md
```
