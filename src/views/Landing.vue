<template>
  <div>
      <Header/>
      <div class="container pt-5">
          <div class="m-0 row justify-content-center pt-5">
              <div class="col-auto mx-auto" logo>
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