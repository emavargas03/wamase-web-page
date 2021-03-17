<template>
<div>
    <Header/>
    <div class="container">
        <div class="shadow-sm p-3 mt-5 bg-white rounded">
            <div class="row">
                <div class="col busqueda">
                    <label for="articulo">Articulo:</label>
                    <input type="search" id="articulo" class="form-control" placeholder="Articulo" >
                </div>
                <div class="col fecha">
                    <label for="start">Desde:</label>
                    <input type="date" id="start" class="form-control" placeholder="Desde" value="Desde">
                </div>
            </div>
            <div class="row">
                <div class="col busqueda">
                    <label for="cliente">Hasta:</label>
                    <input type="search" id="cliente" class="form-control" placeholder="Cliente" >
                </div>
                
                <div class="col fecha">
                    <label for="end">Hasta:</label>
                    <input type="date" id="end" class="form-control" placeholder="Hasta">
                </div>
            </div>
            <button type="button" class="btn btn-primary">Buscar</button>
        </div>
        <div class="table-responsive shadow-sm p-3 mb-5 mt-1 bg-white rounded" id="tabla">
            
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
                            <!-- <li class="page-item"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li> -->
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
        "Cliente":"QUE030",
        "Articulo":"0103150",
        "Desde":"2019-01-01T00:00:00-06:00",
        "Hasta":"2021-04-21T00:00:00-06:00",
       };
       
       instance.post(urlArticulos,json,headers).then(data =>{
        console.log(data);
        this.ListaArticulos=data.data.Productos;
        console.log(this.ListaArticulos);
       });
    },
    beforeUpdate:function(){
        //this.recargar();
    },
    methods:{
        /* avanzar:function(){
            
            this.recargar();
        }, */
        recargar:function(){
            this.pagina= this.pagina+1;
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
            "Cliente":"QUE030",
            "Articulo":"0103150",
            "Desde":"2019-01-01T00:00:00-06:00",
            "Hasta":"2021-04-21T00:00:00-06:00",
        };
        
        instance.post(urlArticulos,json,headers).then(data =>{
            console.log(data);
            this.ListaArticulos=data.data.Productos;
            console.log(this.ListaArticulos);
       });
       
    },
    retroceder:function(){
            this.pagina= this.pagina-1;
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
            "Cliente":"QUE030",
            "Articulo":"0103150",
            "Desde":"2019-01-01T00:00:00-06:00",
            "Hasta":"2021-04-21T00:00:00-06:00",
        };
        
        instance.post(urlArticulos,json,headers).then(data =>{
            console.log(data);
            this.ListaArticulos=data.data.Productos;
            console.log(this.ListaArticulos);
       });
       
    }
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
.enviar{
    /* max-width: 50%; */
}

</style>