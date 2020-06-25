<!-- eslint-disable --> 
<template>
  <div>
    <v-app>
      <div class="phone-ligando">
        <div class="call-display-ligando">
          <div class="row"></div>
          <div dark class="d-flex justify-center">
            <v-icon class="icone-call">account_circle</v-icon>
          </div>
          <div dark class="info-ligacao d-flex justify-center">
            <h3>{{userRing}}</h3>
          </div>
          <div dark class="info-ligacao d-flex justify-center">
            <h4>{{times}}</h4>
          </div>
        </div>
        <div :class="!teclado?'':'call-functions'">
          <div class="grid_button_ligacao d-flex justify-space-around grid_primerio" v-if="!teclado">
            <div>
              <button class="mic" @click="onOffMic()" >
                <v-icon x-large>{{mic}}</v-icon>
                <p>Mudo</p>
              </button>
            </div>

            <div>
              <button class="mic" @click="getTeclado()">
                <v-icon x-large>dialpad</v-icon>
                <p>Teclado</p>
              </button>
            </div>
          </div>
          <div class="grid_button_ligacao d-flex justify-space-around"  v-if="!teclado">
            <div>
              <button class="mic" @click="teclado = !teclado" disabled="disabled">
                <v-icon x-large>pause</v-icon>
                <p>Pausa</p>
              </button>
            </div>

            <div>
              <button class="mic" @click="getTransferir()">
                <v-icon x-large>call_split</v-icon>
                <p>Transferir</p>
              </button>
            </div>
          </div>
          <tecladoligacao v-if="teclado"></tecladoligacao>
          <div class="d-flex justify-center btn-hangrup">
            <div class="align-self-end">
              <v-btn color="red darken-2" dark fab v-if="!transferir"  @click="hangup()">
                <v-icon dark>phone</v-icon>
              </v-btn>
                <v-btn color="green darken-2" dark fab v-if="transferir" @click="callTrasfer()" class="call">
                <v-icon dark>phone</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <v-row style="text-align:center"></v-row>
      </div>
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
      fab: false,
      mask: "##:##",
      time: 0,
      times: "00:00",
      momentInstance: moment()
    };
  },
  computed: {
    ...mapGetters("ligacao", {
      // number: 'number',
      status: "status",
      inCall: "inCall",
      mic: "mic",
      userName: "userName",
      userRamal: "userRamal",
      inRing: "inRing",
      isRegister: "isRegister",
      discando: "discando",
      teclado:"teclado",
      transferir:"transferir",
      isRunning:"isRunning",
      userRing:"userRing"
    }),
    number: {
      get() {
        return this.$store.state.ligacao.number;
      },
      set($event) {
        this.registerDigit($event);
      }
    }
  },
  methods: {
    start() {
      let minutes = "00";
      let secondes = "00";
      let hour = "00";
      let min = 0;
      let hora = 0;
      setInterval(() => {
        if (this.isRunning) {
          this.time++;
          if (this.time < 60) {
            if (this.time < 10) {
              secondes = "0" + this.time;
            } else {
              secondes = this.time;
            }
          } else {
            this.time = 0;
            secondes = "0" + this.time;
            if (min < 10) {
              minutes = "0" + String(min + 1);
            } else {
              minutes = String(min + 1);
            }
          }
          if (min < 59) {
            this.times = minutes + ":" + secondes;
          } else {
            if (hora < 10) {
              hour = "0" + String(hora + 1);
            } else {
              hour = String(hora + 1);
            }
            this.times = hour + ":" + minutes + ":" + secondes;
          }
        }
      }, 1000);
    },
    ...mapActions("ligacao", [
      "invite",
      "digit",
      "remover",
      "registerDigit",
      "registerDigit2",
      "onOffMic",
      "hangup",
      "callTrasfer",
      "getTeclado",
      "getTransferir"
    ])
  },
  created() {
    this.start();
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