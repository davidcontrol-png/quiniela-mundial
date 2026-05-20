# Quiniela Mundial 2026 &mdash; Ogilvy El Salvador
## Gu&iacute;a completa de configuraci&oacute;n y despliegue

---

## PASO 1: Crear el proyecto Firebase

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clic en **"Agregar proyecto"** &rarr; nombre: `quiniela-mundial-2026`
3. Desactiva Google Analytics (no lo necesitamos) &rarr; **Crear proyecto**

### 1a. Activar Authentication

- Ir a **Authentication** &rarr; **Comenzar**
- En **M&eacute;todos de inicio de sesi&oacute;n** &rarr; activar **Correo electr&oacute;nico/Contrase&ntilde;a**

### 1b. Crear Firestore

- Ir a **Firestore Database** &rarr; **Crear base de datos**
- Elegir **Modo de producci&oacute;n** &rarr; Regi&oacute;n: `us-central1` &rarr; **Crear**

### 1c. Obtener la configuraci&oacute;n del proyecto

- Ir a **Configuraci&oacute;n del proyecto** (icono engrane) &rarr; tab **General**
- Bajar hasta **"Tus apps"** &rarr; clic **"&lt;/&gt; Web"**
- Registrar app con el nombre `quiniela-web`
- Copiar el objeto `firebaseConfig` que aparece

---

## PASO 2: Configurar el c&oacute;digo

Abre el archivo `js/firebase-config.js` y reemplaza con tus valores:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",          // tu valor
  authDomain:        "quiniela-mundial-2026.firebaseapp.com",
  projectId:         "quiniela-mundial-2026",
  storageBucket:     "quiniela-mundial-2026.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

---

## PASO 3: Obtener API key del Mundial (gratis)

1. Ve a [https://wc2026api.com](https://wc2026api.com)
2. Clic en **"Get Free API Key"** &rarr; llena el formulario
3. Recibir&aacute;s tu key por email (empieza con `wc2026_...`)
4. Abre `js/app.js` y reemplaza:
   ```javascript
   const WC_API_KEY = "TU_WC2026_API_KEY";
   // por:
   const WC_API_KEY = "wc2026_tu_key_aqui";
   ```

---

## PASO 4: Configurar reglas de Firestore

- En Firebase Console &rarr; **Firestore** &rarr; tab **Reglas**
- Copiar y pegar el contenido del archivo `firestore.rules`
- Clic **Publicar**

---

## PASO 5: Crear usuarios (script Python)

### Instalar dependencias
```bash
pip install firebase-admin --break-system-packages
```

### Descargar Service Account Key
- Firebase Console &rarr; **Configuraci&oacute;n del proyecto** &rarr; tab **Cuentas de servicio**
- Clic **"Generar nueva clave privada"** &rarr; guardar como `serviceAccountKey.json`
- Colocar ese archivo en la carpeta ra&iacute;z del proyecto

### Ejecutar el script
```bash
python seed_users.py
```

Esto crea los 70 empleados en Firebase Auth + Firestore con:
- **Usuario de login**: `nombre.apellido` (ej: `pamela.abarca`)
- **Contrase&ntilde;a inicial**: `Mundial2026!`
- **Tu cuenta admin**: `carlos.romero` / `Mundial2026!`

---

## PASO 6: Subir a GitHub Pages

### Si ya tienes el repositorio:
```bash
git init
git add .
git commit -m "Quiniela Mundial 2026 - inicial"
git branch -M main
git remote add origin https://github.com/davidcontrol-png/quiniela-mundial.git
git push -u origin main
```

### Activar GitHub Pages:
1. En tu repositorio de GitHub &rarr; **Settings** &rarr; **Pages**
2. Source: **Deploy from a branch** &rarr; Branch: `main` / `/ (root)`
3. **Save**

Tu app quedar&aacute; en:
- `https://davidcontrol-png.github.io/quiniela-mundial/` (app principal)
- `https://davidcontrol-png.github.io/quiniela-mundial/admin/` (panel admin)

### Dominio autorizado en Firebase:
- Firebase Console &rarr; **Authentication** &rarr; **Settings** &rarr; **Authorized domains**
- Agregar: `davidcontrol-png.github.io`

---

## PASO 7: Verificar que todo funciona

1. Ingresar a la URL de GitHub Pages
2. Login con `carlos.romero` / `Mundial2026!`
3. Verificar que aparecen los partidos del d&iacute;a
4. Ingresar al panel admin: `/admin/` &rarr; mismo usuario/contrase&ntilde;a
5. Verificar la lista de usuarios

---

## Operaci&oacute;n diaria

### Scores autom&aacute;ticos
La app consulta la API del Mundial cada 10 minutos cuando hay partidos activos.
Los puntos se calculan autom&aacute;ticamente al detectar que un partido finaliz&oacute;.

### Agregar nuevos empleados
1. Ir al panel admin &rarr; tab **Usuarios** &rarr; **+ Nuevo Usuario**
2. Completar: Nombre, Usuario, Email, Contrase&ntilde;a inicial

### Agregar partidos de fases eliminatorias
1. Ir al panel admin &rarr; tab **Partidos** &rarr; **+ Nuevo Partido**
2. Ingresar los equipos, grupo/fase y fecha-hora (en hora SV)

### Ingresar resultados manualmente (si la API falla)
1. Panel admin &rarr; **Partidos** &rarr; **Resultado** en el partido correspondiente
2. Ingresar marcador y confirmar. Los puntos se calculan autom&aacute;ticamente.

---

## Sistema de puntos

| Situaci&oacute;n | Puntos |
|---|---|
| No acierta nada | 0 |
| Acierta qui&eacute;n gana, pierde o empata | 1 |
| Acierta el marcador exacto | 3 |

---

## Estructura de archivos

```
quiniela-mundial/
&boxv;
&boxvr;&boxh; index.html              &larr; Login + App principal
&boxvr;&boxh; css/
&boxv;   &boxvr;&boxh; style.css           &larr; Estilos app
&boxv;   &boxur;&boxh; admin.css           &larr; Estilos admin
&boxvr;&boxh; js/
&boxv;   &boxvr;&boxh; firebase-config.js  &larr; TU CONFIGURACI&Oacute;N FIREBASE
&boxv;   &boxvr;&boxh; matches-data.js     &larr; 72 partidos fase de grupos
&boxv;   &boxur;&boxh; app.js              &larr; L&oacute;gica principal
&boxvr;&boxh; admin/
&boxv;   &boxur;&boxh; index.html          &larr; Panel administrador
&boxvr;&boxh; js/
&boxv;   &boxur;&boxh; admin.js            &larr; L&oacute;gica admin
&boxvr;&boxh; firestore.rules         &larr; Reglas de seguridad
&boxvr;&boxh; seed_users.py           &larr; Script carga masiva usuarios
&boxur;&boxh; README.md               &larr; Esta gu&iacute;a
```

---

## Preguntas frecuentes

**&iquest;Qu&eacute; pasa si un empleado olvida su contrase&ntilde;a?**
Desde el panel admin &rarr; **Usuarios** &rarr; **Reset Pass** para enviarle un email de recuperaci&oacute;n (necesitan tener un email v&aacute;lido).

**&iquest;C&oacute;mo agrego un admin adicional?**
Panel admin &rarr; **Usuarios** &rarr; **Editar** al usuario &rarr; marcar **"Es administrador"**.

**&iquest;Los datos de Firebase son privados?**
S&iacute;, las reglas de Firestore aseguran que cada usuario solo ve sus predicciones y la informaci&oacute;n p&uacute;blica (partidos, leaderboard).

**&iquest;Cu&aacute;nto cuesta?**
$0. Firebase Free Tier (Spark) cubre perfectamente este uso:
- Firestore: 50k lecturas / d&iacute;a (m&aacute;s que suficiente)
- Authentication: ilimitado
- GitHub Pages: gratis
- WC2026 API: 100 req/d&iacute;a (gratis)
