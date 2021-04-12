//Funciona igual que Coberturas
//Holis Douglas :D
<template>
  <div>
        <Header/>
        <b-container>
            <div class="table-responsive shadow-sm p-3 mb-2 bg-white rounded" id="tabla">
                <b-row>
                    <b-form inline v-on:submit.stop.prevent='cambiarProveedorCliente'>
                        <select class="custom-select rounded ml-3 mr-3 provee" id="prov" aria-placeholder="" v-model="proveedorActual" aria-label=".form-select-sm example">
                        <option class="provee" value="" disabled selected>Proveedor</option>
                        <option class="provee rounded" v-for="proveedor in ListaProveedores" :value="proveedor.COD_PROVEEDOR" :key="proveedor.COD_PROVEEDOR" >{{proveedor.NOM_CORTO}}</option>
                        </select>
                        <input type="text" name="" id="Cliente" class="form-control ml-3 mr-3 provee" placeholder="Cliente" onkeyup="this.value = this.value.toUpperCase();"> 
                        <b-button  size="sm" variant="transparent" class="md-auto ml-3 mr-3"><img src="@/assets/search.png" alt="buscar" class="imgbuscar" v-on:click="cambiarProveedorCliente"></b-button>
                    </b-form>    
                    
                </b-row>
            </div>
            <div class="table-responsive table-condensed shadow-sm p-3 mt-1 mb-2 bg-white rounded" id="tabla">
                <table class="table table-hover table-sm table-reflow">
                    <thead>
                        <th scope="col">Mes</th>
                        <th v-for="i in Columnas" :key="i" scope="col">{{i}}</th>
                    </thead>
                    <tbody>
                            <tr v-for="cobertura in ListaCompras" :key="cobertura">
                                <!-- <td v-for="cob in cobertura" :key="cob">{{cob}}</td> -->
                                <td>{{cobertura.MES}}</td>
                                <td>{{convertir(cobertura[Columnas[0]])}}</td>
                                <td>{{convertir(cobertura[Columnas[1]])}}</td>
                                <td>{{convertir(cobertura[Columnas[2]])}}</td>
                            </tr>
                    </tbody>
                    <tfoot class="bg-info">
                        <tr>
                            <th>Total:</th>
                            <td v-for="total in Total" :key="total">{{total.toLocaleString()}}</td>
                        </tr>
                        <tr>
                            <th >Crecimiento</th>
                            <td></td>
                            <td v-for="tot in Totales" :key="tot">{{tot.toLocaleString()}}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </b-container>

  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import axios from 'axios';

export default {
    name:'ComprasXProveedores',
    components:{
        Header
    },
    data:function(){
        return{
            ListaProveedores:null,
            proveedorActual:'',
            ListaCompras:[],
            Columnas:[],
            li:[],
            Totales:[],
            Total:[]
        }        
    },
    mounted:function(){
        let instance = axios.create();
        var rut=window.location.href;
        var ruta =rut.search("webapp/");
        var rutaFinal=rut.substring(0,ruta);
        let urlArticulos=rutaFinal+'/webapi/api/general/proveedores';
        var bearer= 'Bearer '+localStorage.token;

        let headers={
            headers:{
                "Content-Type": "Application/JSON",
                "Authorization":bearer
            }
        }

        let json={};
        instance.post(urlArticulos,json,headers).then(data =>{
            //console.log(data);
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
        convertir:function(numero){
            // var num=numero.toLocaleString();
            var num=parseFloat(numero)
            var nume=num.toLocaleString()
            if (nume=="NaN"){
                return "";
            }else{
                return nume;
            }
            
        },
        calcularTotal:function(){
            var lista=[0,0,0];
            this.Total=[0,0,0];
            var porcentaje1=0;
            var porcentaje2=0;

            
            for(var e in this.ListaCompras){
                var cont=0;
                for(var o in this.li){
                    if(this.ListaCompras[e][this.li[o]] > 0){
                        lista[cont]+=this.ListaCompras[e][this.li[o]];
                        this.Total[cont]+=this.ListaCompras[e][this.li[o]];
                    }
                    

                    cont+=1;
                }
            }
            porcentaje1=(lista[1]/lista[0]-1)*100;
            porcentaje2=(lista[2]/lista[1]-1)*100;
            lista[1]=porcentaje1.toLocaleString()+"%";
            lista[2]=porcentaje2.toLocaleString()+"%";
            lista.shift();
            this.Totales=lista;
        },
        cambiarProveedorCliente:function(){
            this.ListaCompras=[];
            var prov=this.proveedorActual;
            let instance = axios.create();
            var rut=window.location.href;
            var ruta =rut.search("webapp/");
            var rutaFinal=rut.substring(0,ruta);
            let urlArticulos=rutaFinal+'/webapi/api/compras/clienteproveedor?pCliente='+document.getElementById("Cliente").value+"&pProveedor="+prov;
            var bearer= 'Bearer '+localStorage.token;

            let headers={
                headers:{
                    "Content-Type": "Application/JSON",
                    "Authorization":bearer
            }
        }

            let json={};
            instance.post(urlArticulos,json,headers).then(data =>{
                
                this.ListaCompras=data.data.ComprasCliente;
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
            // var num=1;
            // console.log(this.ListaProveedores);
            var arreglo=[];
            var array=[];
            for(var e in this.ListaCompras[0]){
                arreglo.push(e);
                array.push(e);
            }
            array.pop();
            arreglo.pop();
            this.li=array;
            this.Columnas=arreglo;
            // console.log(this.ListaCoberturas[0]["'DELGADAS'"]);
        }
    }


}
</script>

<style>
.imgbuscar{
    width: 20px;
}
.provee{
    font-size: 80%;
}
td,th{
    text-align: end;
}

</style>