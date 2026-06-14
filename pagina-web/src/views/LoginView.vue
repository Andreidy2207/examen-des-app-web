<template>
  <div class="login-bg d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 420px;">

      <div class="text-center mb-4">
        <i class="bi bi-cup-hot-fill text-warning" style="font-size: 2.5rem;"></i>
        <h3 class="fw-bold mt-2">Cafe Express</h3>
        <p class="text-muted small">Ingresa tus credenciales para continuar</p>
      </div>

      <div v-if="error" class="alert alert-danger alert-dismissible fade show">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}
        <button type="button" class="btn-close" @click="error = ''"></button>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">
          <i class="bi bi-envelope-fill me-1 text-warning"></i>Correo electrónico
        </label>
        <input v-model="email" type="email" class="form-control"
          placeholder="correo@ejemplo.com" @keyup.enter="login" />
      </div>

      <div class="mb-4">
        <label class="form-label fw-semibold">
          <i class="bi bi-lock-fill me-1 text-warning"></i>Contraseña
        </label>
        <input v-model="password" type="password" class="form-control"
          placeholder="••••••••" @keyup.enter="login" />
      </div>

      <button class="btn btn-warning w-100 fw-bold" @click="login" :disabled="cargando">
        <span v-if="cargando">
          <span class="spinner-border spinner-border-sm me-2"></span>Verificando...
        </span>
        <span v-else>
          <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión
        </span>
      </button>

    </div>
  </div>
</template>

<script>
import usuariosService from '../services/usuariosService.js'

export default {
  name: 'LoginView',
  data() {
    return { email: '', password: '', error: '', cargando: false }
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.error = 'Por favor completa todos los campos.'
        return
      }
      this.cargando = true
      this.error = ''
      try {
        const response = await usuariosService.getAll()
        // Busca el usuario que coincida con email y password en MockAPI
        const encontrado = response.data.find(
          u => u.email === this.email && u.password === this.password
        )
        if (encontrado) {
          // Guarda token simulado y redirige
          sessionStorage.setItem('token', 'token-' + encontrado.id)
          sessionStorage.setItem('usuarioActivo', JSON.stringify(encontrado))
          this.$router.push('/usuarios')
        } else {
          this.error = 'Correo o contraseña incorrectos.'
        }
      } catch (err) {
        this.error = 'Error al conectar con el servidor.'
        console.error(err)
      } finally {
        this.cargando = false
      }
    }
  }
}
</script>

<style scoped>
/* Contenedor principal con la imagen de fondo */
.login-bg {
  position: relative;
  background-image: url('https://perfectdailygrind.com/wp-content/uploads/2020/04/Berlin_cappuccino_2_Melanie-Bo%CC%88hme.-32-1024x683.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

/* Capa superpuesta oscura y desenfoque para dar legibilidad y contraste */
.login-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75); /* Tono azul oscuro/negro semitransparente */
  backdrop-filter: blur(5px);          /* Aplica un desenfoque cinemático al fondo */
  z-index: -1;
}

/* Modificaciones estéticas aplicadas sobre tus clases existentes */
.card { 
  border: none; 
  border-radius: 20px; 
  background-color: rgba(255, 255, 255, 0.96); /* Blanco con un sutil toque traslúcido */
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.35) !important; /* Sombra más pronunciada */
  animation: slideUp 0.5s ease-out;
}

/* Mejoras visuales en las cajas de texto */
.form-control {
  border-color: #e2e8f0;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.form-control:focus {
  background-color: #ffffff;
  border-color: #ffc107;
  box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.2);
}

/* Ajuste de contraste para el texto del botón (Blanco sobre Amarillo) */
.btn-warning {
  color: #ffffff !important;
  background-color: #ffb703;
  border: none;
  padding: 0.65rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-warning:hover:not(:disabled) {
  background-color: #fb8500;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(251, 133, 0, 0.3);
}

.btn-warning:active:not(:disabled) {
  transform: translateY(0);
}

/* Animación de entrada suave para la tarjeta de Login */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>