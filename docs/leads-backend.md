# Leads backend

El formulario envía cada solicitud a `/api/leads` antes de abrir WhatsApp.

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

El webhook recibirá un JSON con:

- `id`
- `createdAt`
- `name`
- `phone`
- `treatment`
- `page`
- `message`
- `source`
- `userAgent`

Ver la guía completa en:

```txt
docs/google-sheets-setup.md
```
