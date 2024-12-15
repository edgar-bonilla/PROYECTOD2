<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
};
</script>

<style>
/* Aquí aplicamos la lógica general */
.main-content {
  padding-top: 60px; /* Altura del header */
  padding-bottom: 60px; /* Altura del footer */
  min-height: 100vh; /* Ocupa toda la altura de la ventana */
  
  color: rgb(32, 20, 20);
}

body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}
</style>
