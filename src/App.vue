<template>
  <v-app>
    <v-main>
      <router-view></router-view>
      <notifications position="bottom center" group="global"></notifications>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap');

  * {
    font-family: 'Fira Sans', sans-serif;
  }
</style>