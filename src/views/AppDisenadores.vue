<template>
  <div class="container py-4">
    <h1 class="title mb-4">Diseñadores</h1>

    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-success" @click="showCreateForm">Crear Diseñador</button>
    </div>

    <div v-if="showTab === 'table'">
      <table class="table table-bordered table-hover">
        <thead class="table-dark" style="background-color: black;">
          <tr>
            <th class="text-danger">ID</th>
            <th>Nombre</th>
            <th>Nacionalidad</th>
            <th>Estilo</th>
            <th class="d-flex justify-content-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="disenador in disenadores" :key="disenador.id">
            <td>{{ disenador.id }}</td>
            <td>{{ disenador.nombre }}</td>
            <td>{{ disenador.nacionalidad }}</td>
            <td>{{ disenador.estilo }}</td>
            <td class="action-buttons d-flex justify-content-center gap-3">
              <button class="btn btn-warning btn-sm" @click="editDisenador(disenador)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="deleteDisenador(disenador)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showTab === 'create'">
      <div class="container py-4 d-flex justify-content-center">
        <div class="card" style="width: 50rem;">
          <div class="card-body">
            <h1 class="title mb-4">Crear Diseñador</h1>

            <form @submit.prevent="createDisenador" class="needs-validation" novalidate>
              <div class="mb-3 row">
                <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                <div class="col-sm-7">
                  <input type="text" v-model="nuevoDisenador.nombre" id="nombre" class="form-control"
                    placeholder="Ingrese el nombre" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="nacionalidad" class="col-sm-2 col-form-label">Nacionalidad</label>
                <div class="col-sm-7">
                  <input type="text" v-model="nuevoDisenador.nacionalidad" id="nacionalidad" class="form-control"
                    placeholder="Ingrese la nacionalidad" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="estilo" class="col-sm-2 col-form-label">Estilo</label>
                <div class="col-sm-7">
                  <input type="text" v-model="nuevoDisenador.estilo" id="estilo" class="form-control"
                    placeholder="Ingrese el estilo" required />
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

    <div v-if="showTab === 'edit' && disenadorEditado">
      <div class="container py-4 d-flex justify-content-center">
        <div class="card" style="width: 50rem;">
          <div class="card-body">
            <h1 class="title mb-4">Editar Diseñador</h1>

            <form @submit.prevent="updateDisenador" class="needs-validation" novalidate>
              <div class="mb-3 row">
                <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                <div class="col-sm-7">
                  <input type="text" v-model="disenadorEditado.nombre" id="nombre" class="form-control"
                    placeholder="Ingrese el nombre" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="nacionalidad" class="col-sm-2 col-form-label">Nacionalidad</label>
                <div class="col-sm-7">
                  <input type="text" v-model="disenadorEditado.nacionalidad" id="nacionalidad" class="form-control"
                    placeholder="Ingrese la nacionalidad" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="estilo" class="col-sm-2 col-form-label">Estilo</label>
                <div class="col-sm-7">
                  <input type="text" v-model="disenadorEditado.estilo" id="estilo" class="form-control"
                    placeholder="Ingrese el estilo" required />
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
      disenadores: [],
      nuevoDisenador: { nombre: '', nacionalidad: '', estilo: '' },
      disenadorEditado: null,
      showTab: 'table',
    };
  },
  async created() {
    try {
      
      const response = await axios.get('/.netlify/functions/disenadores');
      this.disenadores = response.data.data; 
    } catch (error) {
      console.error('Hubo un error al cargar los diseñadores:', error);
    }
  },
  methods: {
    showCreateForm() {
      this.showTab = 'create';
    },
    cancelCreate() {
      this.showTab = 'table';
      this.nuevoDisenador = { nombre: '', nacionalidad: '', estilo: '' }; // Limpiar formulario
    },
    async createDisenador() {
      const response = await axios.post('/.netlify/functions/createDisenador', this.nuevoDisenador);
      this.disenadores.push(response.data);
      this.cancelCreate();
    },
    async editDisenador(disenador) {
      this.disenadorEditado = { ...disenador };
      this.showTab = 'edit';
    },
    cancelEdit() {
      this.showTab = 'table';
      this.disenadorEditado = null; 
    },
    async updateDisenador() {

  if (!this.disenadorEditado.nombre || !this.disenadorEditado.nacionalidad || !this.disenadorEditado.estilo) {
    alert('Todos los campos son obligatorios .');
    return;
  }

  try {
 
    const response = await axios.put(`/.netlify/functions/updateDisenador/${this.disenadorEditado.id}`, this.disenadorEditado);

  
    if (response.data) {
     
      const index = this.disenadores.findIndex(d => d.id === response.data.id);
      if (index !== -1) {
        this.disenadores[index] = response.data;  
      }

     
      this.cancelEdit();
    } else {
      console.error('Error al actualizar el diseñador: respuesta inesperada del servidor.');
      alert('Hubo un problema al actualizar el diseñador.');
    }
  } catch (error) {
   
    console.error('Error al actualizar el diseñador:', error);
    if (error.response) {
      alert(`Error: ${error.response.data.error || "Hubo un problema al actualizar el diseñador."}`);
    } else {
      alert("Error de red o conexión.");
    }
  }
},

async deleteDisenador(disenador) {
  if (!disenador.id) {
    console.error('El ID del diseñador no está definido');
    return;
  }

  try {
    
    const response = await axios.delete(`/.netlify/functions/deleteDisenador/${disenador.id}`, {
      data: { id: disenador.id }  
    });

    if (response.status === 200) {
      this.disenadores = this.disenadores.filter(d => d.id !== disenador.id);
      console.log(`Diseñador con ID ${disenador.id} eliminado exitosamente.`);
    } else {
      console.error('Error al eliminar el diseñador');
    }
  } catch (error) {
    console.error('Error al eliminar el diseñador:', error);
    alert('No se pudo eliminar el diseñador. Inténtalo de nuevo más tarde.');
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
form {
  margin: 20px 0;
}

form input {
  padding: 5px;
  margin: 10px 0;
  width: 100%;
  max-width: 300px;
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
