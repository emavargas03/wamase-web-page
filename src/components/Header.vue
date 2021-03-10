<template>
  <div>
    <b-navbar toggleable="lg" type="dark" id="barra" class="navbar-dark bg-dark">
      <a class="navbar" href="#" id="logo"><img src="@/assets/Wamase.png" id="icon" alt="IconoEmpresa"/></a>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>


        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!-- <b-navbar-nav>
            <b-nav-item href="#" id="solPen">Solicitudes Pendientes</b-nav-item>
          </b-navbar-nav> -->
          <b-nav-item-dropdown right>

            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>Solicitudes</em>
            </template>
            <b-dropdown-item href="#">Pendientes</b-dropdown-item>
            <b-dropdown-item href="#">Aceptadas</b-dropdown-item>
            <b-dropdown-item href="#">Rechazadas</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown right>

            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{usuario}}</em>
            </template>
            <b-dropdown-item href="/webapp/#" v-on:click="logout()">Cerrar sesión</b-dropdown-item>
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
      }
    }
  }
</script>

<style scoped>
#icon {
width:40%;


}
#barra{
  /* background-color:#58baed; */
  align:left;
}
#logo{
  width:250px;
}
#solPen{
  color:white;
}
</style>
