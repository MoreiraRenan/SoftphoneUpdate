/* eslint-disable */
import AuthService from '@/services/AuthService'
import JsSIP from "jssip";
import Swal from 'sweetalert2'
import {Howl} from 'howler' 
const {ipcRenderer} = window.require("electron");

ipcRenderer.send('log-info', 'Iniciando o Aplicativo')

const state = {
    autoatendimento:false,
    overlayLogin:false,
    number: "",
    rtcSession: "",
    isRegister: false,
    status: "",
    audio: new Audio(),
    userRamal: '',
    ramalPassword: '',
    userName: '',
    teclado: false,
    transferir: false,
    discando: false,
    inCall: false,
    inRing: false,
    isRunning: false,
    eventHandlers: {},
    beep :new Howl({
        src: '/sounds/beep.wav',
        autoplay: false,
        loop: false
      }),
    ring :new Howl({
        src: '/sounds/1614.wav',
        autoplay: false,
        loop: true,
        volume: 0.5
      }),
    changer: new Howl({
        src: "/sounds/0452.wav",
        autoplay: false,
        loop: true,
        volume: 0.5
      }),
    ocupado: new Howl({
        src: "/sounds/ocupado.mp3",
        autoplay: false,
        loop: false,
        volume: 0.5
      }),
    desligar: new Howl({
        src: "/sounds/desligar.mp3",
        autoplay: false,
        loop: false,
        volume: 1.5
      }),
    mic: "mic",
    userRing: "Não Identificado",
    old_rtcSession: ""
}
// getters
const getters = {
    autoatendimento:state=>state.autoatendimento,
    overlayLogin: state=>state.overlayLogin,
    discando: state => state.discando,
    userRamal: state => state.userRamal,
    ramalPassword: state => state.ramalPassword,
    userName: state => state.userName,
    rtcSession: state => state.rtcSession,
    number: state => state.number,
    status: state => state.status,
    audio: state => state.audio,
    inCall: state => state.inCall,
    inRing: state => state.inRing,
    ring: state => state.ring,
    changer: state => state.changer,
    ocupado: state => state.ocupado,
    desligar: state => state.desligar,
    mic: state => state.mic,
    userRing: state => state.userRing,
    isRegister: state => state.isRegister,
    old_rtcSession: state => state.old_rtcSession,
    teclado: state => state.teclado,
    transferir: state => state.transferir,
    isRunning: state => state.isRunning

}
// actions
const actions = {
    loginRegister({ commit, state }, user) {
        try {
            state.overlayLogin = true
            AuthService.authenticate(user.matricula, user.password)
                .then(res => {
                    var data = JSON.parse(res.request.response)
                    state.autoatendimento = data.user.autoatend !=1?false:true
                    console.log(state.autoatendimento)
                    state.userName = data.user.nome;
                    state.userRamal = data.user.ramal;
                    ipcRenderer.send('log-info','Registrando '+data.user.nome+ "no ramal "+data.user.ramal);
                    let socket = new JsSIP.WebSocketInterface("wss://central.infraticampos.com.br:1790/ws");
                    let config = {
                        sockets: socket,
                        uri: "sip:" + state.userRamal + "@central.infraticampos.com.br:1789",
                        password: "UCpYupsCxEQaAf",
                        display_name: state.userName
                    };
                    if (state.userRamal != "") {
                        this.SIP = new JsSIP.UA(config);
                        this.SIP.start();
                        this.SIP.register();
                        commit('Event', { SIP: this.SIP })
                    }
                })
                .catch(err => {
                    state.overlayLogin = false
                    if(err == 'Error: Request failed with status code 401' || err =='Error: Request failed with status code 404'){
                        ipcRenderer.send('log-error','Usuário ou senha incorretos');
                        Swal.fire({
                            icon: 'warning',
                            title: 'Oops...',
                            text: 'Usuário ou senha incorretos'
                        })
                    }else{
                        ipcRenderer.send('log-error',err);
                        Swal.fire({
                            icon: 'warning',
                            title: 'Oops...',
                            text: err
                        })
                    }
                })
        } catch (error) {
            state.overlayLogin = false
         
            ipcRenderer.send('log-error',error);
        }

    },
    callTrasfer({ state }) {
        ipcRenderer.send('log-info','transferindo ligação para o numero'+state.number);
        if (state.number.length > 0) {
            var extraHeaders = ['X-Foo: foo', 'X-Bar: bar'];
            var options = {
                'duration': 10,
                'interToneGap': 10,
                'extraHeaders': extraHeaders
            };
            state.rtcSession.sendDTMF('*2', options);
            state.rtcSession.sendDTMF(state.number, options);
        }
    },
    onOffMic({ commit }) {
        commit('onOffMic')
    },
    atender({ state }) {
        state.changer.stop()
        var options = {
            mediaConstraints: { audio: true, video: false }
        };
        state.rtcSession.answer(options);
    },
    hangup({ state }) {
        state.desligar.play();
        state.rtcSession.terminate();
        state.inCall = false;
    },
    logoff({ state }) {
        if(state.rtcSession != null){
            state.rtcSession.terminate();
        }
        state.inCall = false;
        this.SIP.unregister();
        this.SIP.stop()
    },
    invite({ state }) {
        let eventHandlers = {
            failed: e => {
                
                state.isRunning = false
                state.inCall = false;
                state.discando = false
                state.ring.pause();
                try {
                    state.rtcSession.terminate()
                } catch (error) {
                    state.rtcSession = null
                }
                switch (e.cause) {
                    case 'Busy':
                        ipcRenderer.send('log-warn','Ramal ocupado ou ligação recuzada');
                        Swal.fire({
                            icon: 'info',
                            title: 'Oops...',
                            text: 'Erro ao realizar ligação. chamada não autorizada ou recuzada'
                        })
                    break;
                    case 'Canceled':
                            ipcRenderer.send('log-warn','Chamada cancelada');
                    break;
                    case 'User Denied Media Access':
                        ipcRenderer.send('log-warn','Ligação finalizada (microfone ou fone com problema)');
                        Swal.fire({
                            icon: 'info',
                            title: 'Oops.Detectamos um erro no seu headset',
                            text: 'Verifique seu headSet.'
                        })
                    break;
                    default:
                        ipcRenderer.send('log-warn','Erro na ligação: '+e.cause);
                        Swal.fire({
                            icon: 'info',
                            title: 'Oops...',
                            text: 'Erro ao realizar ligação. chamada não autorizada'
                        })
                    break;
                }
            },
            ended: e => {
                ipcRenderer.send('log-info','Fim da ligação');
                if (e.cause != "undefined") {
                    e.cause = "";
                }
                state.isRunning = false
                state.discando = false
                state.status = "Livre";
                state.ring.pause();
                state.desligar.play();
                state.inCall = false;
                state.rtcSession = null;
            },
            confirmed: () => {
                state.ring.pause();
                ipcRenderer.send('log-info','Em ligação com '+state.number);
                if (state.rtcSession.connection.getRemoteStreams().length > 0) {
                    try {
                        state.userRing = state.number
                        state.inCall = true;
                        state.number = ""
                        state.discando = false
                        state.status = "Em ligação";
                        state.audio.srcObject = state.rtcSession.connection.getRemoteStreams()[0];
                        state.isRunning = true
                        state.audio.play();

                    } catch (error) {
                        alert(error);
                    }
                }
            },
            progress: () => {
                state.inCall = true;
                state.ring.play();
                state.discando = false
            }
        };
        var options = {
            eventHandlers: eventHandlers,
            extraHeaders: ["X-FROM: WEB"],
            sessionTimersExpires: 180,
            mediaConstraints: { audio: true, video: false }
        };
        if (state.isRegister) {
            if (state.number.length > 1) {
                ipcRenderer.send('log-info','Fazendo ligação para '+state.number);
                state.discando = true
                state.rtcSession = this.SIP.call(
                    "sip:" + state.number + "@central.infraticampos.com.br:1789",
                    options
                );
            } else {
                alert("infrome o ramal")
            }
        } else {
            alert("Ramal não registrado")
            return false;
        }

    },
    digit({ commit }, numero) {
        commit('digit', { numero: numero })
    },
    remover({ commit }) {
        commit('remover')
    },
    setRamal({ commit }, numero) {
        commit('ramal', { numero: numero })
    },
    setPasswordRamal({ commit }, senha) {
        commit('senha', { senha: senha })
    },
    setNameUser({ commit }, nome) {
        commit('nome', { nome: nome })
    },
    registerDigit({ commit }, x) {
        commit('registerDigit', { numero: x })
    },
    getTeclado({ commit }) {
        commit('teclado')
    },
    getTransferir({ commit }) {
        commit('transferir')
    },
}
// mutations
const mutations = {
    Event(state, { SIP }) {
        SIP.on("registered", () => {
            ipcRenderer.send('log-info','Ramal registrado com sucesso');
            state.isRegister = true;
            state.status = "Livre";
        });

        SIP.on("unregistered", () => {
            ipcRenderer.send('log-warn','Ramal desregistrado');
            state.isRegister = false;
            return "Ramal desconectado";
        });
        SIP.on("registrationFailed", e => {
            ipcRenderer.send('log-warn','Falha ao registra ramal: ' + e.cause);
            state.isRegister = false;
            if (e.cause == 'Rejected') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ramal não autorizado. Entre em contato com a Infra'
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: e.cause
                })
            }
            return "Erro ao logar";

        });

        SIP.on("connected", () => { });

        SIP.on("disconnected", () => { });

        SIP.on("newRTCSession", e => {
            if (state.rtcSession) {
                e.session.terminate();
                return false;
            } else {
                ipcRenderer.send('win-show','tocando');

                if (e.originator == "remote") {
                    state.userRing = e.session._remote_identity.uri._user;
                    if(!state.autoatendimento){
                        ipcRenderer.send('log-info','Recebendo ligação de '+state.userRing);
                    state.inCall = false;
                    state.inRing = true
                     state.changer.play();
                     state.rtcSession = e.session; 
                    }else{
                        ipcRenderer.send('log-info','Recebendo ligação de '+state.userRing+'(Autoatendimento)');
                        state.inCall = true;
                        state.inRing = false
                         state.beep.play();
                         state.rtcSession = e.session; 
                         var options = {
                            mediaConstraints: { audio: true, video: false }
                        };
                        state.rtcSession.answer(options);
                    }
                  

                    state.rtcSession.on("accepted", () => {
                        state.changer.stop();
                        state.inCall = true;
                        state.inRing = false;
                    });
                    state.rtcSession.on("confirmed", () => {
                        ipcRenderer.send('log-info','Em ligação com '+state.userRing);
                        state.isRunning = true;
                        state.status = "Em ligação";
                        state.inRing = false;
                        state.inCall = true;
                        state.audio.srcObject = state.rtcSession.connection.getRemoteStreams()[0];
                        state.audio.play();
                    });
                    state.rtcSession.on("ended", () => {
                        ipcRenderer.send('log-info','Fim da ligação de '+state.userRing);
                        state.isRunning = false;
                        state.inCall = false;
                        state.inRing = false;
                        state.rtcSession = null;
                        state.status = "Livre";
                        state.desligar.play();
                    });
                    state.rtcSession.on("failed", e => {
                        state.changer.stop()
                        if(e.cause=="Rejected"){
                            ipcRenderer.send('log-warn','Ligação '+state.userRing+' recusada');
                            Swal.fire({
                                icon: 'warning',
                                title: 'Ligação recusada',
                                text:  'Essa ação não é permitida'
                            })
                        }else if(e.cause=='Canceled'){
                            ipcRenderer.send('log-warn','Ligação não atendida');
                        }else{
                            ipcRenderer.send('log-warn','Falha na ligação: '+e.cause);
                        }
                        state.isRunning = false;
                        state.inRing = false;
                        state.inCall = false;
                        state.rtcSession = null;
                        state.desligar.play();
                    });
                } else if (e.originator == "local") {
                    state.rtcSession = e.session;
                }
            }
        });

    },
    digit(state, { numero }) {
        state.number += numero;
    },
    nome(state, { nome }) {
        state.userName = nome
    },
    ramal(state, { numero }) {
        state.userRamal = numero
    },
    teclado(state) {
        state.teclado = !state.teclado
    },
    transferir(state) {
        state.teclado = !state.teclado
        state.transferir = !state.transferir
    },
    senha(state, { senha }) {
        state.userPassword = senha
    },
    registerDigit(state, { numero }) {
        state.number = numero;
    },
    remover(state) {
        state.number = state.number.substring(0, state.number.length - 1);
    },
    onOffMic(state) {
        if (state.mic == "mic") {
            state.mic = "mic_off";
            ipcRenderer.send('log-info','Desativando o mic');
            state.rtcSession.mute({ audio: true });
        } else {
            ipcRenderer.send('log-info','Ativando o mic');
            state.mic = "mic";
            state.rtcSession.unmute({ audio: true });
        }
    },
    logoff(state) {
        ipcRenderer.send('log-info','saindo do aplicativo');
        this.SIP.unregister()
        this.SIP.stop()
        state.isRegister = false
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}