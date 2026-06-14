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
.login-bg {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
.card { border: none; border-radius: 16px; }
.form-control:focus {
  border-color: #ffc107;
  box-shadow: 0 0 0 0.2rem rgba(255,193,7,0.25);
}
</style>