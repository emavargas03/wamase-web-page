<template>
<div>
<Header></Header>

    <div class="container">
        <div class="table-responsive shadow-sm p-3 mb-5 bg-white rounded" id="tabla">

            <table class="table table-hover table-sm table-bordered table-reflow">
                <thead class="thead">
                    <tr>
                        <th scope="col">Número de Solicitud</th>
                        <th scope="col">Código del agente</th>
                        <th scope="col">Código del cliente</th>
                        <th scope="col">Comentario de Solicitud</th>
                        <th scope="col">Fecha de la solicitud</th>
                        <th scope="col">Estado</th>
                        <th v-if="estadoRechazado" scope="col">Comentario del Proveedor</th>
                        <th v-if="estadoAceptado" scope="col">Comentario del Proveedor</th>
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
                    </tr>
                </tbody>

            </table>

        </div>

    </div>

</div>
</template>

<script>
import Header from '@/components/Header.vue';
import axios from 'axios';

export default {
    name:"Dashboard",
    data(){
        return{
            ListaSolicitudes:null,
            Pagina:1,
            pendiente:false,
            apoyoAceptar:1,
            estadoRechazado:false,
            estadoAceptado:false,
            tipoEstado:"P"
        }
    },
    components:{
        Header
    },
    mounted:function(){
    var rut=window.location.href;
    var ruta =rut.search("webapp/");
    var rutaFinal=rut.substring(0,ruta);
    let urlApoyo=rutaFinal+'webapi/api/apoyos/apoyoagente'

    var bearer= 'Bearer '+localStorage.token;
    axios({ method: 'get', url: urlApoyo ,params:{'pAgente':localStorage.cod_cliente,'pTipo':localStorage.estado} ,headers: { 'Authorization': bearer } }).then(data =>{
      
      this.ListaSolicitudes=data.data.Apoyos;
      console.log(data);
      
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
  updated:function() {
    
    var rut=window.location.href;
    var ruta =rut.search("webapp/");
    var rutaFinal=rut.substring(0,ruta);
    let urlApoyo=rutaFinal+'webapi/api/apoyos/apoyoagente'

    var bearer= 'Bearer '+localStorage.token;
    axios({ method: 'get', url: urlApoyo ,params:{'pAgente':localStorage.cod_cliente,'pTipo':localStorage.estado} ,headers: { 'Authorization': bearer } }).then(data =>{
      
      this.ListaSolicitudes=data.data.Apoyos;
      console.log(data);
      
        if(data.data.Apoyos[0].ESTADO == "P"){
          this.pendiente=true;
          console.log("Funciona")
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


</script>

<style>
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