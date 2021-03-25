<template>
<div>
    <Header/>
    <div class="container">
        <div class="shadow-sm p-3 mt-5 bg-white rounded buscar">
            
            <div class="row justify-content-between">
                <div class="col-4">
                    <p class="d-inline">Mostrar</p>
                    <select class="form-select form-select-sm d-inline" id="cantperpag" aria-label=".form-select-sm example" v-model="cantPag" v-on:change="cambiarPagi">
                    <option value="5" >5</option>
                    <option selected value="10">10</option>
                    <option value="15" >15</option>
                    </select>
                </div>
                <div class="col-3">
                    <button class="btn btn-sm"><img src="@/assets/search.png" alt="buscar" class="imgbuscar" v-on:click="openModal"></button>
                </div>    
            </div>
            
            
        </div>
        <div class="table-responsive shadow-sm p-3 mb-5 mt-1 bg-white rounded" id="tabla">
            <div>
                <h3>Nombre Articulo:</h3> <p>{{nombreArticulo}}</p>
            </div>
            <table class="table table-hover table-sm table-bordered table-reflow">
                <thead class="thead">
                    <tr>
                        <th scope="col">Documento</th>
                        <th scope="col">Fecha</th>
                        <th style="width=130%" scope="col">Articulo</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Descuento</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="articulo in ListaArticulos" :key="articulo.DOCUMENTO">
                        <td>{{articulo.DOCUMENTO}}</td>
                        <td>{{articulo.FECHA}}</td>
                        <td style="width=130%">{{articulo.ARTICULO}}</td>
                        <td>{{articulo.CANT_UNDS}}</td>
                        <td>{{articulo.DESCU}}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item" v-on:click="retroceder">
                            <a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                            </li>
                            <li class="page-item" v-on:click="recargar">
                            <a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                            </li>
                        </ul>
                    </nav>
                </tfoot>

            </table>
        </div>
        
    <div v-if="buscar">
      <transition name="model">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Buscar</h5>
                    <button type="button" class="close" v-on:click="buscar=false">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    
                  </div>
                  <div class="modal-body">
                    <div class="row">
                        <div class="col busqueda">
                            <label for="articulo">Articulo:</label>
                            <input type="search" id="articulo" class="form-control" placeholder="Articulo" onkeyup="this.value = this.value.toUpperCase();">
                        </div>
                        <div class="col fecha">
                            <label for="start">Desde:</label>
                            <input type="date" id="start" class="form-control" placeholder="Desde" value="Desde" >
                        </div>
                    </div>
                    <div class="row">
                        <div class="col busqueda">
                            <label for="cliente">Cliente:</label>
                            <input type="search" id="cliente" class="form-control" placeholder="Cliente" onkeyup="this.value = this.value.toUpperCase();">
                        </div>
                        
                        <div class="col fecha">
                            <label for="end">Hasta:</label>
                            <input type="date" id="end" class="form-control" placeholder="Hasta">
                        </div>
                    </div>
                    
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" v-on:click="buscar=false">Cancelar</button>
                    <button type="button" class="btn btn-primary" v-on:click="buscarRegistro">Buscar</button>
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
  


</template>

<script>
import Header from '@/components/Header.vue';
import axios from 'axios'

export default {
    name:"ArticulosAgente",
    data: function(){
        return{
            ListaArticulos:null,
            pagina:1,
            cantPag:10,
            buscar:false,
            cliente:null,
            articulo:null,
            inicio:null,
            final:null,
            totalPag:0,
            nombreArticulo:""
        }
    },
    components:{
        Header
    },
    mounted:function(){
        let instance = axios.create();
        var rut=window.location.href;
        var ruta =rut.search("webapp/");
        var rutaFinal=rut.substring(0,ruta);
        let urlArticulos=rutaFinal+'webapi/api/productos/datocliearti?page='+this.pagina+'&qty='+this.cantPag;

        var bearer= 'Bearer '+localStorage.token;

        let headers={
            headers:{
                "Content-Type": "Application/JSON",
                "Authorization":bearer
          }
        }

      let json={
        "Cliente":this.cliente,
        "Articulo":this.cliente,
        "Desde":this.cliente,
        "Hasta":this.cliente,
       };
       
       instance.post(urlArticulos,json,headers).then(data =>{
        console.log(data);
        this.ListaArticulos=data.data.Productos;
        console.log(this.ListaArticulos);
       }).catch((error)=>{
                if(error.response){
                    if(error.response.status==401){
                        localStorage.clear();
                        this.$router.push('/webapp/');
                    }
                }
            });
    },
    beforeUpdate:function(){
        //this.recargar();
    },
    methods:{
        buscarRegistro:function(){
            this.pagina=1;
            this.articulo=document.getElementById("articulo").value;
            this.cliente=document.getElementById("cliente").value;
            this.inicio=document.getElementById("start").value;
            this.final=document.getElementById("end").value;
            


            this.inicio=this.inicio+"T00:00:00-06:00";
            this.final=this.final+"T00:00:00-06:00";
            let instance = axios.create();
            var rut=window.location.href;
            var ruta =rut.search("webapp/");
            var rutaFinal=rut.substring(0,ruta);
            let urlArticulos=rutaFinal+'webapi/api/productos/datocliearti?page='+this.pagina+'&qty='+this.cantPag;
            var bearer= 'Bearer '+localStorage.token;

            let headers={
                headers:{
                    "Content-Type": "Application/JSON",
                    "Authorization":bearer
            }
            }

            let json={
                "Cliente":this.cliente,
                "Articulo":this.articulo,
                "Desde":this.inicio,
                "Hasta":this.final,
            };
            instance.post(urlArticulos,json,headers).then(data =>{
                console.log(data);
                this.ListaArticulos=data.data.Productos;
                console.log(this.ListaArticulos[0]);
                this.totalPag=this.ListaArticulos[0].PAGINAS;
                this.nombreArticulo=this.ListaArticulos[0].NOMORIGEN;
            }).catch((error)=>{
                if(error.response){
                    if(error.response.status==401){
                        localStorage.clear();
                        this.$router.push('/webapp/');
                    }
                }
            });
            this.buscar=false;
            
        },
        /* avanzar:function(){
            
            this.recargar();
        }, */
        recargar:function(){
            if(this.pagina==this.totalPag){
                this.pagina=this.totalPag;
            }else{
                this.pagina= this.pagina+1;
            }
            console.log(this.desde,this.hasta);
            console.log(this.pagina);
            let instance = axios.create();
            var rut=window.location.href;
            var ruta =rut.search("webapp/");
            var rutaFinal=rut.substring(0,ruta);
            let urlArticulos=rutaFinal+'webapi/api/productos/datocliearti?page='+this.pagina+'&qty='+this.cantPag;
            var bearer= 'Bearer '+localStorage.token;

            let headers={
                headers:{
                    "Content-Type": "Application/JSON",
                    "Authorization":bearer
            }
            }

        let json={
            "Cliente":this.cliente,
            "Articulo":this.articulo,
            "Desde":this.inicio,
            "Hasta":this.final,
        };
        console.log(json);
        
        instance.post(urlArticulos,json,headers).then(data =>{
            console.log(data);
            this.ListaArticulos=data.data.Productos;
            console.log(this.ListaArticulos);
       }).catch((error)=>{
                if(error.response){
                    if(error.response.status==401){
                        localStorage.clear();
                        this.$router.push('/webapp/');
                    }
                }
            });
       
    },
    retroceder:function(){
            if(this.pagina==1){
                this.pagina=1;
            }else{
                this.pagina= this.pagina-1;
            }
            
            console.log(this.pagina);
            let instance = axios.create();
            var rut=window.location.href;
            var ruta =rut.search("webapp/");
            var rutaFinal=rut.substring(0,ruta);
            let urlArticulos=rutaFinal+'webapi/api/productos/datocliearti?page='+this.pagina+'&qty='+this.cantPag;
            var bearer= 'Bearer '+localStorage.token;

            let headers={
                headers:{
                    "Content-Type": "Application/JSON",
                    "Authorization":bearer
            }
            }

        let json={
            "Cliente":this.cliente,
            "Articulo":this.articulo,
            "Desde":this.inicio,
            "Hasta":this.final,
        };
        
        instance.post(urlArticulos,json,headers).then(data =>{
            console.log(data);
            this.ListaArticulos=data.data.Productos;
            console.log(this.ListaArticulos);
       }).catch((error)=>{
                if(error.response){
                    if(error.response.status==401){
                        localStorage.clear();
                        this.$router.push('/webapp/');
                    }
                }
            });
       
    },
    openModal:function(){
        this.buscar=true;
        
    },
    cambiarPagi:function(){
        this.pagina=1;
        let instance = axios.create();
            var rut=window.location.href;
            var ruta =rut.search("webapp/");
            var rutaFinal=rut.substring(0,ruta);
            let urlArticulos=rutaFinal+'webapi/api/productos/datocliearti?page='+this.pagina+'&qty='+this.cantPag;
            var bearer= 'Bearer '+localStorage.token;

            let headers={
                headers:{
                    "Content-Type": "Application/JSON",
                    "Authorization":bearer
            }
            }

        let json={
            "Cliente":this.cliente,
            "Articulo":this.articulo,
            "Desde":this.inicio,
            "Hasta":this.final,
        };
        
        instance.post(urlArticulos,json,headers).then(data =>{
            console.log(data.data.Productos[0]);
            this.ListaArticulos=data.data.Productos;
            console.log(this.ListaArticulos);               
            this.totalPag=this.ListaArticulos[0].PAGINAS;

            
       }).catch((error)=>{
                if(error.response){
                    if(error.response.status==401){
                        localStorage.clear();
                        this.$router.push('/webapp/');
                    }
                }
            });
    },
    },
}
</script>

<style scoped>


th{
    font-size: 75%;
}

.busqueda{
    width: 100%;
    margin-bottom: 5px;
}
.fecha{
    width: 30%;
}
.imgbuscar{
    width: 30px;
}
h3{
    font-size: 100%;
    font-weight: 700;
}
p{
    font-size: 90%;
}

</style>