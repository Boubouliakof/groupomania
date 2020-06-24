<template>
  <div id="app">
    <Header />
    
    <b-container class="main">
      <router-view />
    </b-container>

    <Footer/>
  </div>
</template>

<script>
  import Header from './components/layouts/Header.vue';
  import Footer from './components/layouts/Footer.vue';

  export default {
    components: {
      Header,
      Footer
    }
  }
</script>

<style>
  #preview {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #preview img {
    max-width: 100%;
    max-height: 200px;
  }
  .main {
    min-height: 1050px;
  }
</style>