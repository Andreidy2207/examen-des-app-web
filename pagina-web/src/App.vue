<template>
  <div id="app">
    <nav v-if="mostrarMenu" class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">
          <i class="bi bi-cup-hot-fill text-warning me-2"></i>Cafe Express
        </a>

        <button class="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarMenu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarMenu">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/usuarios">
                <i class="bi bi-people-fill me-1"></i>Usuarios
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/productos">
                <i class="bi bi-box-seam-fill me-1"></i>Productos
              </router-link>
            </li>
          </ul>
          <button class="btn btn-outline-warning btn-sm" @click="logout">
            <i class="bi bi-box-arrow-right me-1"></i>Cerrar sesión
          </button>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    // Esta es la clave: el menú se muestra siempre, EXCEPTO en el login
    mostrarMenu() {
      return this.$route.path !== '/login'
    }
  },
  methods: {
    logout() {
      // 1. Borra la sesión
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('usuarioActivo')
      // 2. Redirige al login (lo que hará que mostrarMenu se vuelva falso y oculte la barra)
      this.$router.push('/login')
    }
  }
}
</script>

<style>
body {
  background-color: #f8f5f0;
  font-family: 'Segoe UI', sans-serif;
}
.nav-link.router-link-active {
  color: #ffc107 !important;
  font-weight: 600;
}
</style>