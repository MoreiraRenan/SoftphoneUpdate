<!-- eslint-disable --> 
<template>
  <div id="app">
    <div class="container_atender">
      <v-row class="chamando">
        <div class="row relogio login">
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
      </v-row>
      <v-row class="formLogin">
        <!-- <v-card class="col-10" > -->
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="matricula" :rules="matriculaRules" label="Matrícula" required></v-text-field>
          <v-text-field
            v-model="password"
             :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            :rules="senhaRules"
            label="Senha"
            required
          ></v-text-field>
          <v-btn :disabled="!valid" class="mr-4 btnLogar" @click="logar()">Logar</v-btn>
        </v-form>
        <!-- </v-card> -->
      </v-row>
       <v-alert
       v-if="erro"
        border="right"
        dismissible
        type="error"
        elevation="2"
        width="295"
        class="alert-erro"
      >
       Erro ao tentar fazer login. Tente novamente!
      </v-alert>
    </div>
    <v-row class="imgIndra">
      <img src="../assets/img/indra.png" alt width="250" />
    </v-row>

    <v-overlay :value="overlayLogin">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
export default Vue.extend({
  data() {
    return {
      erro: null,
      matricula:"",
      password:"",
      valid: true,
      show1: false,
      momentInstance: moment(),
     matriculaRules: [v => !!v || "Informe sua matrícula"],
      senhaRules: [v => !!v || "Informe a sua senha"]
    };

  },
  computed: {
    ...mapGetters("ligacao", {
      userRing: "userRing",
      overlayLogin:'overlayLogin',
    }),
    userName: {
      get() {
        return this.$store.state.ligacao.userName;
      },
      set($event) {
        this.setNameUser($event);
      }
    }
  },
  methods: {
    ...mapActions("ligacao", [
      "loginRegister",
      "setRamal",
      "setPasswordRamal",
      "setNameUser"
    ]),
    logar() {
    let matricula = this.matricula
    let password = this.password
    this.loginRegister({ matricula, password })
      
    }
  },
  created() {},
  mounted() {
    setInterval(() => {
      this.momentInstance = moment();
    }, 1000);
  }
});
</script>

<style scoped>
@import "../assets/css/animate.css";
.alert-erro{
margin-left: 10px;
    position: absolute;
    top: 77%;
}
</style>