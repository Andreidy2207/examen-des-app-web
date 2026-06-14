<template>
  <div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">
        <i class="bi bi-box-seam-fill text-warning me-2"></i>Gestión de Productos
      </h2>
      <button class="btn btn-warning fw-semibold text-white shadow-sm" @click="abrirModalCrear">
        <i class="bi bi-plus-circle-fill me-1"></i>Nuevo Producto
      </button>
    </div>

    <AlertaMensaje ref="alerta" :tipo="alertaTipo" :mensaje="alertaMensaje" />

    <ul class="nav nav-tabs mb-4 border-bottom" id="productTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button 
          class="nav-link fw-semibold px-3" 
          :class="{ active: categoriaActiva === 'Recomendado' }"
          @click="categoriaActiva = 'Recomendado'"
          type="button"
        >
          <i class="bi bi-star-fill me-1 text-warning"></i> Recomendado
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button 
          class="nav-link fw-semibold px-3" 
          :class="{ active: categoriaActiva === 'Bebidas' }"
          @click="categoriaActiva = 'Bebidas'"
          type="button"
        >
          <i class="bi bi-cup-hot-fill me-1"></i> Bebidas
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button 
          class="nav-link fw-semibold px-3" 
          :class="{ active: categoriaActiva === 'Alimentos' }"
          @click="categoriaActiva = 'Alimentos'"
          type="button"
        >
          <i class="bi bi-egg-fried me-1"></i> Alimentos
        </button>
      </li>
    </ul>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-2 text-muted">Cargando productos...</p>
    </div>

    <div v-else>
      <div v-if="productosFiltrados.length === 0" class="text-center py-5 text-muted bg-light rounded-3 shadow-sm border border-dashed">
        <i class="bi bi-inbox fs-1 d-block mb-3 text-secondary"></i>
        <p class="mb-1 fw-medium">No hay productos registrados en esta sección.</p>
        <p class="small text-muted">Asegúrate de asignar la categoría correspondiente al crear o editar.</p>
      </div>

      <div v-else class="row g-3">
        <div v-for="producto in productosFiltrados" :key="producto.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm producto-card">
            <img :src="producto.avatar || 'https://placehold.co/300x180?text=Sin+imagen'"
              class="card-img-top producto-img" :alt="producto.name" />
            <div class="card-body d-flex flex-column">
              <span class="badge bg-warning text-dark mb-2 align-self-start fw-bold">
                <i class="bi bi-tag-fill me-1"></i>{{ producto.category || 'Sin categoría' }}
              </span>
              <h6 class="card-title fw-bold text-dark mb-1">{{ producto.name }}</h6>
              <p class="card-text text-muted small flex-grow-1">{{ producto.description }}</p>
              <p class="fw-bold text-success mt-2 mb-3 fs-5">
                <i class="bi bi-currency-dollar"></i>{{ formatearPrecio(producto.price) }}
              </p>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm flex-grow-1 fw-semibold"
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
            <h5 class="modal-title fw-bold text-dark">
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
                <label class="form-label fw-medium">Nombre del producto</label>
                <input v-model="form.name" type="text" class="form-control" placeholder="Ej: Cappuccino" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-medium">Categoría</label>
                <select v-model="form.category" class="form-select">
                  <option value="" disabled selected>Selecciona una categoría</option>
                  <option value="Recomendado">Recomendado</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Alimentos">Alimentos</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-medium">Precio</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-currency-dollar"></i></span>
                  <input v-model="form.price" type="number" min="0" class="form-control" placeholder="0.00" />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-medium">URL Imagen (avatar)</label>
                <input v-model="form.avatar" type="url" class="form-control" placeholder="https://..." />
              </div>
              <div class="col-12">
                <label class="form-label fw-medium">Descripción</label>
                <textarea v-model="form.description" class="form-control" rows="3"
                  placeholder="Describe el producto..."></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-warning fw-semibold text-white shadow-sm" @click="crearProducto" :disabled="guardando">
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
                <label class="form-label fw-medium">Nombre del producto</label>
                <input v-model="form.name" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-medium">Categoría</label>
                <select v-model="form.category" class="form-select">
                  <option value="Recomendado">Recomendado</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Alimentos">Alimentos</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-medium">Precio</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-currency-dollar"></i></span>
                  <input v-model="form.price" type="number" min="0" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-medium">URL Imagen (avatar)</label>
                <input v-model="form.avatar" type="url" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label fw-medium">Descripción</label>
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-primary fw-semibold shadow-sm" @click="actualizarProducto" :disabled="guardando">
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
            <p class="fw-bold text-dark">{{ productoSeleccionado?.name }}</p>
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
import misProductosNuevos from '../assets/productosIniciales.json'

export default {
  name: 'ProductosView',
  components: { AlertaMensaje },
  data() {
    return {
      productos: [],
      categoriaActiva: 'Bebidas', // 🌟 Cambiado a Bebidas temporalmente para que veas tus datos de inmediato
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
  computed: {
    // 🌟 OPTIMIZADO: Filtro flexible que acepta variaciones de nombres de MockAPI (Singular/Plural)
    productosFiltrados() {
      return this.productos.filter(producto => {
        const cat = (producto.category || '').toLowerCase().trim();
        
        if (this.categoriaActiva === 'Bebidas') {
          return cat === 'bebidas' || cat === 'bebida';
        }
        if (this.categoriaActiva === 'Alimentos') {
          // Si es alimentos, muestra los marcados como alimentos o cualquier remanente (ej. industrial)
          return cat === 'alimentos' || cat === 'alimento' || cat === 'industrial' || cat === 'comida';
        }
        if (this.categoriaActiva === 'Recomendado') {
          return cat === 'recomendado' || cat === 'recomendados' || cat === 'favorito';
        }
        return false;
      });
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
        for (let p of misProductosNuevos) {
          await productosService.create(p)
        }
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
        category: producto.category || 'Bebidas'
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
      if (!this.form.name || !this.form.price || !this.form.category) {
        this.errorModal = 'El nombre, precio y la categoría son obligatorios.'
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
      this.form = { name: '', price: '', description: '', avatar: '', category: 'Bebidas' }
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
.nav-tabs {
  border-bottom: 2px solid #e2e8f0 !important;
}

.nav-tabs .nav-link {
  color: #64748b;
  border: none;
  border-bottom: 3px solid transparent;
  background: transparent;
  padding: 0.75rem 1.25rem;
  transition: all 0.25s ease;
}

.nav-tabs .nav-link:hover {
  color: #ffb703;
  border-bottom-color: #cbd5e1;
}

.nav-tabs .nav-link.active {
  color: #fb8500 !important;
  font-weight: 600;
  border-bottom-color: #ffb703 !important;
  background: transparent;
}

.border-dashed {
  border-style: dashed !important;
  background-color: #f8fafc;
}

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