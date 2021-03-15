<template>
  <div>
    <b-navbar toggleable="lg" type="dark" id="barra" class="navbar-dark text-light ml-auto">
      <a class="navbar" href="#" id="logo"><img src="@/assets/Wamase.png" id="icon" alt="IconoEmpresa"/></a>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>


        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          
          <b-nav-item-dropdown right>

            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>Solicitudes</em>
            </template>
            <b-dropdown-item href="#" v-on:click="verPendientes">Pendientes</b-dropdown-item>
            <b-dropdown-item href="#" v-on:click="verAceptados">Aceptadas</b-dropdown-item>
            <b-dropdown-item href="#" v-on:click="verRechazados">Rechazadas</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown right c> 
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em><img src="@/assets/usuario.png" width="30px" alt="IconoEmpresa"/></em>
            </template>
              <b-dropdown-item href="#">Cambiar contraseña</b-dropdown-item>
              <b-dropdown-item href="#" v-on:click="logout()">Cerrar sesión</b-dropdown-item>
              
            
            
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
  export default{
    mounted:function(){
      this.usuario=localStorage.nombre;
    },
    methods:{
      logout (){
        console.log("Cerrar sesión");
        localStorage.clear();
        this.$router.push('/webapp/#')
      },
      verPendientes: function(){
        localStorage.estado="P";
        location.reload();
      },

      verAceptados: function(){
        localStorage.estado="A";
        location.reload();
      },
      verRechazados: function(){
        localStorage.estado="R";
        location.reload();
      }
    }
  }
</script>
F
<style scoped>
#icon {
width:40%;


}
#barra{
  color: #fff;
  background: linear-gradient( to right,  #9ed5f5,#80ccf8);
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
</style>
