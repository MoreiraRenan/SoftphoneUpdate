<template>
  <div id="app">
  <div class="container_atender">
          <v-row class="chamando">
            <div class="row relogio">
              <div class="col callout calendar-day">
                <div class="grid-x align-middle align-middle">
                  <div class="auto cell">
                    <h6>{{ this.momentInstance.format('DD/MM/YYYY') }}</h6>
                    <h6>{{ this.momentInstance.format('dddd[.] HH:mm:ss') }}</h6>
                  </div>
                </div>
              </div>
              <div class="w-100"></div>
            </div>
          <div class="col-12">
            <h5>Recebendo chamada</h5>
              <h3>{{userRing}}</h3>
              <h4></h4>
            </div>
          </v-row>
          <v-row>
            <img src="../assets/img/grandprofilfb.jpg" alt class="img" />
          </v-row>
          <v-row class="btn-atender">
            <v-col>
             
               <v-btn color="green darken-2" dark large fab  @click="atender()" class="animated infinite pulse faster call">
                <v-icon dark>phone</v-icon>
              </v-btn>
            </v-col>
            <v-col>
               <v-btn color="red darken-2" dark large fab @click="hangup()" class="hangup animated infinite pulse faster">
                <v-icon dark>phone</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
  </div>
</template>
<script lang="ts">

import Vue from "vue";
import moment from "moment";
import { mapGetters,mapActions } from "vuex";
export default Vue.extend({
  data() {
    return {
       momentInstance: moment()
    };
  },
  computed:{
 ...mapGetters("ligacao", {
      userRing: "userRing",
      changer:"changer"
    }),
  },
  methods: {
   ...mapActions("ligacao", [
      "hangup",
      "atender"
    ])
  },
  created() {
    this.changer.play()
  },
  mounted() {
    setInterval(() => {
      this.momentInstance = moment();
    }, 1000);
  }
});
</script>

<style scoped>
@import "../assets/css/animate.css";
</style>