<template>
  <div>
    <b-navbar toggleable="lg" type="dark" id="barra" class="navbar-dark text-light ml-auto">
      <a class="navbar" href="#" id="logo"><img src="@/assets/logoWamase.png" v-on:click="landing" id="icon" alt="IconoEmpresa"/></a>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>


        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <div v-if="tipoU=='E'">
            <b-nav-item-dropdown right>
              <template #button-content>
                <em>Pedidos</em>
              </template>
              <b-dropdown-item href="#" v-on:click="pedido">Hacer Pedido</b-dropdown-item>
            </b-nav-item-dropdown>

          </div>
          <div v-if="tipoU=='A'">
          <b-nav-item-dropdown right>

            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>Consultas</em>
            </template>
            <b-dropdown-item href="#" v-on:click="articulosAgente">Articulo Cliente</b-dropdown-item>
          </b-nav-item-dropdown>
          </div>
          <div v-if="tipoU=='A' || tipoU=='P'">

            
            <b-nav-item-dropdown right>
              
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>Solicitudes</em>
              </template>
              <b-dropdown-item href="#" v-on:click="verPendientes">Pendientes</b-dropdown-item>
              <b-dropdown-item href="#" v-on:click="verAceptados">Aceptadas</b-dropdown-item>
              <b-dropdown-item href="#" v-on:click="verRechazados">Rechazadas</b-dropdown-item>
            </b-nav-item-dropdown>
          </div>
          <b-nav-item-dropdown right> 
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em><img src="@/assets/usuario.png" width="30px" alt="IconoEmpresa"/></em>
            </template>
              <b-dropdown-item href="#" v-on:click="openModal()">Cambiar contraseña</b-dropdown-item>
              <b-dropdown-item href="#" v-on:click="logout()">Cerrar sesión</b-dropdown-item>
              
            
            
          </b-nav-item-dropdown>
          
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div v-if="cont">
      <transition name="model">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Modificar Datos Usuario</h5>
                    <button type="button" class="close" v-on:click="cont=false">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    
                  </div>
                  <div class="modal-body">
                    <p class="etiqueta">Nombre:</p>
                    <input type="text" name="nombre" id="nombre" :value="this.nombrepersona">
                    <p class="etiqueta">Apellidos:</p>
                    <input type="text" name="apellidos" id="apellidos" :value="this.apellidos">
                    <p class="etiqueta">Contraseña actual:</p>
                    <input type="password" name="oldPassword" placeholder="Contraseña actual" id="actual"><br>
                    <p class="etiqueta">Contraseña nueva:</p>
                    <input type="password" name="newPassword" placeholder="Contraseña nueva" id="nueva">
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" v-on:click="cancelModal" >Cancelar</button>
                    <button type="button" class="btn btn-success" v-on:click="sendModal">Cambiar</button>
                    
                </div>
                <div class="alert alert-danger" role="alert" v-if="error">
                  {{error_msg}}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default{
    data:function() {
      return{
        cont:false,
        apellidos:'',
        nombrepersona:'',
        tipoU:localStorage.tipo,
        error:false,
        error_msg:""
      }
      
    },
    mounted:function(){
      this.usuario=localStorage.nombre;
    },
    methods:{
      articulosAgente(){
        this.$router.push('/webapp/articulosagente')
      },
      pedido(){
        this.$router.push('/webapp/pedido')
      },
      solicitud(){
        var rut=window.location.href;
        var ruta =rut.search("dashboardagente");
        var rutaP=rut.search("dashboards");
        if(localStorage.tipo=="A" && ruta==-1){
            this.$router.push('/webapp/dashboardagente');
        }else if (localStorage.tipo=="P" && rutaP==-1){
          this.$router.push('/webapp/dashboards');
        }
      },
      logout (){
        localStorage.clear();
        this.$router.push('/webapp/#')
      },
      verPendientes: function(){
        localStorage.estado="P";
        this.solicitud();
        //location.reload();
      },

      verAceptados: function(){
        localStorage.estado="A";
        this.solicitud();
        //location.reload();
      },
      verRechazados: function(){
        localStorage.estado="R";
        this.solicitud();
        //location.reload();
      },
      openModal:function(){
        this.nombrepersona=localStorage.nombrepersona;
        this.apellidos=localStorage.apellidos;
        this.cont=true;
        
      },
      cancelModal:function(){
        this.cont=false;
      },
      landing:function(){
        this.$router.push('inicio');
      },
      sendModal:function() {
      var oldPassword=document.getElementById('actual').value;
      var newPassword=document.getElementById('nueva').value;
      var nombre=document.getElementById('nombre').value;
      var apellidos=document.getElementById('apellidos').value;
      let instance = axios.create();
      var rut=window.location.href;
      var ruta =rut.search("webapp/");
      var rutaFinal=rut.substring(0,ruta);
      let urlApoyo=rutaFinal+'webapi/api/registro/Actualiza'
      var bearer= 'Bearer '+localStorage.token;
      let headers={
        headers:{
          "Content-Type": "Application/JSON",
          "Authorization":bearer
          }
      }
      console.log(this.apoyoAceptar);
      let json={
        "Nombre": nombre,
        "Apellidos": apellidos,
        "Email": localStorage.nombre,
        "Password": oldPassword,
        "NuevoPassword": newPassword
       };
       instance.post(urlApoyo,json,headers).then(data =>{
        console.log(data);
        if(data.data.Error=="Nombre de Usuario o Contraseña Incorrrectos"){
          this.error=true;
          this.error_msg="Contraseña actual invalida";

        }else{
          this.cont=false;

        }
       }).catch((error)=>{
            if(error.response){
                if(error.response.status==401){
                    localStorage.clear();
                    this.$router.push('/webapp/');
                }
            }
        });
      }
    }
  }
</script>

<style scoped>
#icon {
width:40%;


}
#barra{
  color: #fff;
  background: linear-gradient( to right,  #02cf8b,#01b67a);
  box-shadow: 0 4px 20px 0 rgba(0,0,0,0.14), 3px 7px 12px -5px rgba(12, 134, 116, 0.46);
  margin-top:5px;
  padding-left:0;
  padding-right:0;
}
#logo{
  width:200px;
}
#solPen{
  color:white;
}

#cuenta{
  width: 300px;
}

.etiqueta{
  margin-top: 10px;
  margin-bottom: 0%;
}
</style>
