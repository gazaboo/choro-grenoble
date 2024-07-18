<script>

export default {
  name: 'App',
}
</script>

<template>
  <router-view />
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#app {
  width: 90vw;

  @media (min-width: 375px) {
    width: 80vw;
  }
}
</style>