//Cabecera de la pagina
//Contiene todo el codigo que corresponde a los tipos de usuario, acceder a las diferentes paginas, cerrar sesion y algunas
//funciones especiales, como el carrito de compras de los empleados
<template>
  <div>
    <b-navbar toggleable="lg" type="dark" id="barra" class="navbar-dark text-light ml-auto">
      <!-- Implementacion de logo en la barra -->
      <a class="navbar" href="#" id="logo"><img src="@/assets/logoWamase.png" v-on:click="landing" id="icon" alt="IconoEmpresa"/></a>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>


        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <div v-if="tipoU=='E'">
            <!-- Si el tipo de usuario es tipo Empleado, muestra la siguiente opcion en la barra -->
            <b-nav-item-dropdown right>
              <template #button-content>
                <!-- Boton para desplegar un submenu -->
                <em>Pedidos</em>
              </template>
              <!-- En esta opcion, al hacerle click, inicia la funcion 'pedido' que esta en la parte de metodos de Vue en la parte inferior-->
              <b-dropdown-item href="#" v-on:click="pedido">Hacer Pedido</b-dropdown-item>
            </b-nav-item-dropdown>

          </div>
          <div v-if="tipoU=='A'">
          <!-- Si el tipo de usuario es tipo Agente, muestra la siguiente opcion en la barra -->
          <b-nav-item-dropdown right>

            <!-- Using 'button-content' slot -->
            <template #button-content>
              <!-- Boton para desplegar un submenu -->
              <em>Consultas</em>
            </template>
            <!-- En esta opcion, al hacerle click, inicia la funcion 'articulosAgente' que esta en la parte de metodos de Vue en la parte inferior-->
            <b-dropdown-item href="#" v-on:click="articulosAgente">Articulo Cliente</b-dropdown-item>
            <!-- En esta opcion, al hacerle click, inicia la funcion 'coberturas' que esta en la parte de metodos de Vue en la parte inferior-->
            <b-dropdown-item href="#" v-on:click="coberturas">Coberturas</b-dropdown-item>
            <!-- En esta opcion, al hacerle click, inicia la funcion 'clientesxprov' que esta en la parte de metodos de Vue en la parte inferior-->
            <b-dropdown-item href="#" v-on:click="clientesxprov">Comparativo Anual</b-dropdown-item>
          </b-nav-item-dropdown>
          </div>
          <div v-if="tipoU=='A' || tipoU=='P'">
            <!-- Si el tipo de usuario es tipo Agente o Proveedor, muestra la siguiente opcion en la barra -->
            
            <b-nav-item-dropdown right>
              
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <!-- Boton para desplegar un submenu -->
                <em>Solicitudes</em>
              </template>
              <!-- En esta opcion, al hacerle click, inicia la funcion 'verPendientes' que esta en la parte de metodos de Vue en la parte inferior-->
              <b-dropdown-item href="#" v-on:click="verPendientes">Pendientes</b-dropdown-item>
              <!-- En esta opcion, al hacerle click, inicia la funcion 'verAceptados' que esta en la parte de metodos de Vue en la parte inferior-->
              <b-dropdown-item href="#" v-on:click="verAceptados">Aceptadas</b-dropdown-item>
              <!-- En esta opcion, al hacerle click, inicia la funcion 'verRechazados' que esta en la parte de metodos de Vue en la parte inferior-->
              <b-dropdown-item href="#" v-on:click="verRechazados">Rechazadas</b-dropdown-item>
            </b-nav-item-dropdown>
          </div>
          <b-nav-item-dropdown right> 
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <!-- Muestra un icono de usuario como un boton para desplegar un submenu -->
              <em><img src="@/assets/usuario.png" width="30px" alt="IconoEmpresa"/></em>
            </template>
            <!-- En esta opcion, al hacerle click, inicia la funcion 'openModal' que esta en la parte de metodos de Vue en la parte inferior y desplega-->
            <!-- el modal cambiarCont -->
              <b-dropdown-item href="#" v-b-modal.cambiarcont v-on:click="openModal">Cambiar contraseña</b-dropdown-item>
              <!-- Al presionarlo, cierra la sesion -->
              <b-dropdown-item href="#" v-on:click="logout()">Cerrar sesión</b-dropdown-item>
              
            
            
          </b-nav-item-dropdown>
          
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- Este es un modal que -->
    <b-modal id="cambiarcont" title="Modificar Datos Usuario" ref="cambiarcont" hide-footer>
      <div class="modal-body">
        <b-row align-h="between">
          <b-col>
            
            <p class="etiqueta">Nombre:</p>
            <!-- Muestra el nombre del usuario en un campo de texto que no se puede modificar -->
            <input type="text" class="rounded" name="nombre" id="nombre" :value="this.nombrepersona" disabled>
            <p class="etiqueta">Apellidos:</p>
            <!-- Muestra los apellidos del usuario en un campo de texto que no se puede modificar -->
            <input type="text" name="apellidos" class="rounded" id="apellidos" :value="this.apellidos" disabled>
            <p class="etiqueta">Codigo:</p>
            <!-- Muestra el codigo del usuario en un campo de texto que no se puede modificar -->
            <input type="text" class="rounded" id="codigo" :value="this.codCliente" disabled>
          </b-col>
          <b-col>
            <p class="etiqueta">Contraseña actual:</p>
            <!-- Campo de contraseña actual -->
          <input type="password" name="oldPassword" class="rounded" placeholder="Contraseña actual" id="actual"><br>
          <!-- Campo de contraseña nueva-->
          <p class="etiqueta">Contraseña nueva:</p>
          <input type="password" class="rounded" name="newPassword" placeholder="Contraseña nueva" id="nueva">
          </b-col>
        </b-row>
          
          
      </div>
      <div class="modal-footer">
                    <!-- Al presionarlo cancela el modal -->
                    <button type="button" class="btn btn-secondary" v-on:click="cancelModal" >Cancelar</button>
                    <!-- Al precionarlo activa la funcion sendModal-->
                    <button type="button" class="btn btn-success" v-on:click="sendModal">Cambiar</button>
                    
                </div>
                <div class="alert alert-danger" role="alert" v-if="error">
                  <!-- Si hay un error despliega un mensage de error -->
                  {{error_msg}}//Aqui muestra el mensaje
                </div>
    </b-modal>
  </div>
</template>
<script>
// El paquete axios es para consumir apis
  import axios from 'axios'
  export default{
    data:function() {
      return{
        apellidos:'',
        nombrepersona:'',
        tipoU:localStorage.tipo,//Tipo de usuario, le asigna el que se encuentra en en localStorage del navegador.
        error:false,//Para saver si hubo un error en el envio de la nueva contrasena.
        error_msg:""//El mensaje que va a mandar cuando ocurre un error
      }
      
    },
    mounted:function(){
      this.usuario=localStorage.nombre;
    },
    methods:{
      articulosAgente(){//Este lo transporta a la vista de Articulos Agente
        this.$router.push('/webapp/articulosagente')
      },
      pedido(){//Este lo transporta a la vista de Hacer Pedido
        this.$router.push('/webapp/pedido')
      },
      solicitud(){//Este lo transporta a la vista de solicitudes, si es Agente o Proveedor lo manda a dos vistas diferentes
        var rut=window.location.href;
        var ruta =rut.search("dashboardagente");
        var rutaP=rut.search("dashboards");
        if(localStorage.tipo=="A" && ruta==-1){
            this.$router.push('/webapp/dashboardagente');
        }else if (localStorage.tipo=="P" && rutaP==-1){
          this.$router.push('/webapp/dashboards');
        }
      },
      logout (){//Este cierra la sesion y lo reenvia a la pantalla de login
        localStorage.clear();
        this.$router.push('/webapp/#')
      },
      verPendientes: function(){//Este hace que la propiedad estado en el localStorage sea igual a P
        localStorage.estado="P";
        this.solicitud();
        //location.reload();
      },

      verAceptados: function(){//Este hace que la propiedad estado en el localStorage sea igual a A
        localStorage.estado="A";
        this.solicitud();
        //location.reload();
      },
      verRechazados: function(){//Este hace que la propiedad estado en el localStorage sea igual a R
        localStorage.estado="R";
        this.solicitud();
        //location.reload();
      },
      coberturas(){//Este lo transporta a la vista de coberturas
        this.$router.push('coberturas')
      },
      openModal:function(){//Este asigna los datos que se van a mostrar en el modal para cambiar la contrasena
        this.nombrepersona=localStorage.nombrepersona;
        this.apellidos=localStorage.apellidos;
        this.codCliente=localStorage.cod_cliente;
        //this.cont=true;
        
      },
      clientesxprov(){//Este lo transporta a la vista de ComprasXProveedor
        this.$router.push('comprasxproveedor')
      },
      cancelModal:function(){//Este cierra el modal de cambiar la contrasena
        this.cont=false;
        this.$refs["cambiarcont"].hide();
      },
      landing:function(){//Este lo envia a la pagina de inicio
        this.$router.push('inicio');
      },
      sendModal:function() {//Este envia la consulta para cambiar la contrasena
      var oldPassword=document.getElementById('actual').value;
      var newPassword=document.getElementById('nueva').value;
      var nombre=document.getElementById('nombre').value;
      var apellidos=document.getElementById('apellidos').value;
      let instance = axios.create();//Crea una instancia axios
      //Creacion de la ruta para enviar la consulta
      var rut=window.location.href;
      var ruta =rut.search("webapp/");
      var rutaFinal=rut.substring(0,ruta);
      let urlApoyo=rutaFinal+'webapi/api/registro/Actualiza'
      //Consigue el token
      var bearer= 'Bearer '+localStorage.token;
      //Crea los headers
      let headers={
        headers:{
          "Content-Type": "Application/JSON",
          "Authorization":bearer
          }
      }
      //Crea el JSON
      let json={
        "Nombre": nombre,
        "Apellidos": apellidos,
        "Email": localStorage.nombre,
        "Password": oldPassword,
        "NuevoPassword": newPassword
       };
       //Se envia la consulta por post
       instance.post(urlApoyo,json,headers).then(data =>{
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
