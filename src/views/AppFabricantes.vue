<template>
  <div class="container py-4">
    <h1 class="title mb-4">Fabricantes</h1>

    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-success" @click="showCreateForm">Crear Fabricante</button>
    </div>

    <div v-if="showTab === 'table'">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th class="text-danger">ID</th>
            <th>Nombre</th>
            <th>País</th>
            <th>Año de Fundación</th>
            <th class="d-flex justify-content-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fabricante in fabricantes" :key="fabricante.id">
            <td>{{ fabricante.id }}</td>
            <td>{{ fabricante.nombre }}</td>
            <td>{{ fabricante.pais }}</td>
            <td>{{ fabricante.anio_fundacion }}</td>
            <td class="action-buttons d-flex justify-content-center gap-3">
              <button class="btn btn-warning btn-sm" @click="editFabricante(fabricante)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="deleteFabricante(fabricante)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showTab === 'create'">
      <div class="container py-4 d-flex justify-content-center">
        <div class="card" style="width: 50rem;">
          <div class="card-body">
            <h1 class="title mb-4">Crear Fabricante</h1>

            <form @submit.prevent="createFabricante" novalidate>
              <div class="mb-3">
                <label for="nombre">Nombre</label>
                <input type="text" v-model="nuevoFabricante.nombre" id="nombre" class="form-control"
                  placeholder="Ingrese el nombre" required />
              </div>
              <div class="mb-3">
                <label for="pais">País</label>
                <input type="text" v-model="nuevoFabricante.pais" id="pais" class="form-control"
                  placeholder="Ingrese el país" required />
              </div>
              <div class="mb-3">
                <label for="anio_fundacion">Año de Fundación</label>
                <input type="number" v-model="nuevoFabricante.anio_fundacion" id="anio_fundacion" class="form-control"
                  placeholder="Ingrese el año de fundación" required />
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

    <div v-if="showTab === 'edit' && fabricanteEditado">
      <div class="container py-4 d-flex justify-content-center">
        <div class="card" style="width: 50rem;">
          <div class="card-body">
            <h1 class="title mb-4">Editar Fabricante</h1>

            <form @submit.prevent="updateFabricante" novalidate>
              <div class="mb-3">
                <label for="nombre">Nombre</label>
                <input type="text" v-model="fabricanteEditado.nombre" id="nombre" class="form-control"
                  placeholder="Ingrese el nombre" required />
              </div>
              <div class="mb-3">
                <label for="pais">País</label>
                <input type="text" v-model="fabricanteEditado.pais" id="pais" class="form-control"
                  placeholder="Ingrese el país" required />
              </div>
              <div class="mb-3">
                <label for="anio_fundacion">Año de Fundación</label>
                <input type="number" v-model="fabricanteEditado.anio_fundacion" id="anio_fundacion" class="form-control"
                  placeholder="Ingrese el año de fundación" required />
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
      fabricantes: [],
      nuevoFabricante: { nombre: '', pais: '', anio_fundacion: '' },
      fabricanteEditado: null,
      showTab: 'table',
    };
  },
  async mounted() {
    try {
      const response = await axios.get('/.netlify/functions/fabricantes');
      this.fabricantes = response.data.data;
    } catch (error) {
      console.error("Error al obtener los fabricantes:", error);
    }
  },
  methods: {
    showCreateForm() {
      this.showTab = 'create';
    },
    cancelCreate() {
      this.showTab = 'table';
      this.nuevoFabricante = { nombre: '', pais: '', anio_fundacion: '' };
    },
    async createFabricante() {
      if (!this.nuevoFabricante.nombre || !this.nuevoFabricante.pais || !this.nuevoFabricante.anio_fundacion) {
        alert('Todos los campos son obligatorios.');
        return;
      }

      try {
        const response = await axios.post('/.netlify/functions/crearFabricante', this.nuevoFabricante);
        this.fabricantes.push(response.data);
        this.cancelCreate();
      } catch (error) {
        console.error('Error al crear el fabricante:', error);
      }
    },
    editFabricante(fabricante) {
      this.fabricanteEditado = { ...fabricante };
      this.showTab = 'edit';
    },
    cancelEdit() {
      this.showTab = 'table';
      this.fabricanteEditado = null;
    },
    async updateFabricante() {
      // Validación de campos obligatorios
      if (!this.fabricanteEditado.nombre || !this.fabricanteEditado.pais || !this.fabricanteEditado.anio_fundacion) {
        alert('Todos los campos son obligatorios.');
        return;
      }

      try {
        const response = await axios.put(`/.netlify/functions/updateFabricante/${this.fabricanteEditado.id}`, this.fabricanteEditado);

        const index = this.fabricantes.findIndex(f => f.id === response.data.id);
        if (index !== -1) {
          this.fabricantes[index] = response.data; 
        }

        this.cancelEdit();
      } catch (error) {
        console.error('Error al actualizar el fabricante:', error);
        if (error.response) {
          alert(`Error: ${error.response.data.error || "Hubo un problema al actualizar el fabricante."}`);
        } else {
          alert("Error de red o conexión.");
        }
      }
    },

 async deleteFabricante(fabricante) {
  try {
    await axios.delete(`/.netlify/functions/deleteFbticante/${fabricante.id}`, {
      data: { id: fabricante.id }  
    });
    this.fabricantes = this.fabricantes.filter(f => f.id !== fabricante.id);
  } catch (error) {
    console.error('Error de red al eliminar el fabricante:', error);
  }
}

  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

button.active {
  background-color: #4CAF50;
  color: white;
}

form input {
  padding: 5px;
  margin: 10px 0;
  width: 100%;
}

form button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.card-body {
  padding: 20px;
}
</style>
