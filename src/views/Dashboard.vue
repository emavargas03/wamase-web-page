<template>
  <div>
    <Header/>

    <div class="container">
      <div class="table-responsive shadow-sm p-3 mb-5 bg-white rounded" id="tabla">
        <h2>Lista de solicitudes</h2>
        <table class="table table-hover table-sm table-bordered table-reflow">
        <thead class="thead">
          <tr>
            <th scope="col">Número Solicitud</th>
            <th scope="col">Código agente</th>
            <th scope="col">Código cliente</th>
            <th scope="col">Comentario Solicitud</th>
            <th scope="col">Fecha solicitud</th>
            <th scope="col">Estado</th>
            <!-- Si pendiente es verdadero muestra sl contenido -->
            <th v-if="pendiente" scope="col">Aceptar/Rechazar</th>
            <!-- Si estadoRechazado es verdadero muestra sl contenido -->
            <th v-if="estadoRechazado" scope="col">Comentario Proveedor</th>
            <!-- Si estadoAceptado es verdadero muestra sl contenido -->
            <th v-if="estadoAceptado" scope="col">Comentario Proveedor</th>
          </tr>
        </thead>
        <tbody>
          <!-- Este for recorre ListaSolicitudes y muestra las propiedades de este en cada uno de los campos -->
          <tr v-for="solicitud in ListaSolicitudes" :key="solicitud.NUM_APOYO">
            <td>{{solicitud.NUM_APOYO}}</td>
            <td>{{solicitud.COD_AGENTE}}</td>
            <td>{{solicitud.COD_CLIENTE}}</td>
            <td>{{solicitud.COMENTARIO_AGEN}}</td>
            <td>{{fecha(solicitud.FECHA_SOL)}}</td>
            <td>{{solicitud.ESTADO}}</td>
            <td v-if="estadoRechazado">{{solicitud.COMENTARIO_PROV}}</td>
            <td v-if="estadoAceptado">{{solicitud.COMENTARIO_PROV}}</td>
            <!-- Si pendiente es verdadero lo muestra -->
            <td v-if="pendiente">
              <div class="btn-group" role="group" aria-label="Basic example">
                <!-- <button type="button" class="btn btn-success"  v-on:click="aceptarModal(solicitud.NUM_APOYO)">Aceptar</button> -->
                <b-button v-b-modal="'aceptar'" class="btn-success" v-on:click="aceptarModal(solicitud.NUM_APOYO)">Aceptar</b-button>
                <b-button v-b-modal="'rechazar'" class="btn-danger" v-on:click="openModal(solicitud.NUM_APOYO)">Rechazar</b-button>
              </div>
            </td>
            
            
          </tr>
        </tbody>
      </table>

    
  

    </div>
    </div>

    <b-modal id="aceptar" title="Aceptar" ref="aceptar" hide-footer>
                  <div class="modal-body">
                    <textarea name="comentarios" rows="10" cols="50" placeholder="Escriba aquí la razón" id="razon"></textarea>
                  </div>
                  <div class="modal-footer">
                    <!-- Inicia la funcion cancelModal -->
                    <button type="button" class="btn btn-secondary" v-on:click="cancelModal" >Cancelar</button>
                    <!-- Inicia la funcion sendModal -->
                    <button type="button" class="btn btn-primary" v-on:click="sendModal">Enviar</button>
                
    </b-modal>
        <b-modal id="rechazar" title="Rechazar" ref="rechazar" hide-footer>
                  <div class="modal-body">
                    <textarea name="comentarios" rows="10" cols="50" placeholder="Escriba aquí la razón" id="razon"></textarea>
                  </div>
                  <div class="modal-footer">
                    <!-- Inicia la funcion cancelModal -->
                    <button type="button" class="btn btn-secondary" v-on:click="cancelModal" >Cancelar</button>
                    <!-- Inicia la funcion sendModal -->
                    <button type="button" class="btn btn-primary" v-on:click="sendModal">Enviar</button>
                
    </b-modal>
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
      myModel:false,
      pendiente:false,
      apoyoAceptar:1,
      estadoRechazado:false,
      estadoAceptado:false,
      acceptModal:false,
      tipoEstado:"P",
      numeroSolicitud:null
    }
  },
  components:{
    Header,
  },
  mounted:function(){
    //Cuando se crea,busca todos los pedidos que estan en pendiente
    var rut=window.location.href;
    var ruta =rut.search("webapp/");
    var rutaFinal=rut.substring(0,ruta);
    let urlApoyo=rutaFinal+'webapi/api/apoyos/apoyos'

    var bearer= 'Bearer '+localStorage.token;
    axios({ method: 'get', url: urlApoyo ,params:{'pProveedor':localStorage.cod_cliente,'pTipo':localStorage.estado} ,headers: { 'Authorization': bearer } }).then(data =>{
      console.log(data.data.Apoyos[0].Estado);
      this.ListaSolicitudes=data.data.Apoyos;
      //
      if(data.data.Apoyos[0].ESTADO == "P"){
        this.pendiente=true;
        console.log("Funciona")
      }
    }).catch((error)=>{
              if(error.response){
                  if(error.response.status==401){
                      localStorage.clear();
                      this.$router.push('/webapp/');
                  }
              }
          });
    if (localStorage.estado=="R"){
      this.estadoRechazado=true;
      this.estadoAceptado=false;
      this.pendiente=false;
    }
    if (localStorage.estado=="A"){
      this.estadoAceptado=true;
      this.estadoRechazado=false;
      this.pendiente=false;
    }
    if(localStorage.estado=="P"){
      this.estadoRechazado=false;
      this.estadoAceptado=false;
      this.pendiente=true;
    }

  },
  beforeUpdate:function() {
    //En el momento antes de actualizar la vista, ejectuta la funcion updateTable
    this.updateTable();
    
  },
  methods:{
    openModal:function(numero){
      this.apoyoAceptar=numero;
      this.tipoEstado="R";
    },
    aceptarModal:function(numero){
      this.apoyoAceptar=numero;
      this.tipoEstado="A";
    },
    cancelModal:function(){
      this.myModel=false;
      this.acceptModal=false;
      this.$refs['aceptar'].hide();
      this.$refs['rechazar'].hide();
    },
    sendModal:function(){
      //Ejecuta la consulta para aceptar o rechazar un pedido
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
      console.log(this.apoyoAceptar);
      var comentario=document.getElementById('razon').value;
      console.log(this.apoyoAceptar);
      let json={
         'Apoyo':this.apoyoAceptar,
         'Estado':this.tipoEstado,
         'Comentario':comentario,
       };
       instance.post(urlApoyo,json,headers).then(data =>{
        console.log(data);
       }).catch((error)=>{
                if(error.response){
                    if(error.response.status==401){
                        localStorage.clear();
                        this.$router.push('/webapp/');
                    }
                }
            });
       this.$refs['aceptar'].hide();
       this.$refs['rechazar'].hide();

       //location.reload()
    },
    
    fecha:function(fecha){
      //Convierte la fecha a un formato mas comodo a la vista
      var date = new Date(fecha);
      var n=date.toLocaleString();
      return n;
    },
    updateTable:function() {
      //Actualiza la tabla    
      var rut=window.location.href;
      var ruta =rut.search("webapp/");
      var rutaFinal=rut.substring(0,ruta);
      let urlApoyo=rutaFinal+'webapi/api/apoyos/apoyos'

      var bearer= 'Bearer '+localStorage.token;
      axios({ method: 'get', url: urlApoyo ,params:{'pProveedor':localStorage.cod_cliente,'pTipo':localStorage.estado} ,headers: { 'Authorization': bearer } }).then(data =>{
        //console.log(data.data.Apoyos[0].Estado);
        this.ListaSolicitudes=data.data.Apoyos;

      }).catch((error)=>{
                  if(error.response){
                      if(error.response.status==401){
                          localStorage.clear();
                          this.$router.push('/webapp/');
                      }
                  }
              });
      if (localStorage.estado=="R"){
        this.estadoRechazado=true;
        this.estadoAceptado=false;
        this.pendiente=false;
      }
      if (localStorage.estado=="A"){
        this.estadoAceptado=true;
        this.estadoRechazado=false;
        this.pendiente=false;
      }
      if(localStorage.estado=="P"){
        this.estadoRechazado=false;
        this.estadoAceptado=false;
        this.pendiente=true;
      }
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

 /* .modal-mask{
    display:flex!important;
    flex-direction:column;
    justify-content:center;
    align-content:center;
    align-items: flex-start;
}/* 
   .modal-wrapper {
     display: table-cell;
     vertical-align: middle;
   } */
.btn-success{
  background: #06c000;
}
.btn-danger{
  background: #d61919;
}
.thead{
  background: #02cf8b;
  color: #ffffff;
}
textarea {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    width: 100%;
}
</style>
