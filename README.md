# examen-des-app-web# ☕ Café Express — Aplicación Web con Vue.js y MockAPI

Proyecto desarrollado para el **Examen Final de Desarrollo de Aplicaciones Web y Sistemas Operativos**.  
*Universidad Francisco de Paula Santander Seccional Ocaña — UFPSO 2026*

**Integrantes del Grupo:**
* 👤 **David Andreidy Coronel Coronel** - 0192610
* 👤 **Yaneidy Sepúlveda Sepúlveda** - 0192568
* 👤 **Yesica Paola Bayona Moreno** - 0192625

---

## 📌 Descripción General

**Café Express** es una Single Page Application (SPA) de gestión integral para una cafetería. A diferencia de la versión del segundo parcial, esta entrega final evoluciona conectándose de forma síncrona a una API REST real mediante **MockAPI**, permitiendo persistencia de datos y una gestión dinámica de recursos.

La aplicación está construida bajo una arquitectura modular y componentizada, garantizando escalabilidad, un diseño responsivo adaptado a cualquier dispositivo y un sistema estricto de rutas protegidas mediante *Navigation Guards*.

---

## 🚀 Requerimientos Funcionales Implementados

### 🔒 1. Autenticación y Seguridad
* **Formulario de Login:** Validación de credenciales consultando directamente el recurso de usuarios en MockAPI.
* **Sesión Activa:** Al autenticarse con éxito, se genera y almacena un token simulado en `sessionStorage` / `localStorage`.
* **Rutas Protegidas:** Bloqueo de navegación con Vue Router. Cualquier intento de acceso a las secciones de gestión sin iniciar sesión redirige automáticamente al `/login`.
* **Cierre de Sesión:** Botón dedicado para destruir el token y limpiar el estado de la aplicación.

### 👥 2. CRUD de Usuarios
Gestión completa conectada al recurso `/usuarios` de MockAPI:
* **Visualización:** Listado dinámico de los usuarios registrados.
* **Creación y Edición:** Formularios estilizados e integrados dentro de **ventanas modales** de Bootstrap 5.
* **Eliminación:** Flujo seguro mediante modal de confirmación previa.
* **Feedback:** Alertas de éxito o error tras cada operación.

### 📦 3. CRUD de Productos
Gestión del inventario de la cafetería conectado al recurso `/productos` de MockAPI:
* **Visualización:** Listado estructurado de alimentos y bebidas.
* **Altas y Modificaciones:** Interfaces dinámicas controladas por ventanas modales.
* **Bajas:** Control de eliminación mediante modales de advertencia.

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** Vue.js 3 (Single Page Application)
* **Enrutamiento:** Vue Router (con Navigation Guards)
* **Estilos y UI:** Bootstrap 5 & Bootstrap Icons (Uso de Grid, Modales y Alertas)
* **Consumo de API:** Axios
* **Backend Simulado:** MockAPI (Recursos de `/usuarios` y `/productos`)
* **Control de Versiones:** Git & GitHub

---

## 💻 Instrucciones para Ejecución Local

Si deseas clonar y correr este proyecto de forma local, asegúrate de tener instalado [Node.js](https://nodejs.org/) y sigue estos pasos en la terminal:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/examen-des-app-web.git](https://github.com/tu-usuario/examen-des-app-web.git)
cd examen-des-app-web/pagina-web