/**
 * Script para recibir las confirmaciones de la invitación en una Google
 * Sheet. Agrega una fila por invitado (fecha, nombre, DNI, mayor/menor de
 * edad, requerimiento alimentario, canción sugerida, link de la canción).
 *
 * CÓMO USARLO (primera vez):
 * 1. Creá una Google Sheet nueva (podés ponerle título "Invitados M15").
 * 2. Menú Extensiones > Apps Script.
 * 3. Borrá el código de ejemplo que trae y pegá TODO este archivo.
 * 4. Guardá (ícono de disquete o Ctrl/Cmd+S).
 * 5. Botón "Implementar" (arriba a la derecha) > "Nueva implementación".
 * 6. Tipo: "Aplicación web".
 *    - Ejecutar como: Yo (tu cuenta).
 *    - Quién tiene acceso: Cualquier usuario.
 * 7. Implementar. Google va a pedir autorizar permisos — como es tu propio
 *    script, vas a ver un aviso de "app no verificada": hacé clic en
 *    "Avanzado" y luego en "Ir a [nombre del proyecto] (no seguro)". Es
 *    seguro porque el código es el que vos mismo pegaste.
 * 8. Copiá la URL que termina en "/exec".
 * 9. Pegala en tu archivo .env como:
 *      VITE_GOOGLE_SHEETS_URL=esa_url_que_copiaste
 * 10. Reiniciá el servidor de desarrollo (o volvé a hacer build) para que
 *     tome la variable nueva.
 *
 * CÓMO ACTUALIZAR EL CÓDIGO SI YA LO TENÉS PUBLICADO (como ahora, que
 * se agregó la columna de mayor/menor de edad):
 * 1. Abrí tu Google Sheet > Extensiones > Apps Script.
 * 2. Reemplazá todo el código por el de este archivo (el de acá abajo).
 * 3. Guardá.
 * 4. Botón "Implementar" > "Gestionar implementaciones".
 * 5. Hacé clic en el ícono de lápiz (editar) de tu implementación activa.
 * 6. En "Versión" elegí "Nueva versión" y guardá/implementá.
 *    (Esto actualiza el código SIN cambiar la URL /exec que ya tenés
 *    puesta en tu .env — no hace falta tocar nada más.)
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  const guests = data.guests || [];
  const timestamp = new Date();

  guests.forEach(function (guest) {
    sheet.appendRow([
      timestamp,
      guest.fullName || '',
      guest.dni || '',
      guest.ageGroup || '',
      guest.dietary || '',
      guest.song || '',
      guest.songLink || '',
    ]);
  });

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}
