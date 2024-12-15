<template>
  <div class="home-page">
    <!-- Contenedor de las tarjetas de navegación -->
    <div class="cards-container">
      <div class="card" @click="navigateTo('/automoviles')">
        <h2>Automóviles</h2>
        <p>Explora la colección completa de automóviles superdeportivos.</p>
      </div>

      <div class="card" @click="navigateTo('/fabricantes')">
        <h2>Fabricantes</h2>
        <p>Conoce las marcas icónicas que producen estos vehículos.</p>
      </div>

      <div class="card" @click="navigateTo('/diseñadores')">
        <h2>Diseñadores</h2>
        <p>Descubre a los visionarios detrás de cada diseño impresionante.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.home-page {
  font-family: 'Arial', sans-serif;
  color: white;
  display: flex;
  justify-content: center; 
  align-items: center; 
  height: 100vh; 
  padding: 0;
}

.cards-container {
  display: flex;
  justify-content: center; 
  gap: 20px;
  width: 100%;
  max-width: 900px; 
}

.card {
  background-color: #222; 
  border-radius: 12px;
  width: 30%; 
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 250px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.card h2 {
  font-size: 1.8rem;
  color: #FF8C00; /* Naranja elegante */
  margin-bottom: 10px;
}

.card p {
  font-size: 1rem;
  color: #bbb;
}

.card:hover {
  background-color: #FF8C00;
  color: white;
  transform: translateY(-8px); 
}

.card:hover h2, .card:hover p {
  color: white; 
}
</style>
