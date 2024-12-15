<template>
  <footer class="app-footer">
    <p>&copy; 2024 Automóviles Superdeportivos. Todos los derechos reservados.</p>
  
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
};
</script>

<style scoped>
.app-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #1B1B1B; /* Fondo gris oscuro que contrasta con el negro puro */
  color: white;
  padding: 20px 10px; /* Mayor altura del footer */
  text-align: center;
  font-size: 1rem; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-top: 2px solid #FF8C00; /* Línea superior naranja */
  flex-wrap: wrap; /* Para asegurar que el contenido no se desborde en pantallas pequeñas */
}

.app-footer p {
  margin: 0;
  font-size: 0.9rem; 
  text-align: center;
  flex: 1;
}

.app-footer .social-icons {
  display: flex;
  justify-content: center;
  flex: 1;
}

.app-footer .social-icons a {
  margin: 0 10px;
  transition: all 0.3s ease; 
}

.app-footer .social-icons img {
  width: 28px; 
  height: auto;
  filter: grayscale(100%); 
  transition: all 0.3s ease;
}

.app-footer .social-icons a:hover img {
  filter: grayscale(0%); /* Vuelve al color original */
  transform: scale(1.2); /* Efecto de zoom */
}

.app-footer .social-icons img:hover {
  filter: brightness(1.2); /* Aumenta la luminosidad */
}

.app-footer .social-icons a:hover {
  color: #FF8C00; 
}

@media (max-width: 768px) {
  .app-footer {
    flex-direction: column; 
    align-items: center; 
    padding: 20px 0; 
  }

  .app-footer p {
    margin-bottom: 10px; 
    text-align: center; 
  }

  .app-footer .social-icons {
    justify-content: center; 
  }
}
</style>
