console.clear();

// - - - Variables globales

let nombreUsuario = ""; //Nombre ingresado por el usuario en la pantalla 1
let puntosUsuario = 0; //Número de respuestas correctas
let respuestasUsuario = []; //Las respuestas de cada usuario en el orden en que las pone

 //Tipo de cuestionario elegido en la pantalla 2
let preguntaActual = 0; //Pregunta actual

let tiempo = 100; //Tiempo restante para la pregunta en décimas de segundo

let interval;
let tipo;

const preguntas = [
  [
    //Banco de preguntas para Peliculas
    [
      "¿Cuál película es la más taquillera del mundo?",
      ['Avengers: End Game','Avatar','Titanic','Jurasic World']
    ],
    [
      '¿Quién dirigió "Pandillas de New York"?',
      ['Martin Scorsese','Steven Spilberg','Brad Pitt','Quentin Tarantino']
    ],
    [
      '¿Qué actor representó a "Batman" en la trilogia de Christopher Nolan?',
      ['Cristian Vale','Ben Affleck','Brad Pitt','Jared Letto']
    ]
  ],
  [
    //Banco de preguntas para series
    [
      '¿Cuántas temporadas tiene "The Big Bang Teory?',
      ['13','9','10','12']
    ],
    [
      '¿Cual es el lema de la casa Stark de "Game of Trones"?',
      ['El invierno se acerca','Escuchame rugir','Fuego y Sangre','Crecer fuerte']
    ],
    [
      "¿Cómo se llama la serie que disparó las ventas de ajedrez en el mundo?",
      ['Gambito de Damas','El tablero','La Guerra y el Rey','El ultimo reinado']
    ]
  ]
];

// HACKER EDITION tiempo
//Y si hacemos una cuenta cuenta regresiva como en los cines?

let canvas = document.getElementById("regresiva");
let ctx = canvas.getContext("2d");
canvas.width = "100";
canvas.height = "100";

function circulo(n, t, segundo) {
  let final = 0;

  if ((n * 2 * Math.PI) / t < Math.PI / 2) {
    final = (n * 2 * Math.PI) / t + (3 * Math.PI) / 2;
  } else {
    final = (n * 2 * Math.PI) / t - Math.PI / 2;
  }

  ctx.clearRect(0, 0, 100, 100);

  ctx.strokeStyle = "#dcdde1";
  ctx.fillStyle = "#898176";
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(50, 0);
  ctx.arc(50, 50, 48, (3 * Math.PI) / 2, final);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(50, 50, 48, 0, 2 * Math.PI);
  ctx.moveTo(90, 50);
  ctx.arc(50, 50, 40, 0, 2 * Math.PI);
  ctx.moveTo(0, 50);
  ctx.lineTo(100, 50);
  ctx.moveTo(50, 0);
  ctx.lineTo(50, 100);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = "#424242";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 36px sans-serif";
  ctx.fillText(segundo, 50, 50);
}

function cuentaRegresiva() {
  if (tiempo > 0) {
    circulo(10 - (tiempo % 10), 10, Math.floor(tiempo / 10 + 1));
    tiempo = tiempo - 1;
  } else {
    circulo(10, 10, 1);
    respuesta(0, "");
  }
}

function revolver(array) {
  // Y si revolvemos las preguntas? (Que salgan en orden aleatorio) Para revolver las preguntas y las opciones
  let l = array.length;
  let aleatorio = [];
  for (let i = 0; i < l; i++) {
    aleatorio[i] = array.splice(Math.floor(Math.random() * array.length), 1)[0];
  }
  return aleatorio;
}

// - - - Funciones que modifican el document

function mostrar(n) {
  //Esta función recorre las 4 pantallas, las oculta con un display none. Luego toma el elemento que quiere mostrar y le cambia el display a flex
  for (let i = 0; i < 4; i++) {
    document.getElementById(`screen${i + 1}`).style.display = "none";
  }
  document.getElementById(`screen${n}`).style.display = "flex";
}

function cargarPreguntas() {
  if (preguntaActual < preguntas[0].length) {
    tiempo = 100;
    document.getElementById("avance").value = preguntaActual;
    document.getElementById("respuestas").innerHTML = '';

    document.getElementById("pregunta").innerHTML = preguntas[tipo][preguntaActual][0];

    //Generar HTML de las respuestas
    //Primero se crea un arreglo para guardar el html de cada una y después revolverlas
    let opcionesArray = [];

    function respuestaHtml(texto,p){
      return `<input type="button" value="${texto}" onclick="respuesta(${p},'${texto}')" class="boton respuesta">`
    }

    for(let i = 0; i<4;i++){
      //Le paso una por una las respuestas y las creo asi:
      opcionesArray[i] = respuestaHtml(preguntas[tipo][preguntaActual][1][i], (!i ? 1 : 0));
    }

    opcionesArray = revolver(opcionesArray);
    
    let opcionesHtml = '';
    for(let i = 0; i<4;i++){
      opcionesHtml = opcionesHtml + ' ' + opcionesArray[i];
    }

    document.getElementById("respuestas").innerHTML = opcionesHtml;

    interval = setInterval(cuentaRegresiva, 100);
  } else {
    mostrar(4);
    feedback();
  }
}

//Funciones particulares

function obtenerNombre() {
  //Necesito tomar el nombre que está en el elemento de id nombre y pasar a la siguiente pantalla.
  nombreUsuario = document.getElementById("nombre").value;
  document.getElementById("nombrar").innerHTML = nombreUsuario;

  mostrar(2);
}

// Pantalla 2: Seleccion del formulario. Si se eligen series se selecciona el formulario tipo 0, si  se eligen peliculas se escoge el tipo 1

function cuestionario(seleccionado) {
  puntos = 0;
  preguntaActual = 0;
  respuestasUsuario = [];

  tipo = seleccionado;
  mostrar(3);
  preguntas[tipo] = revolver(preguntas[tipo]);
  cargarPreguntas();
}

function respuesta(p, seleccion) {
  clearInterval(interval);

  puntos = puntos + p;
  respuestasUsuario.push(seleccion);
  preguntaActual++;

  cargarPreguntas();
}

function feedback() {
  //Hay que mostrarle a la persona el feedback de sus respuestas

  let mal =
    "https://www.clker.com/cliparts/8/3/3/4/1195445190322000997molumen_red_round_error_warning_icon.svg.hi.png";
  let bien =
    "https://icons8.com/iconizer/files/Crystal_Clear/orig/button_ok.png";

  document.getElementById("final").innerHTML = `<div class="feedback">
  <p class="fb-pregunta">Pregunta</p>
    <p class="fb-repuesta">Selección</p>
    <p class="fb-repuesta"><img src="${bien}"></p>
    <p class="fb-simbolo"></p>
    </p>`;

  for (let i = 0; i < preguntas[tipo].length; i++) {
    let link = "";
    if (respuestasUsuario[i] == preguntas[tipo][i][1][0]) {
      link = bien;
    } else {
      link = mal;
    }
    document.getElementById("final").innerHTML += `<div class="feedback">
      <p class="fb-pregunta">${preguntas[tipo][i][0]}</p>
      <p class="fb-repuesta">${respuestasUsuario[i]}</p>
      <p class="fb-repuesta">${preguntas[tipo][i][1][0]}</p>
      <div class="fb-simbolo">
      <img src="${link}">
    </div>`;
  }

  document.getElementById(
    "puntuacion"
  ).innerHTML = `Has obtenido ${puntos} puntos`;
}  