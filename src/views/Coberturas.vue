//Muestra las coberturas de los Agentes
<template>
  <div>
      <Header/>
        <b-container>
            <div class="table-responsive shadow-sm p-3 mb-5 bg-white rounded" id="tabla">
                <b-row align-h="start">
                    <!-- Este select se llena con los respectivos proveedores de cada Agente -->
                    <select class="form-select form-select-sm d-inline rounded ml-3 provee" id="prov" aria-placeholder="" v-model="proveedorActual" aria-label=".form-select-sm example" v-on:change="cambiarProveedor">
                    <option class="provee" value="" disabled selected>Proveedor</option>
                    <option class="provee rounded" v-for="proveedor in ListaProveedores" :value="proveedor.COD_PROVEEDOR" :key="proveedor.COD_PROVEEDOR" >{{proveedor.PROVEEDOR}}</option>
                    </select>
                </b-row>
            </div>
            <div class="table-responsive table-condensed shadow-sm p-3 mb-5 bg-white rounded" id="tabla">
                <table class="table table-hover table-sm table-bordered table-reflow">
                    <thead>
                        <th scope="col" style="width: 40%">Cliente</th>
                        <th scope="col" style="width: 15%" >Tipo</th>
                        <!-- Se llena con los articulos -->
                        <th v-for="i in Columnas" :key="i" scope="col">{{i}}</th>
                    </thead>
                    <thead class="bg-info">
                        <th class="bg-light"></th>
                        <th style="width: 10%" scope="col" >Cantidad Clientes:</th>
                        <!-- Se llena con la cantidad de clientes en cada articulo -->
                        <th v-for="i in Totales" :key="i" scope="col">{{i}}</th>
                    </thead>
                    <tbody>
                            <!-- Se llena con  las coberturas de cada articulo y cliente-->
                            <tr v-for="cobertura in ListaCoberturas" :key="cobertura">
                                <td v-for="cob in cobertura" :key="cob">{{cob}}</td>
                            </tr>
                    </tbody>
                </table>
            </div>
        </b-container>

  </div>


</template>

<script>
import Header from '@/components/Header.vue';
import axios from 'axios';

export default {
    name:'Coberturas',
    components:{
        Header
    },
    data:function() {
        return{
            ListaProveedores:null,
            proveedorActual:'',
            ListaCoberturas:"",
            Columnas:[],
            Totales:[],
            li:[]
        }
    },
    mounted:function(){
        //Este se ejecuta cuando se inicia la vista, busca cuales son los proveedores del agente
        let instance = axios.create();
        var rut=window.location.href;
        var ruta =rut.search("webapp/");
        var rutaFinal=rut.substring(0,ruta);
        let urlArticulos=rutaFinal+'/webapi/api/general/provagente?pAgente='+localStorage.getItem("cod_cliente");
        var bearer= 'Bearer '+localStorage.token;

        let headers={
            headers:{
                "Content-Type": "Application/JSON",
                "Authorization":bearer
        }
    }

        let json={};
        instance.post(urlArticulos,json,headers).then(data =>{
           
            this.ListaProveedores=data.data.PROVEEDORES;
        }).catch((error)=>{
            if(error.response){
                if(error.response.status==401){
                    localStorage.clear();
                    this.$router.push('/webapp/');
                }
            }
        });
    },
    methods:{
        calcularTotal:function(){
            // Primero recorre los campos de la Lista Coberturas para saber cuantos son
            var lista=[];
            for(var i in this.ListaCoberturas[0]){
                lista.push(0);
                console.log(i);
            }
            lista.shift();
            lista.shift();
            for(var e in this.ListaCoberturas){
                // Despues los recorre todos para ir sumandolos
                var cont=0;
                for(var o in this.li){
                    if(this.ListaCoberturas[e][this.li[o]] > 0){
                        // lista[cont]+=parseFloat(this.ListaCoberturas[e][this.li[o]]);
                        lista[cont]+=1;
                    }
                    
                    cont+=1;
                }
            }

            this.Totales=lista;
        },
        cambiarProveedor:function(){
            // Realiza la busqueda de las coberturas por proveedor
            this.ListaCoberturas=[];
            var prov=this.proveedorActual;
            let instance = axios.create();
            var rut=window.location.href;
            var ruta =rut.search("webapp/");
            var rutaFinal=rut.substring(0,ruta);
            let urlArticulos=rutaFinal+'/webapi/api/compras/cobertura?pAgente='+localStorage.getItem("cod_cliente")+"&pProveedor="+prov;
            var bearer= 'Bearer '+localStorage.token;

            let headers={
                headers:{
                    "Content-Type": "Application/JSON",
                    "Authorization":bearer
            }
        }

            let json={};
            instance.post(urlArticulos,json,headers).then(data =>{
                
                this.ListaCoberturas=data.data.ComprasCliente;
                this.cargarColumnas();
                this.calcularTotal();
            }).catch((error)=>{
                if(error.response){
                    if(error.response.status==401){
                        localStorage.clear();
                        this.$router.push('/webapp/');
                    }
                }
            }); 
            
        },
        cargarColumnas:function(){
            //Esta funcion carga las columnas
            var arreglo=[];
            var array=[];
            for(var e in this.ListaCoberturas[0]){
                arreglo.push(e.replace(/'/g,''));
                array.push(e);
                console.log(e);
            }
            array.shift();
            array.shift();
            arreglo.shift();
            arreglo.shift();
            this.li=array;
            this.Columnas=arreglo;
            // console.log(this.ListaCoberturas[0]["'DELGADAS'"]);
        }
    }

}
</script>



<style>
.provee{
    font-size: 90%;   
}

thead{
  background: #02cf8b;
  color: #ffffff;
}
td{
    font-size: 75%;
    text-align: justify;
    text-justify: inter-word;
}

th{
    font-size: 75%;
}

</style>