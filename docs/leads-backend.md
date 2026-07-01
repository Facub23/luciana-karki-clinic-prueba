# Leads backend

El formulario envía cada solicitud a `/api/leads` antes de abrir WhatsApp.

## Qué hace ahora

- Valida nombre, teléfono, tratamiento y mensaje.
- Bloquea envíos automatizados con un campo honeypot invisible.
- Limita envíos repetidos por IP para reducir spam.
- Guarda datos de origen, landing page, referrer y campañas UTM.
- Envía el lead a Google Sheets mediante `GOOGLE_SHEETS_WEBHOOK_URL`.
- Envía un aviso por email cuando `RESEND_API_KEY` y
  `LEAD_NOTIFICATION_EMAIL_TO` están configurados.
- Si Google Sheets falla, la respuesta del formulario sigue siendo correcta y
  el paciente puede continuar por WhatsApp.

## Flujo recomendado

1. Google Sheets guarda la base ordenada de leads.
2. Email avisa de inmediato cada consulta, incluso cuando Sheets funciona.
3. El futuro panel admin debe leer de una fuente persistente, como base de datos,
   CRM o Google Sheets, no de archivos locales de Vercel.

## Variables de entorno

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/...
RESEND_API_KEY=re_...
LEAD_NOTIFICATION_EMAIL_TO=clinica@dominio.com
LEAD_NOTIFICATION_EMAIL_FROM="Dra. Luciana Karki <noreply@dominio.com>"
```

`LEAD_NOTIFICATION_EMAIL_TO` acepta varios correos separados por coma.

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
