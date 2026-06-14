<template>
  <div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">
        <i class="bi bi-people-fill text-warning me-2"></i>Gestión de Usuarios
      </h2>
      <button class="btn btn-warning fw-semibold" @click="abrirModalCrear">
        <i class="bi bi-plus-circle-fill me-1"></i>Nuevo Usuario
      </button>
    </div>

    <!-- Alerta de retroalimentación -->
    <AlertaMensaje ref="alerta" :tipo="alertaTipo" :mensaje="alertaMensaje" />

    <!-- Spinner de carga -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-2 text-muted">Cargando usuarios...</p>
    </div>

    <!-- Tabla -->
    <div v-else class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha creación</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="usuarios.length === 0">
                <td colspan="5" class="text-center text-muted py-4">
                  <i class="bi bi-inbox fs-4 d-block mb-2"></i>No hay usuarios registrados
                </td>
              </tr>
              <tr v-for="(usuario, index) in usuarios" :key="usuario.id">
                <td class="text-muted small">{{ index + 1 }}</td>
                <td class="fw-semibold">{{ usuario.name }}</td>
                <td>{{ usuario.email }}</td>
                <td class="text-muted small">{{ formatearFecha(usuario.createdAt) }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary me-2"
                    @click="abrirModalEditar(usuario)" title="Editar">
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger"
                    @click="abrirModalEliminar(usuario)" title="Eliminar">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL CREAR -->
    <div class="modal fade" id="modalCrearUsuario" tabindex="-1" ref="modalCrear">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-person-plus-fill me-2"></i>Crear Usuario
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorModal" class="alert alert-danger py-2">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorModal }}
            </div>
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="form.name" type="text" class="form-control" placeholder="Nombre completo" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" placeholder="correo@ejemplo.com" />
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input v-model="form.password" type="password" class="form-control" placeholder="••••••••" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-warning fw-semibold" @click="crearUsuario" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Guardando...</span>
              <span v-else><i class="bi bi-floppy-fill me-1"></i>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDITAR -->
    <div class="modal fade" id="modalEditarUsuario" tabindex="-1" ref="modalEditar">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-pencil-square me-2"></i>Editar Usuario
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorModal" class="alert alert-danger py-2">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorModal }}
            </div>
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="form.name" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input v-model="form.password" type="password" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-primary fw-semibold" @click="actualizarUsuario" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Actualizando...</span>
              <span v-else><i class="bi bi-floppy-fill me-1"></i>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL ELIMINAR -->
    <div class="modal fade" id="modalEliminarUsuario" tabindex="-1" ref="modalEliminar">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-trash-fill me-2"></i>Eliminar Usuario
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <i class="bi bi-person-x-fill text-danger" style="font-size: 2.5rem;"></i>
            <p class="mt-3 mb-1">¿Estás seguro de eliminar a:</p>
            <p class="fw-bold">{{ usuarioSeleccionado?.name }}</p>
            <p class="text-muted small">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-danger fw-semibold" @click="eliminarUsuario" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Eliminando...</span>
              <span v-else><i class="bi bi-trash-fill me-1"></i>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import usuariosService from '../services/usuariosService.js'
import AlertaMensaje from '../components/AlertaMensaje.vue'

export default {
  name: 'UsuariosView',
  components: { AlertaMensaje },
  data() {
    return {
      usuarios: [],
      cargando: false,
      guardando: false,
      errorModal: '',
      alertaTipo: 'success',
      alertaMensaje: '',
      usuarioSeleccionado: null,
      form: { name: '', email: '', password: '' },
      bsModalCrear: null,
      bsModalEditar: null,
      bsModalEliminar: null
    }
  },
  mounted() {
    // Inicializa los modales Bootstrap al montar la vista
    this.bsModalCrear    = new Modal(this.$refs.modalCrear)
    this.bsModalEditar   = new Modal(this.$refs.modalEditar)
    this.bsModalEliminar = new Modal(this.$refs.modalEliminar)
    this.cargarUsuarios()
  },
  methods: {
    async cargarUsuarios() {
      this.cargando = true
      try {
        const res = await usuariosService.getAll()
        this.usuarios = res.data
      } catch (err) {
        this.mostrarAlerta('danger', 'Error al cargar usuarios.')
      } finally {
        this.cargando = false
      }
    },
    abrirModalCrear() {
      this.limpiarForm()
      this.bsModalCrear.show()
    },
    abrirModalEditar(usuario) {
      this.usuarioSeleccionado = usuario
      this.form = { name: usuario.name, email: usuario.email, password: usuario.password }
      this.errorModal = ''
      this.bsModalEditar.show()
    },
    abrirModalEliminar(usuario) {
      this.usuarioSeleccionado = usuario
      this.bsModalEliminar.show()
    },
    async crearUsuario() {
      if (!this.validarForm()) return
      this.guardando = true
      try {
        await usuariosService.create(this.form)
        this.bsModalCrear.hide()
        this.mostrarAlerta('success', `Usuario "${this.form.name}" creado exitosamente.`)
        await this.cargarUsuarios()
      } catch (err) {
        this.errorModal = 'Error al crear el usuario.'
      } finally {
        this.guardando = false
      }
    },
    async actualizarUsuario() {
      if (!this.validarForm()) return
      this.guardando = true
      try {
        await usuariosService.update(this.usuarioSeleccionado.id, this.form)
        this.bsModalEditar.hide()
        this.mostrarAlerta('success', `Usuario "${this.form.name}" actualizado.`)
        await this.cargarUsuarios()
      } catch (err) {
        this.errorModal = 'Error al actualizar.'
      } finally {
        this.guardando = false
      }
    },
    async eliminarUsuario() {
      this.guardando = true
      try {
        await usuariosService.delete(this.usuarioSeleccionado.id)
        this.bsModalEliminar.hide()
        this.mostrarAlerta('danger', `Usuario "${this.usuarioSeleccionado.name}" eliminado.`)
        await this.cargarUsuarios()
      } catch (err) {
        this.mostrarAlerta('danger', 'Error al eliminar.')
      } finally {
        this.guardando = false
      }
    },
    validarForm() {
      if (!this.form.name || !this.form.email || !this.form.password) {
        this.errorModal = 'Todos los campos son obligatorios.'
        return false
      }
      this.errorModal = ''
      return true
    },
    mostrarAlerta(tipo, mensaje) {
      this.alertaTipo = tipo
      this.alertaMensaje = mensaje
      this.$refs.alerta.mostrar()
    },
    limpiarForm() {
      this.form = { name: '', email: '', password: '' }
      this.errorModal = ''
    },
    formatearFecha(fecha) {
      if (!fecha) return '-'
      return new Date(fecha).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric'
      })
    }
  }
}
</script>