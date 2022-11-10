var datos;
//Variable que guarda la ruta del archivo
var definicionMT;
//Variable que guarfa el contenido del archivo
var r = 0;
//Variable que funciona como contador de los arrays
var cadena;
//Variable que guarda la cadena a evaluar con la MT
const mostrar = '"Archivo cargado", Ingresa una cadena..!';
//Mensaje de que el archivo fue cargado con exito

//Aqui declaramos una varible sobre el input donde puede seleccionar el archivo
const archivo_01 = document.getElementById('archivo').addEventListener('change', event => {
    //Esperamos a que suba el archivo el ususario
    const file = event.target.files[0];
    //Lo guardamos como un objeto
    
    //Si el archivo no puede ser procesado mostrara un error
    if(!file.type){
        console.log('Error: EL tipo de propiedades del archivo no es soportado por la pagina.');
        return;
    }
    //Si el archivo no es .txt mostrara un error ya fue restringido en su input
    if(!file.type.match('text.*')){
        console.log('Error: EL archivo seleccionado no es un txt.');
        return;
    }

    //Creamos una variable leer en la cual vamos a procesar el archivo
    const leer = new FileReader();
    //Lo cargamos
    leer.addEventListener('load', event => {
        //Esperamos el resultado y lo pasamos a la variable datos
        datos = event.target.result;
    });
    //Se crea la url
    leer.readAsDataURL(file);
});

//Con el boton cargar..! esperamos el evento click y ejecutamos leerArchivo
document.querySelector('#lee').addEventListener('click', leeArchivo);

var bandera = 0;
//Variable que nos ayuda a recorrer el archivo
var q = 0;
//Variable de los estados;
var q_0 = 0;
//Variable del estado de inicial
var h_a;
//Variable del estado de aceptacion
var h_e = [];
//Variable de los estados de no aceptacion
var alfabeto = [];
//Variable del alfabeto
var movimiento_MT = [];
//Variable de los movimientos

var long_h_e = 0;
//Variable que guarda el tamaño del array estado de no aceptacion
var long_alfa = 0;
//Variable que guarda el tamaño del array alfabeto
var long_Movimiento = 0;
//Variable que guarda el tamaño de las instrucciones de la MT

function leeArchivo(){
//Inicia funcion leerArchivo

    $('#respuesta').val("");
    //Vaciamos el input respuesta
    $('#resultado').val("");
    //Vaciamos el input resultado

    //Reiniciamos y vaciamos las varibales
    bandera = 0;
    q = 0;
    q_0 = 0;
    h_a = [];
    h_e = [];
    alfabeto = [];
    movimiento_MT = [];

    //Variable del tipo XMLHtt inicializada
    const carga = new XMLHttpRequest();
    //Abrimos el archivo
    carga.open('GET', datos, true);
    //Enviamos
    carga.send();

    //Vamos a verificar que se obtuvo respuesta favorable
    carga.onreadystatechange = function(){
        //Verificamos los codigos de aceptacion
        if(this.readyState == 4 && this.status == 200){
            //Si todo esta bien lo pasamos a la variable
            definicionMT = this.responseText;
            //Mostramos un mensaje en la pagina de que se carga
            document.querySelector('#listo').innerHTML = mostrar;

            //Lo vamos a recorrer
            for(var i = 0; i < definicionMT.length; i++){
                //Pasamos un caracter de la cadena a evaluar
                var caracter = definicionMT.charAt(i);

                //Si encontramos un ')' quiere decir que ya pasamos una seccion
                if(caracter == ")"){
                    bandera = bandera + 1;
                    r = 0;
                }

                //Si no pasamos ninguna seccion todavia
                if(bandera == 0){
                    //Extraemos los estados
                    if(!isNaN(caracter) && caracter != "\r" && caracter != "\n" && caracter != " "){
                        q = q + 1;
                    }
                }

                //Si pasamos seccion 1
                if(bandera == 1){
                    //Extraemos el estado inicial
                    if(!isNaN(caracter) && caracter != "\r" && caracter != "\n" && caracter != " "){
                        q_0 = caracter;
                    }
                }

                //Si pasamos seccion 2
                if(bandera == 2){
                    //Extraemos el estado de aceptacion
                    if(!isNaN(caracter) && caracter != "\r" && caracter != "\n" && caracter != " "){
                        h_a = caracter;
                    }
                }

                //Si pasamos seccion 3
                if(bandera == 3){
                    //Extraemos el estado de no aceptacion
                    if(!isNaN(caracter) && caracter != "\r" && caracter != "\n" && caracter != " "){
                        h_e[r] = caracter;
                        r = r + 1;
                        long_h_e = long_h_e + 1;
                    }
                }

                //Si pasamos seccion 4
                if(bandera == 4){
                    //Buscamos donde empieza la siguiente seccion
                    if(caracter == "("){
                        bandera = bandera + 1;
                    }
                }
                if(bandera == 5){
                    //Extraemos el alfabeto
                    if(caracter != "," && caracter != "\r" && caracter != "\n" && caracter != " " && caracter != "("){
                        alfabeto[r] = caracter;
                        r = r + 1;
                        long_alfa = long_alfa + 1;
                    }
                }

                //Si pasamos seccion 5
                if(bandera == 6){
                    //Nos movemos a otro ciclo for
                    for(i = i; i < definicionMT.length; i++){
                        //Seguimos donde lo dejamos
                        var caracter = definicionMT.charAt(i);
                        var caracter_01 = definicionMT.charAt(i+1);
                        var caracter_02 = definicionMT.charAt(i-1);
                        //Extraemos los parametros de la MT
                        if(!isNaN(caracter) && caracter != "\r" && caracter != "\n" && caracter != " "){
                            //Buscamos estados
                            movimiento_MT[r] = caracter;
                            r = r + 1;
                            long_Movimiento = long_Movimiento + 1;
                        }
                        for(var j = 0; j < long_alfa+1; j++){
                            //Buscamos donde termina esta instruccion
                            if(caracter == alfabeto[j] && caracter_01 == ")"){
                                movimiento_MT[r] = caracter;
                                r = r + 1;
                                long_Movimiento = long_Movimiento + 1;
                            }
                        }
                        if(caracter == " " && caracter_01 == ")"){
                            //Buscamos estado alfabeto
                            movimiento_MT[r] = caracter;
                            r = r + 1;
                            long_Movimiento = long_Movimiento + 1;
                        }
                        if(caracter_02 == " " && caracter_01 == ","){
                            //Buscamos la escritura
                            movimiento_MT[r] = caracter;
                            r = r + 1;
                            long_Movimiento = long_Movimiento + 1;
                        }
                        if(caracter_02 == " " && caracter_01 == ")" && caracter == "R" | "I" | "N"){
                            //Buscamos el movimiento
                            movimiento_MT[r] = caracter;
                            r = r + 1;
                            long_Movimiento = long_Movimiento + 1;
                        }
                    }
                }
            }
            //Reiniciamos la variable
            bandera = 0;
        }
    }
}
//Fin de funcion

//Con el boton probar cadena esperamos el evento click y ejecutamos validarCadena
document.querySelector('#validar').addEventListener('click', validarCadena_MT);

function validarCadena_MT(){
//Inicia funcion validarCadena_MT

    cadena = document.getElementById("cadena").value;
    //Obtenemos la cadena del input cadena al cual es ingresado
    bandera = q_0;
    //bandera sera el estado inicial

    //Variable que guardara los cambios en la cadena
    var envia = '';
    //Variable que ayudara a movernos en el array movimiento_MT
    var j = 0;

    //Recoremos la caedena
        for(var i = 0; i < cadena.length; i++){
            //Obtenemos dos caracteres un actual y uno proximo
            var letra = cadena.charAt(i);
            var letra_01 = cadena.charAt(i+1);

            //Validamos el estado
            if(movimiento_MT[j] == bandera){

                //Validamos el alfabeto
                if(letra == movimiento_MT[j+1]){

                    //Remplazamos el caracter leido por el que se nos pide
                    cadena = cadena.replace(letra, movimiento_MT[j+3]);

                    //Validamos el movimiento de la cadena
                    if(movimiento_MT[j+4] == "I"){
                        i = i - 1;
                    }

                    if(movimiento_MT[j+4] == "N"){
                        i = cadena.length;
                    }

                    //Validamos el siguiente caracter a evaluar
                    if(letra_01 != movimiento_MT[j+1]){
                        //Lo remplazmos si coincide
                        cadena = cadena.replace(letra_01, movimiento_MT[j+3]);
                        //Nos deplazamos en el array MT
                        j = j + 5;
                    }

                    //Validamos el siguiente estado
                    if(movimiento_MT[j+2] != bandera){
                        //Nos deplazamos en el array MT
                        j = j + 5;
                    }

                    //Cambiamos de estado
                    bandera = movimiento_MT[j+2];
                }
            }

            //Si el estado final coincide con el de aceptacion
            if(bandera == h_a){
                //Es valido
                $('#respuesta').val("Cadena valida..!");
            }
            else{
                //No es valido
                $('#respuesta').val("Cadena no valida..!");
            }
            //Mostramos el proceso
            envia = envia + cadena + "\n";
            $('#resultado').val(envia);
        }
        //Vaciamos el mensaje de archvio cargado
        document.querySelector('#listo').innerHTML = "";
        //Reiniciamos varibale
        bandera = 0;
}
//Fin de funcion