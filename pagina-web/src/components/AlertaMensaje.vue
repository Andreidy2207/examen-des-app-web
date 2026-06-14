<template>
  <!-- Alerta Bootstrap reutilizable con auto-cierre -->
  <div v-if="visible" :class="`alert alert-${tipo} alert-dismissible fade show`" role="alert">
    <i :class="icono" class="me-2"></i>{{ mensaje }}
    <button type="button" class="btn-close" @click="cerrar"></button>
  </div>
</template>

<script>
export default {
  name: 'AlertaMensaje',
  props: {
    tipo:     { type: String, default: 'success' }, // success, danger, warning, info
    mensaje:  { type: String, default: '' },
    duracion: { type: Number, default: 3000 }       // ms antes de ocultarse
  },
  data() {
    return { visible: false, timer: null }
  },
  computed: {
    icono() {
      const iconos = {
        success: 'bi bi-check-circle-fill',
        danger:  'bi bi-x-circle-fill',
        warning: 'bi bi-exclamation-triangle-fill',
        info:    'bi bi-info-circle-fill'
      }
      return iconos[this.tipo] || 'bi bi-bell-fill'
    }
  },
  methods: {
    mostrar() {
      this.visible = true
      if (this.duracion > 0) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => { this.visible = false }, this.duracion)
      }
    },
    cerrar() {
      this.visible = false
      clearTimeout(this.timer)
    }
  }
}
</script>