<template>
  <div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">
        <i class="bi bi-box-seam-fill text-warning me-2"></i>Gestión de Productos
      </h2>
      <button class="btn btn-warning fw-semibold" @click="abrirModalCrear">
        <i class="bi bi-plus-circle-fill me-1"></i>Nuevo Producto
      </button>
    </div>

    <AlertaMensaje ref="alerta" :tipo="alertaTipo" :mensaje="alertaMensaje" />

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-2 text-muted">Cargando productos...</p>
    </div>

    <div v-else>
      <div v-if="productos.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-inbox fs-1 d-block mb-3"></i>
        <p>No hay productos registrados aún.</p>
      </div>

      <div class="row g-3">
        <div v-for="producto in productos" :key="producto.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm producto-card">
            <img :src="producto.avatar || 'https://placehold.co/300x180?text=Sin+imagen'"
              class="card-img-top producto-img" :alt="producto.name" />
            <div class="card-body d-flex flex-column">
              <span class="badge bg-warning text-dark mb-2 align-self-start">
                <i class="bi bi-tag-fill me-1"></i>{{ producto.category || 'Sin categoría' }}
              </span>
              <h6 class="card-title fw-bold">{{ producto.name }}</h6>
              <p class="card-text text-muted small flex-grow-1">{{ producto.description }}</p>
              <p class="fw-bold text-success mt-2 mb-3">
                <i class="bi bi-currency-dollar"></i>{{ formatearPrecio(producto.price) }}
              </p>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm flex-grow-1"
                  @click="abrirModalEditar(producto)">
                  <i class="bi bi-pencil-fill me-1"></i>Editar
                </button>
                <button class="btn btn-outline-danger btn-sm"
                  @click="abrirModalEliminar(producto)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalCrearProducto" tabindex="-1" ref="modalCrear">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-plus-circle-fill me-2"></i>Crear Producto
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorModal" class="alert alert-danger py-2">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorModal }}
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre del producto</label>
                <input v-model="form.name" type="text" class="form-control" placeholder="Ej: Cappuccino" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Categoría</label>
                <input v-model="form.category" type="text" class="form-control" placeholder="Ej: Bebidas" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Precio</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-currency-dollar"></i></span>
                  <input v-model="form.price" type="number" min="0" class="form-control" placeholder="0.00" />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">URL Imagen (avatar)</label>
                <input v-model="form.avatar" type="url" class="form-control" placeholder="https://..." />
              </div>
              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea v-model="form.description" class="form-control" rows="3"
                  placeholder="Describe el producto..."></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-warning fw-semibold" @click="crearProducto" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Guardando...</span>
              <span v-else><i class="bi bi-floppy-fill me-1"></i>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalEditarProducto" tabindex="-1" ref="modalEditar">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-pencil-square me-2"></i>Editar Producto
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorModal" class="alert alert-danger py-2">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorModal }}
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre del producto</label>
                <input v-model="form.name" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Categoría</label>
                <input v-model="form.category" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Precio</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-currency-dollar"></i></span>
                  <input v-model="form.price" type="number" min="0" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">URL Imagen (avatar)</label>
                <input v-model="form.avatar" type="url" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-primary fw-semibold" @click="actualizarProducto" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Actualizando...</span>
              <span v-else><i class="bi bi-floppy-fill me-1"></i>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalEliminarProducto" tabindex="-1" ref="modalEliminar">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-trash-fill me-2"></i>Eliminar Producto
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <i class="bi bi-box-x-fill text-danger" style="font-size: 2.5rem;"></i>
            <p class="mt-3 mb-1">¿Eliminar el producto:</p>
            <p class="fw-bold">{{ productoSeleccionado?.name }}</p>
            <p class="text-muted small">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-danger fw-semibold" @click="eliminarProducto" :disabled="guardando">
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
import productosService from '../services/productosService.js'
import AlertaMensaje from '../components/AlertaMensaje.vue'

// 🌟 IMPORTANTE: Importamos el archivo de datos JSON locales
// (Verifica que la ruta coincida con el lugar exacto donde creaste el archivo)
import misProductosNuevos from '../assets/productosIniciales.json'

export default {
  name: 'ProductosView',
  components: { AlertaMensaje },
  data() {
    return {
      productos: [],
      cargando: false,
      guardando: false,
      errorModal: '',
      alertaTipo: 'success',
      alertaMensaje: '',
      productoSeleccionado: null,
      form: { name: '', price: '', description: '', avatar: '', category: '' },
      bsModalCrear: null,
      bsModalEditar: null,
      bsModalEliminar: null
    }
  },
  mounted() {
    this.bsModalCrear    = new Modal(this.$refs.modalCrear)
    this.bsModalEditar   = new Modal(this.$refs.modalEditar)
    this.bsModalEliminar = new Modal(this.$refs.modalEliminar)
    this.cargarProductos()
  },
  methods: {
    async cargarProductos() {
      this.cargando = true
      try {
        const res = await productosService.getAll()
        
        // Si MockAPI está vacío, inyectamos los datos desde el archivo JSON
        if (res.data.length === 0) {
          await this.cargarDatosIniciales()
        } else {
          this.productos = res.data
        }
      } catch (err) {
        this.mostrarAlerta('danger', 'Error al cargar productos.')
      } finally {
        this.cargando = false
      }
    },
    async cargarDatosIniciales() {
      try {
        // Recorremos la lista que viene directamente del archivo JSON importado
        for (let p of misProductosNuevos) {
          await productosService.create(p)
        }
        
        // Volvemos a consultar MockAPI para sincronizar el estado local con los IDs reales
        const resFinal = await productosService.getAll()
        this.productos = resFinal.data
      } catch (error) {
        this.mostrarAlerta('danger', 'Error al inicializar los datos desde el archivo JSON.')
      }
    },
    abrirModalCrear() {
      this.limpiarForm()
      this.bsModalCrear.show()
    },
    abrirModalEditar(producto) {
      this.productoSeleccionado = producto
      this.form = { 
        name: producto.name, 
        price: producto.price,
        description: producto.description, 
        avatar: producto.avatar, 
        category: producto.category 
      }
      this.errorModal = ''
      this.bsModalEditar.show()
    },
    abrirModalEliminar(producto) {
      this.productoSeleccionado = producto
      this.bsModalEliminar.show()
    },
    async crearProducto() {
      if (!this.validarForm()) return
      this.guardando = true
      try {
        await productosService.create(this.form)
        this.bsModalCrear.hide()
        this.mostrarAlerta('success', `Producto "${this.form.name}" creado exitosamente.`)
        await this.cargarProductos()
      } catch (err) {
        this.errorModal = 'Error al crear el producto.'
      } finally {
        this.guardando = false
      }
    },
    async actualizarProducto() {
      if (!this.validarForm()) return
      this.guardando = true
      try {
        await productosService.update(this.productoSeleccionado.id, this.form)
        this.bsModalEditar.hide()
        this.mostrarAlerta('success', `Producto "${this.form.name}" actualizado.`)
        await this.cargarProductos()
      } catch (err) {
        this.errorModal = 'Error al actualizar.'
      } finally {
        this.guardando = false
      }
    },
    async eliminarProducto() {
      this.guardando = true
      try {
        await productosService.delete(this.productoSeleccionado.id)
        this.bsModalEliminar.hide()
        this.mostrarAlerta('danger', `Producto "${this.productoSeleccionado.name}" eliminado.`)
        await this.cargarProductos()
      } catch (err) {
        this.mostrarAlerta('danger', 'Error al eliminar.')
      } finally {
        this.guardando = false
      }
    },
    validarForm() {
      if (!this.form.name || !this.form.price) {
        this.errorModal = 'El nombre y el precio son obligatorios.'
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
      this.form = { name: '', price: '', description: '', avatar: '', category: '' }
      this.errorModal = ''
    },
    formatearPrecio(precio) {
      if (!precio) return '0.00'
      return Number(precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })
    }
  }
}
</script>

<style scoped>
.producto-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  border-radius: 12px;
  overflow: hidden;
}
.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}
.producto-img {
  height: 160px;
  object-fit: cover;
}
</style>