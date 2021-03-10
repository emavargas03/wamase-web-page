<template>
  <div>
    <Header/>

    <div class="container">
      <div class="table-responsive" id="tabla">
        <table class="table table-hover table-sm table-bordered table-reflow">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Número de Solicitud</th>
            <th scope="col">Código del agente</th>
            <th scope="col">Código del cliente</th>
            <th scope="col">Comentario de Solicitud</th>
            <th scope="col">Fecha de la solicitud</th>
            <th scope="col">Estado</th>
            <th scope="col">Aceptar/Rechazar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="solicitud in ListaSolicitudes" :key="solicitud.NUM_APOYO">
            <td>{{solicitud.NUM_APOYO}}</td>
            <td>{{solicitud.COD_AGENTE}}</td>
            <td>{{solicitud.COD_CLIENTE}}</td>
            <td>{{solicitud.COMENTARIO_AGEN}}</td>
            <td>{{solicitud.FECHA_SOL}}</td>
            <td>{{solicitud.ESTADO}}</td>
            <td>
              <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-success" >Aceptar</button>
                <button type="button" class="btn btn-danger" v-on:click="openModal">Rechazar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    <div v-if="myModel">
      <transition name="model">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" @click="myModel=false">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title">Rechazar</h4>
                  </div>
                  <div class="modal-body">
                    <div class="form-group"> 
                      <label>Ingrese la razón</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    </div>
    </div>

    <Footer/>
  </div>


</template>


<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios'
export default{
  name:"Dashboard",
  data(){
    return{
      ListaSolicitudes:null,
      Pagina:1,
      myModel:false,
    }
  },
  components:{
    Header,
    Footer
  },
  mounted:function(){
    var rut=window.location.href;
    var ruta =rut.search("webapp/");
    var rutaFinal=rut.substring(0,ruta);
    let urlApoyo=rutaFinal+'webapi/api/apoyos/apoyos'

    var bearer= 'Bearer '+localStorage.token;
    axios({ method: 'get', url: urlApoyo ,params:{'pProveedor':localStorage.cod_cliente,'pTipo':localStorage.tipo} ,headers: { 'Authorization': bearer } }).then(data =>{
      console.log(data);
      this.ListaSolicitudes=data.data.Apoyos;

     });

  },
  methods:{
    openModal:function(){
      this.myModel=true;
      alert("oliwis");  
    }
  }
}
</script>

<style scoped>
#tabla {

  margin-top: 50px;


}

html {
background-color: #56baed;
}

body {
font-family: "Poppins", sans-serif;
height: 100vh;
}

.modal-mask{
  position: fixed;
   z-index: 9998;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, .5);
   display: table;
   transition: opacity .3s ease;
}
   .modal-wrapper {
     display: table-cell;
     vertical-align: middle;
   }
</style>
