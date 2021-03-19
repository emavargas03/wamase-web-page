<template>
  <div>
      <Header/>
      <div class="container">
          <div class="m-0 row justify-content-center">
              <div class="col-auto pt-5" logo>
                  <img src="@/assets/Wamase.png" class="mx-auto img-fluid" id="imagen" alt="IconoEmpresa"/>
              </div>
          </div>
          
      </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';


export default {
    name:"Inicio",
    components:{
        Header,
    }
}
</script>

<style>
.logo {
    display: flex;
    align-items: center;
}
</style>