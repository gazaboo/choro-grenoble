<template>
  <router-view />
</template>


<script>

export default {
  name: 'App',
}
</script>


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

</style>