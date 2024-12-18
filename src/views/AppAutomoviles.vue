<template>
  <div class="container py-4">
    <h1 class="title mb-4">Automóviles</h1>

    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-success" @click="showCreateForm">Crear Automóvil</button>
    </div>

    <div v-if="showTab === 'table'">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th class="text-danger">ID</th>
            <th>Nombre</th>
            <th>Año</th>
            <th>Velocidad Máxima</th>
            <th>Fabricante</th>
            <th>Diseñador</th>
            <th class="d-flex justify-content-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="automovil in automoviles" :key="automovil.id">
            <td>{{ automovil.id }}</td>
            <td>{{ automovil.nombre }}</td>
            <td>{{ automovil.año }}</td>
            <td>{{ automovil.velocidad_maxima }}</td>
            <td>{{ getFabricanteName(automovil.fabricante_id) }}</td>
            <td>{{ getDisenadorName(automovil.disenador_id) }}</td>
            <td class="action-buttons d-flex justify-content-center gap-3">
              <button class="btn btn-warning btn-sm" @click="editAutomovil(automovil)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="deleteAutomovil(automovil)">Eliminar</button>

              <!-- <button class="btn btn-danger btn-sm" @click="deleteAutomovil(automovil)">Eliminar</button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showTab === 'create'">
      <div class="container py-4 d-flex justify-content-center">
        <div class="card" style="width: 50rem;">
          <div class="card-body">
            <h1 class="title mb-4">Crear Automóvil</h1>

            <form @submit.prevent="createAutomovil" class="needs-validation" novalidate>
              <div class="mb-3 row">
                <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                <div class="col-sm-7">
                  <input type="text" v-model="nuevoAutomovil.nombre" id="nombre" class="form-control"
                    placeholder="Ingrese el nombre" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="año" class="col-sm-2 col-form-label">Año</label>
                <div class="col-sm-7">
                  <input type="number" v-model="nuevoAutomovil.año" id="año" class="form-control"
                    placeholder="Ingrese el año" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="velocidad_maxima" class="col-sm-2 col-form-label">Velocidad Máxima</label>
                <div class="col-sm-7">
                  <input type="text" v-model="nuevoAutomovil.velocidad_maxima" id="velocidad_maxima"
                    class="form-control" placeholder="Ingrese la velocidad máxima" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="fabricante_id" class="col-sm-2 col-form-label">Fabricante</label>
                <div class="col-sm-7">
                  <select v-model="nuevoAutomovil.fabricante_id" id="fabricante_id" class="form-control" required>
                    <option v-for="fabricante in fabricantes" :key="fabricante.id" :value="fabricante.id">
                      {{ fabricante.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="mb-3 row">
                <label for="disenador_id" class="col-sm-2 col-form-label">Diseñador</label>
                <div class="col-sm-7">
                  <select v-model="nuevoAutomovil.disenador_id" id="disenador_id" class="form-control" required>
                    <option v-for="disenador in disenadores" :key="disenador.id" :value="disenador.id">
                      {{ disenador.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="d-flex gap-3">
                <button type="submit" class="btn btn-primary">Crear</button>
                <button type="button" class="btn btn-secondary" @click="cancelCreate">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTab === 'edit' && automovilEditado">
      <div class="container py-4 d-flex justify-content-center">
        <div class="card" style="width: 50rem;">
          <div class="card-body">
            <h1 class="title mb-4">Editar Automóvil</h1>

            <form @submit.prevent="updateAutomovil" class="needs-validation" novalidate>
              <div class="mb-3 row">
                <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                <div class="col-sm-7">
                  <input type="text" v-model="automovilEditado.nombre" id="nombre" class="form-control"
                    placeholder="Ingrese el nombre" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="año" class="col-sm-2 col-form-label">Año</label>
                <div class="col-sm-7">
                  <input type="number" v-model="automovilEditado.año" id="año" class="form-control"
                    placeholder="Ingrese el año" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="velocidad_maxima" class="col-sm-2 col-form-label">Velocidad Máxima</label>
                <div class="col-sm-7">
                  <input type="text" v-model="automovilEditado.velocidad_maxima" id="velocidad_maxima"
                    class="form-control" placeholder="Ingrese la velocidad máxima" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="fabricante_id" class="col-sm-2 col-form-label">Fabricante</label>
                <div class="col-sm-7">
                  <select v-model="automovilEditado.fabricante_id" id="fabricante_id" class="form-control" required>
                    <option v-for="fabricante in fabricantes" :key="fabricante.id" :value="fabricante.id">
                      {{ fabricante.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="mb-3 row">
                <label for="disenador_id" class="col-sm-2 col-form-label">Diseñador</label>
                <div class="col-sm-7">
                  <select v-model="automovilEditado.disenador_id" id="disenador_id" class="form-control" required>
                    <option v-for="disenador in disenadores" :key="disenador.id" :value="disenador.id">
                      {{ disenador.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="d-flex gap-3">
                <button type="submit" class="btn btn-primary">Actualizar</button>
                <button type="button" class="btn btn-secondary" @click="cancelEdit">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      automoviles: [],
      nuevoAutomovil: {
        nombre: '',
        año: '',
        velocidad_maxima: '',
        fabricante_id: '',
        disenador_id: '',
      },
      automovilEditado: null,
      fabricantes: [],
      disenadores: [],
      showTab: 'table',
    };
  },
  async created() {
    try {

      const automovilesResponse = await axios.get('/.netlify/functions/automoviles');
      this.automoviles = automovilesResponse.data.data;

      const fabricantesResponse = await axios.get('/.netlify/functions/fabricantes');
      this.fabricantes = fabricantesResponse.data.data;

      const disenadoresResponse = await axios.get('/.netlify/functions/disenadores');
      this.disenadores = disenadoresResponse.data.data;
    } catch (error) {
      console.error('Hubo un error al cargar los datos:', error);
    }
  },
  methods: {
    showCreateForm() {
      this.showTab = 'create';
    },
    cancelCreate() {
      this.showTab = 'table';
    },
    createAutomovil() {

      if (!this.nuevoAutomovil.nombre || !this.nuevoAutomovil.año || !this.nuevoAutomovil.velocidad_maxima || !this.nuevoAutomovil.fabricante_id || !this.nuevoAutomovil.disenador_id) {
        alert("Por favor complete todos los campos.");
        return;
      }


      axios.post(`${this.$url}/.netlify/functions/crearAutomovil`, this.nuevoAutomovil)
        .then(response => {
          this.automoviles.push(response.data);
          this.showTab = 'table';
        })
        .catch(error => {
          console.error('Error creando el automóvil', error.response ? error.response.data : error);
          alert("Hubo un error al crear el automóvil.");
        });
    },

    editAutomovil(automovil) {
      this.automovilEditado = { ...automovil };
      this.showTab = 'edit';
    },
    cancelEdit() {
      this.showTab = 'table';
    },
    updateAutomovil() {
      axios.put(`${this.$url}/.netlify/functions/updateaAutomovil/${this.automovilEditado.id}`, this.automovilEditado)
        .then(response => {
          const index = this.automoviles.findIndex(a => a.id === response.data.id);
          if (index !== -1) {
            this.automoviles[index] = response.data;
            this.showTab = 'table';
          }
          this.showTab = 'table';
        })

        .catch(error => {
          console.error('Error actualizando el automóvil', error);
        });
    },

    async deleteAutomovil(automovil) {
  if (!automovil.id) {
    console.error('El ID del automóvil no está definido');
    return;
  }

  try {
   
    await axios.delete(`${this.$url}/.netlify/functions/deleteAutomovil/${automovil.id}`, {
      data: { id: automovil.id }  
    });
    
   
    this.automoviles = this.automoviles.filter(a => a.id !== automovil.id);
    console.log(`Automóvil con ID ${automovil.id} eliminado exitosamente.`);
  } catch (error) {
    console.error('Error eliminando el automóvil:', error);
    alert('No se pudo eliminar el automóvil. Inténtalo de nuevo más tarde.');
  }
},


    getFabricanteName(id) {
      const fabricante = this.fabricantes.find(f => f.id === id);
      return fabricante ? fabricante.nombre : 'Desconocido';
    },
    getDisenadorName(id) {
      const disenador = this.disenadores.find(d => d.id === id);
      return disenador ? disenador.nombre : 'Desconocido';
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}

.title {
  font-size: 2rem;
  font-weight: bold;
}

.action-buttons .btn {
  width: 100px;
}
</style>

