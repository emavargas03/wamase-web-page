<template>
  <div>
    <Header/>

    <div class="container">
      <div class="table-responsive shadow-sm p-3 mb-5 bg-white rounded" id="tabla">
        <h2>Lista de solicitudes</h2>
        <table class="table table-hover table-sm table-bordered table-reflow">
        <thead class="thead">
          <tr>
            <th scope="col">Número de Solicitud</th>
            <th scope="col">Código del agente</th>
            <th scope="col">Código del cliente</th>
            <th scope="col">Comentario de Solicitud</th>
            <th scope="col">Fecha de la solicitud</th>
            <th scope="col">Estado</th>
            <th v-if="pendiente" scope="col">Aceptar/Rechazar</th>
            <th v-if="estadoRechazado" scope="col">Comentario</th>
            <th v-if="estadoAceptado" scope="col">Comentario</th>
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
            <td v-if="estadoRechazado">{{solicitud.COMENTARIO_PROV}}</td>
            <td v-if="estadoAceptado">{{solicitud.COMENTARIO_PROV}}</td>
            <td v-if="pendiente">
              <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-success"  v-on:click="aceptarModal(solicitud.NUM_APOYO)">Aceptar</button>
                <button type="button" class="btn btn-danger" v-on:click="openModal(solicitud.NUM_APOYO)" :id="solicitud.NUM_APOYO">Rechazar</button>
              </div>
            </td>
            
            
          </tr>
        </tbody>
      </table>
      <div class="container">
    <div v-if="myModel">
      <transition name="model">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Rechazar</h5>
                    <button type="button" class="close" v-on:click="myModel=false">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    
                  </div>
                  <div class="modal-body">
                    <textarea name="comentarios" rows="10" cols="40" placeholder="Escriba aquí la razón" id="razon"></textarea>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" v-on:click="cancelModal" >Cancelar</button>
                    <button type="button" class="btn btn-primary" v-on:click="sendModal">Enviar</button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div v-if="acceptModal">
      <transition name="model">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Aceptar</h5>
                    <button type="button" class="close" v-on:click="acceptModal=false">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    
                  </div>
                  <div class="modal-body">
                    <textarea name="comentarios" rows="10" cols="40" placeholder="Escriba aquí la razón" id="razon"></textarea>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" v-on:click="cancelModal" >Cancelar</button>
                    <button type="button" class="btn btn-success" v-on:click="sendModal">Enviar</button>
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
    </div>

  </div>


</template>


<script>
import Header from '@/components/Header.vue';
import axios from 'axios'
export default{
  name:"Dashboard",
  data(){
    return{
      ListaSolicitudes:null,
      Pagina:1,
      myModel:false,
      pendiente:false,
      apoyoAceptar:1,
      estadoRechazado:false,
      estadoAceptado:false,
      acceptModal:false,
      tipoEstado:"P"
    }
  },
  components:{
    Header,
  },
  mounted:function(){
    var rut=window.location.href;
    var ruta =rut.search("webapp/");
    var rutaFinal=rut.substring(0,ruta);
    let urlApoyo=rutaFinal+'webapi/api/apoyos/apoyos'

    var bearer= 'Bearer '+localStorage.token;
    axios({ method: 'get', url: urlApoyo ,params:{'pProveedor':localStorage.cod_cliente,'pTipo':localStorage.estado} ,headers: { 'Authorization': bearer } }).then(data =>{
      console.log(data.data.Apoyos[0].Estado);
      this.ListaSolicitudes=data.data.Apoyos;
      
        if(data.data.Apoyos[0].ESTADO == "P"){
          this.pendiente=true;
          console.log("Funciona")
        }
     });
    if (localStorage.estado=="R"){
      this.estadoRechazado=true;
    }
    if (localStorage.estado=="A"){
      this.estadoRechazado=true;
    }

  },
  methods:{
    openModal:function(numero){
      this.myModel=true;
      this.apoyoAceptar=numero;
      this.tipoEstado="R";
    },
    aceptarModal:function(numero){
      this.acceptModal=true;
      this.apoyoAceptar=numero;
      this.tipoEstado="A";
    },
    cancelModal:function(){
      this.myModel=false;
      this.acceptModal=false;
    },
    sendModal:function(){
      let instance = axios.create();
      var rut=window.location.href;
      var ruta =rut.search("webapp/");
      var rutaFinal=rut.substring(0,ruta);
      let urlApoyo=rutaFinal+'webapi/api/apoyos/estadoapoyo'
      var bearer= 'Bearer '+localStorage.token;
      let headers={
        headers:{
          "Content-Type": "Application/JSON",
          "Authorization":bearer
          }
      }
      var comentario=document.getElementById('razon').value;
      console.log(this.apoyoAceptar);
      let json={
         'Apoyo':this.apoyoAceptar,
         'Estado':this.tipoEstado,
         'Comentario':comentario,
       };
       instance.post(urlApoyo,json,headers).then(data =>{
        console.log(data);
       });
       location.reload()
    }
  }
}
</script>

<style scoped>
#tabla {

  margin-top: 50px;


}


body {
font-family: "Poppins", sans-serif;
height: 100vh;
background-color:#ededed;
}

.modal-mask{
  position: absolute;
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
.btn-success{
  background: #60e25c;
}
.btn-danger{
  background: #e25c5c;
}
.thead{
  background: #9ed5f5;
  color: #ffffff;
}
</style>
