<!-- eslint-disable --> 
<template>
  <div id="app">
    <v-app id="inspire">
            <v-overlay  :value="discando">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
      <v-card class="mx-auto card-principal" width="350" height="600" outlined>
        <!-- <img src="../assets/img/celular.png" width="340px" class="borda-phone" alt /> -->
        <div class="phone" v-if="!inRing && isRegister == true && !inCall">
          <div class="call-display">
            <div class="row relogio">
              <div class="col callout calendar-day">
                <div class="grid-x align-middle align-middle">
                  <div class="auto cell">
                    <h5>{{ this.momentInstance.format('DD/MM/YYYY') }}</h5>
                    <h5>{{ this.momentInstance.format('dddd[.] HH:mm:ss') }}</h5>
                  </div>
                </div>
              </div>
              <div class="w-100"></div>
            </div>
            <v-row class="call-info">
              <div class="col">
                <span class="call-name">{{status}}</span>
                <span class="call-number">Ramal:{{userRamal}}</span>
                <span class="call-number">{{userName}}</span>
              </div>
            </v-row>
          </div>
          <teclado v-if="!inCall"></teclado>
           <div class="grid_button">
            <div>
              <div>
                <button class="mic" v-if="inCall" @click="onOffMic()">
                  <v-icon x-large dark>{{mic}}</v-icon>
                </button>
              </div>
            </div>
            <div>
              <v-btn color="red darken-2" dark fab v-if="inCall" @click="hangup()" class="hangup">
                <v-icon dark>phone</v-icon>
              </v-btn>
              <v-btn color="green darken-2" dark fab v-if="!inCall" @click="invite()" class="call">
                <v-icon dark>phone</v-icon>
              </v-btn>
            </div>
            <div>
              <v-speed-dial v-model="fab" v-if='inCall' class="trasfer_call">
                <template v-slot:activator>
                  <v-btn v-model="fab" color="blue darken-2" dark fab>
                    <v-icon v-if="fab">mdi-close</v-icon>
                    <v-icon v-else>graphic_eq</v-icon>
                  </v-btn>
                </template>

                <v-tooltip left>
                  <template v-slot:activator="{on}">
                    <v-btn fab dark small :v-on="on" @click="callTrasfer()" color="green">
                      <v-icon>call_split</v-icon>
                    </v-btn>
                  </template>
                  <span>Trasferir</span>
                </v-tooltip>
              </v-speed-dial>
            </div>
          </div>
          <v-row style="text-align:center"></v-row>
        </div>
      <telaprincipal v-if="inCall"></telaprincipal>
        <atender v-if="inRing &&  isRegister == true"></atender>
        <login v-if="!isRegister"></login>
    
      </v-card>
    </v-app>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import moment from "moment";
// import JsSIP from "jssip";
import { mapGetters, mapActions } from "vuex";
export default Vue.extend({
  data() {
    return {
       fab:false,
       mask: '##:##',
      momentInstance: moment()
    };
  },
  computed: {
    ...mapGetters("ligacao", {
      // number: 'number',
      status: "status",
      inCall: "inCall",
      mic: "mic",
      userName:"userName",
      userRamal:"userRamal",
      inRing: "inRing",
      isRegister:"isRegister",
      discando:"discando"
    }),
    number: {
      get() {
        return this.$store.state.ligacao.number;
      },
      set($event) {
        // alert($event)
        this.registerDigit($event);
      }
    }
  },
  methods: {
    ...mapActions("ligacao", [
      "invite",
      "digit",
      "remover",
      "registerDigit",
      "registerDigit2",
      "onOffMic",
      "hangup",
      "callTrasfer"
    ])
  },
  created() {
     this.$store.dispatch("ligacao/register");
  },
  mounted() {
    setInterval(() => {
      this.momentInstance = moment();
    }, 1000);
  }
});
</script>
<style scoped>
.callout.calendar-day {
  padding: 0.8rem 1.9rem;
}
.callout.calendar-day h1 {
  margin: 0 1rem 0 0;
  color: #2540f4;
}
.callout.calendar-day h6 {
  margin: 0;
}
.callout.calendar-day h6.light {
  color: #a8b4cb;
}
@import "../assets/css/animate.css";
@import "../assets/css/phone.css";
</style>