# Configurar Google Sheets para leads

Este flujo conecta el formulario de la web con una hoja de Google Sheets.

## 1. Crear la hoja

1. Abre Google Sheets.
2. Crea una hoja nueva.
3. Nómbrala, por ejemplo: `Leads Dra Luciana`.
4. No hace falta crear columnas manualmente: el script las crea solo.

## 2. Crear o actualizar Apps Script

1. En la hoja, ve a `Extensiones` > `Apps Script`.
2. Abre el archivo principal del script.
3. Reemplaza el contenido por el código de:

```txt
docs/google-apps-script-leads.js
```

4. Guarda el proyecto.

El script actualizado también sirve para hojas que ya existen: agrega las
columnas nuevas al final sin borrar las columnas anteriores.

## 3. Publicar como Web App

1. Haz clic en `Implementar` > `Nueva implementación`.
2. En tipo de implementación, elige `Aplicación web`.
3. Configura:
   - Ejecutar como: `Yo`
   - Quién tiene acceso: `Cualquier persona`
4. Haz clic en `Implementar`.
5. Autoriza los permisos si Google lo solicita.
6. Copia la URL de la aplicación web.

Si estás actualizando una implementación existente, también puedes usar
`Administrar implementaciones` > editar > `Nueva versión`.

## 4. Configurar la web

En `.env.local` o en las variables del hosting, agrega:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXX/exec
```

En Vercel, actualiza esa variable en Production y vuelve a desplegar.

## 5. Probar

1. Abre la web.
2. Completa el formulario con un dato real o de prueba.
3. Confirma que se abre WhatsApp.
4. Revisa que el lead aparezca en la hoja `Leads`.
5. Confirma que aparecen las columnas nuevas.

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
