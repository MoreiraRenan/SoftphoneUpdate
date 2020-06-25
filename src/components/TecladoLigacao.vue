<template>
  <div id="app">
    <v-row class="discador">
      <button class="btn-close" @click="!transferir? getTeclado():getTransferir()">
        <v-icon dark>close</v-icon>
      </button>
      <div class="discador-text-ligacao">
        <v-text-field
          @keypress="registerDigit2($event)"
          dark
          style="font-size: 31px;"
          v-model="number"
        ></v-text-field>
      </div>
      <button @click="remover()">
        <v-icon dark>backspace</v-icon>
      </button>
    </v-row>
    <div class="grid">
      <button @click="digit('1')">1</button>
      <button @click="digit('2')">
        2
        <span>ABC</span>
      </button>
      <button @click="digit('3')">
        3
        <span>DEF</span>
      </button>
      <button @click="digit('4')">
        4
        <span>GHI</span>
      </button>
      <button @click="digit('5')">
        5
        <span>JKL</span>
      </button>
      <button @click="digit('6')">
        6
        <span>MNO</span>
      </button>
      <button @click="digit('7')">
        7
        <span>PQRS</span>
      </button>
      <button @click="digit('8')">
        8
        <span>TUV</span>
      </button>
      <button @click="digit('9')">
        9
        <span>WXYZ</span>
      </button>
      <button @click="digit('*')">*</button>
      <button @click="digit('0')">0</button>
      <button @click="digit('#')">#</button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import moment from "moment";
// import JsSIP from "jssip";
import {mapGetters, mapActions } from "vuex";
export default Vue.extend({
  data() {
    return {
      fab: false,
      mask: "##:##",
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
      transferir:"transferir"
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
    ...mapActions("ligacao", [
      "digit",
      "remover",
      "registerDigit",
      "registerDigit2",
      "getTeclado",
      "getTransferir"
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