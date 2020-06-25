<!-- eslint-disable --> 
<template  >
  <v-app>
    <v-content>
      <Phone/>
    </v-content>
  </v-app>
</template>
<script>
import Phone from './components/Phone';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
export default {
  name: 'App',
  components: {
    Phone,
  },
 data() {
    return {
    };
  },
  created() {
  },
};
</script>
<style lang="stylus" scoped>
 
</style>