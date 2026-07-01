# Configurar Google Sheets para leads

Este flujo conecta el formulario de la web con una hoja de Google Sheets.

## 1. Crear la hoja

1. Abre Google Sheets.
2. Crea una hoja nueva.
3. Nómbrala, por ejemplo: `Leads Dra Luciana`.
4. No hace falta crear columnas manualmente: el script las crea solo.

## 2. Crear Apps Script

1. En la hoja, ve a `Extensiones` > `Apps Script`.
2. Borra el contenido inicial.
3. Copia el contenido de:

```txt
docs/google-apps-script-leads.js
```

4. Pégalo en Apps Script.
5. Guarda el proyecto.

## 3. Publicar como Web App

1. Haz clic en `Implementar` > `Nueva implementación`.
2. En tipo de implementación, elige `Aplicación web`.
3. Configura:
   - Ejecutar como: `Yo`
   - Quién tiene acceso: `Cualquier persona`
4. Haz clic en `Implementar`.
5. Autoriza los permisos si Google lo solicita.
6. Copia la URL de la aplicación web.

## 4. Configurar la web

En `.env.local` o en las variables del hosting, agrega:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXX/exec
```

Luego reinicia el servidor local:

```bash
npm run dev
```

## 5. Probar

1. Abre la web.
2. Completa el formulario con un dato real o de prueba.
3. Confirma que se abre WhatsApp.
4. Revisa que el lead aparezca en la hoja `Leads`.

## Datos que se guardan

- Fecha
- Nombre
- Teléfono
- Tratamiento
- Página
- Landing page
- Referrer
- Mensaje
- Origen
- UTM source
- UTM medium
- UTM campaign
- UTM term
- UTM content
- IP
- User Agent
- ID

## Si el script ya estaba instalado

Si la web ya estaba conectada a Google Sheets con una versión anterior, reemplaza
el código de Apps Script por el contenido actualizado de:

```txt
docs/google-apps-script-leads.js
```

Después publica una nueva implementación y usa la nueva URL `/exec` en Vercel.
