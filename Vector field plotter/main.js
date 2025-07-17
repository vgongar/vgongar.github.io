// canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.height = document.getElementById("canvas-container").clientHeight;
canvas.width = document.getElementById("canvas-container").clientWidth;

// topCanvas
const topCanvas = document.getElementById("top-canvas");
const topCtx = topCanvas.getContext("2d");
topCanvas.height = canvas.height;
topCanvas.width = canvas.width;

const container = document.getElementById("canvas-container");

// elementos

const xInput = document.getElementById("x-input");
const yInput = document.getElementById("y-input");

const xInitialCondition = document.getElementById("x-initial-condition");
const yInitialCondition = document.getElementById("y-initial-condition");;
const vxInitialCondition = document.getElementById("vx-initial-condition");
const vyInitialCondition = document.getElementById("vy-initial-condition");

const cellSizeInput = document.getElementById("cell-size-input");
const subCellsInput = document.getElementById("subcells-input");

const normalizedCheckbox = document.getElementById("normalized-checkbox");
const particleCheckbox = document.getElementById("particle-checkbox");

const arrowSizeInput = document.getElementById("arrow-size-input");

const onePlanetPreset = document.getElementById("onePlanetPreset");
const twoPlanetPreset = document.getElementById("twoPlanetPreset");
const randomFieldPreset = document.getElementById("randomFieldPreset");

let f1, f2;
let previousTime = 0; // Tiempo anterior a nivel global
let isFirstFrame = true; // Para saber si es el primer cuadro
let isAnimating = false; // Estado para saber si la animación está en curso
let isDragging = false;
let dragStartLocation = null;
let velocityArrowStart = null;
let velocityArrowEnd = null

// valores por defecto
// Ecuaciones del campo gravitatorio ejercido por dos cuerpos situados en (1,0) y en (-1,0)
xInput.value = "(1-x)/((1-x)**2 + y**2)**1.5 + (-1-x)/((-1-x)**2 + y**2)**1.5"
yInput.value =  "(-y)/((1-x)**2 + y**2)**1.5 + (-y)/((-1-x)**2 + y**2)**1.5"

xInitialCondition.value = 0;
yInitialCondition.value = 0;
vxInitialCondition.value = 0.707106;
vyInitialCondition.value = 0.707106;
subCellsInput.value = 2;
cellSizeInput.value = 100;
arrowSizeInput.value = 32;
 
normalizedCheckbox.checked = false;

function setOnePlanet(){
    // Cambiamos los estilos para que se vea resaltado el que clicamos
    const presets = document.querySelectorAll('.preset');
    presets.forEach(preset => {
        preset.classList.remove("selected");
    });
    onePlanetPreset.classList.add("selected");

    clearButton.click();

    // Ecuaciones del campo gravitatorio ejercido por un cuerpo situados en el origen
    xInput.value = "-x/(x**2 + y**2)**1.5"
    yInput.value =  "-y/(x**2 + y**2)**1.5"

    xInitialCondition.value = 1;
    yInitialCondition.value = 0;
    vxInitialCondition.value = 0;
    vyInitialCondition.value = 1;
    subCellsInput.value = 2;
    cellSizeInput.value = 100;
    arrowSizeInput.value = 32;
    
    normalizedCheckbox.checked = false;
    animateButton.click();
}

function setTwoPlanet(){
    // Cambiamos los estilos para que se vea resaltado el que clicamos
    const presets = document.querySelectorAll('.preset');
    presets.forEach(preset => {
        preset.classList.remove("selected");
    });
    twoPlanetPreset.classList.add("selected");

    clearButton.click();

    // Ecuaciones del campo gravitatorio ejercido por dos cuerpos situados en (1,0) y en (-1,0)
    xInput.value = "(1-x)/((1-x)**2 + y**2)**1.5 + (-1-x)/((-1-x)**2 + y**2)**1.5"
    yInput.value =  "(-y)/((1-x)**2 + y**2)**1.5 + (-y)/((-1-x)**2 + y**2)**1.5"

    xInitialCondition.value = 0;
    yInitialCondition.value = 0;
    vxInitialCondition.value = 0.707106;
    vyInitialCondition.value = 0.707106;
    subCellsInput.value = 2;
    cellSizeInput.value = 100;
    arrowSizeInput.value = 32;
    
    normalizedCheckbox.checked = false;
    animateButton.click();
}

function setRandomField(){
    // Cambiamos los estilos para que se vea resaltado el que clicamos
    const presets = document.querySelectorAll('.preset');
    presets.forEach(preset => {
        preset.classList.remove("selected");
    });
    randomFieldPreset.classList.add("selected");

    clearButton.click();

    xInput.value = "Math.random()*2-1"
    yInput.value =  "Math.random()*2-1"

    xInitialCondition.value = 0;
    yInitialCondition.value = 0;
    vxInitialCondition.value = 0;
    vyInitialCondition.value = 0;
    subCellsInput.value = 2;
    cellSizeInput.value = 100;
    arrowSizeInput.value = 32;
    
    normalizedCheckbox.checked = false;

    animateButton.click();
}

function setPeriodicField(){
    // Cambiamos los estilos para que se vea resaltado el que clicamos
    const presets = document.querySelectorAll('.preset');
    presets.forEach(preset => {
        preset.classList.remove("selected");
    });
    randomFieldPreset.classList.add("selected");

    clearButton.click();

    xInput.value = "-x*Math.cos(t*x)"
    yInput.value =  "-y*Math.sin(t*y)"

    xInitialCondition.value = 0.33;
    yInitialCondition.value = 0.33;
    vxInitialCondition.value = 0;
    vyInitialCondition.value = 0;
    subCellsInput.value = 3;
    cellSizeInput.value = 100;
    arrowSizeInput.value = 32;
    
    normalizedCheckbox.checked = false;

    animateButton.click();
}

// Para que pueda reajustarse el canvas
function resizeCanvas() {
    // Ajusta el tamaño del canvas al contenedor
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    topCanvas.width = canvas.width;
    topCanvas.height = canvas.height;

    // el cambio de orientación de los ejes se hace en cada función que lo necesite
    ctx.translate(canvas.width/2, canvas.height/2);
    topCtx.translate(canvas.width/2, canvas.height/2);

    const origin = {
        x : Math.floor(Math.floor(canvas.width / cellSizeInput.value)/2) * cellSizeInput.value,
        y : Math.floor(Math.floor(canvas.height / cellSizeInput.value)/2) * cellSizeInput.value
    }; 

    const particle = new Particle2D(origin, cellSizeInput.value, new Vector(0,0), new Vector(0,0));
    const simulation = new Simulation(
        particle,
        (t,x,y,z,w) => new Vector(z, w, f1(t,x,y), f2(t,x,y)));

    var idAnimacion;
}

// Llama a la función cuando la ventana cambia de tamaño
window.addEventListener("resize", resizeCanvas);

// el cambio de orientación de los ejes se hace en cada función que lo necesite
ctx.translate(canvas.width/2, canvas.height/2);
topCtx.translate(canvas.width/2, canvas.height/2);

const origin = {
    x : Math.floor(Math.floor(canvas.width / cellSizeInput.value)/2) * cellSizeInput.value,
    y : Math.floor(Math.floor(canvas.height / cellSizeInput.value)/2) * cellSizeInput.value
}; 

const particle = new Particle2D(origin, cellSizeInput.value, new Vector(0,0), new Vector(0,0));
const simulation = new Simulation(
    particle,
    (t,x,y,z,w) => new Vector(z, w, f1(t,x,y), f2(t,x,y)));

var idAnimacion;

const animateButton = document.getElementById("animate-button");
animateButton.addEventListener('click', function() {
    // Llama a la función inicialmente
    resizeCanvas();
    // actualizamos la partícula con los datos de la página
    particle.origin = origin;
    particle.cellSize = cellSizeInput.value;
    particle.position = new Vector(Number(xInitialCondition.value), Number(yInitialCondition.value));
    particle.velocity = new Vector(Number(vxInitialCondition.value), Number(vyInitialCondition.value));

    // intentamos crear funciones f1 y f2
    try {
        f1 = new Function('t', 'x', 'y', `return ${xInput.value};`);
        f2 = new Function('t', 'x', 'y', `return ${yInput.value};`);
    } catch (error) {
        console.error("Error creando funciones:", error);
        return; // Detenemos la ejecución si hay un error
    }

    // actualizamos la simulación con las nuevas fuerzas
    simulation.particle = particle;
    simulation.F = (t, x, y, z, w) => new Vector(z, w, f1(t, x, y), f2(t, x, y));

    // dibujamos el canvas con el color de fondo
    ctx.fillStyle="rgb(255, 220, 157)";
    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    if (!isAnimating) {
        isAnimating = true; // Cambiar el estado a animando
        previousTime = 0; // Reiniciar el tiempo
        isFirstFrame = true; // Reiniciar el estado del primer cuadro
        requestAnimationFrame(animate); // Comenzar la animación
    }
});

const stopButton = document.getElementById("stop-button");
stopButton.addEventListener("click", function() {
    if (idAnimacion) {
        console.log("Parando");
        cancelAnimationFrame(idAnimacion);
        idAnimacion = null; 
        isAnimating = false;
        cellSizeInput.disabled = false;
    }
});


const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", function(){
    ctx.fillStyle="rgb(255, 220, 157)";
    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height); 
    topCtx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
});

topCanvas.addEventListener("touchstart", function(e) {
    e.preventDefault(); // Evitar desplazamiento
    const rect = topCanvas.getBoundingClientRect();
    const touch = e.touches[0]; // Obtener el primer toque
    
    const mousePxl = new Vector(
        -origin.x + touch.clientX - rect.left - topCanvas.width / 2,
        origin.y - (touch.clientY - rect.top) + topCanvas.height / 2
    );

    const mouse = mousePxl.scale(1 / cellSizeInput.value);
    
    isDragging = true;
    velocityArrowStart = mouse;
    velocityArrowEnd = mouse;

    xInitialCondition.value = mouse[0];
    yInitialCondition.value = mouse[1];
});


topCanvas.addEventListener("mousedown", function(e){
    const mousePxl = new Vector(
        -origin.x + e.offsetX - topCanvas.width/2, 
        origin.y - e.offsetY + topCanvas.height/2
    );

    const mouse = mousePxl.scale(1/cellSizeInput.value);
    
    isDragging = true;

    velocityArrowStart = mouse;
    velocityArrowEnd = mouse;

    xInitialCondition.value = mouse[0];
    yInitialCondition.value = mouse[1];
});

topCanvas.addEventListener("mousemove", function(e){
    if(isDragging){
        const mousePxl = new Vector(
            -origin.x + e.offsetX - topCanvas.width/2, 
            origin.y - e.offsetY + topCanvas.height/2
        );
        velocityArrowEnd = mousePxl.scale(1/cellSizeInput.value);;
    }
});

topCanvas.addEventListener("touchmove", function(e) {
    e.preventDefault(); // Evitar desplazamiento de la página
    const rect = topCanvas.getBoundingClientRect(); // Obtener el rectángulo delimitador del canvas
    const touch = e.touches[0]; // Obtener el primer toque
    
    // Calcular las coordenadas relativas al canvas
    const x = touch.clientX - rect.left; // Coordenada X relativa al canvas
    const y = touch.clientY - rect.top;  // Coordenada Y relativa al canvas
    
    coords = { x, y }; // Guardar las coordenadas
    
    // Solo se actualizan las coordenadas si se está arrastrando
    if (isDragging) {
        const mousePxl = new Vector(
            -origin.x + x - topCanvas.width / 2, 
            origin.y - y + topCanvas.height / 2
        );
        // Actualizar la posición final de la flecha de velocidad
        velocityArrowEnd = mousePxl.scale(1 / cellSizeInput.value);
    }
});

topCanvas.addEventListener("mouseup", function(e){
    isDragging = false;

    const velocity = Vector.subtract(velocityArrowEnd, velocityArrowStart);

    vxInitialCondition.value = velocity[0];
    vyInitialCondition.value = velocity[1];

    animateButton.click();
});

topCanvas.addEventListener("touchend", function(e) {
    // Detener el estado de arrastre
    isDragging = false;

    // Calcular la velocidad a partir de los puntos de inicio y fin
    const velocity = Vector.subtract(velocityArrowEnd, velocityArrowStart);

    // Asignar las velocidades iniciales a los campos correspondientes
    vxInitialCondition.value = velocity[0];
    vyInitialCondition.value = velocity[1];

    // Llamar al botón de animación (si es necesario)
    animateButton.click();
});

function animate(time) {
    time = time / 1000; // Convertir a segundos
    if (isFirstFrame) {
        previousTime = time; // Inicializa previousTime en el primer cuadro
        isFirstFrame = false;
    }

    if(isAnimating){
        cellSizeInput.disabled = true; 
    }

    let deltaTime = time - previousTime; // Calcula el deltaTime
    previousTime = time; // Actualiza previousTime

    const particleBool = particleCheckbox.checked;

    // Actualiza la simulación
    
    if(particleBool){
        simulation.update(time, deltaTime);
    }

    // ----------------- DIBUJADO ----------------------------
    ctx.fillStyle = 'rgba(255, 220, 157, 0.1)'; // para tener efecto
    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height); 

    drawGrid(ctx, canvas, cellSizeInput.value);
    
    ctx.save();
    drawVectorField(ctx, time, (t,x,y) => new Vector(f1(t,x,y), f2(t,x,y)), 
    cellSizeInput.value, normalizedCheckbox.checked, subCellsInput.value);
    ctx.restore();


    // dibujamos el rastro para el motion blur
    topCtx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    if(isDragging){
        topCtx.lineWidth = 2;
        drawArrow(topCtx, 
            origin.x + velocityArrowStart[0] * cellSizeInput.value,
            origin.y - velocityArrowStart[1] * cellSizeInput.value,
            origin.x + velocityArrowEnd[0] * cellSizeInput.value,
            origin.y -velocityArrowEnd[1] * cellSizeInput.value,
        );
    }
    
    if(particleBool){
        for(let i = 0 ; i < particle.trail.length ; i++){
            particle.draw(topCtx,i,8,lerp((i+1)/particle.trail.length,0,1));
        }
    }
    
    idAnimacion = requestAnimationFrame(animate);
}

function drawVectorField(ctx, t, f, cellSize, normalizeBool, subCells = 2) {
    const option = normalizeBool;
    ctx.lineWidth = 2;
    ctx.save();  

    ctx.translate(origin.x, origin.y);
    ctx.scale(1, -1);

    // Calcular la cantidad de celdas en X y Y
    const amountCellsX = Math.floor(canvas.width / cellSize);
    const amountCellsY = Math.floor(canvas.height / cellSize);

    const subCellSize = cellSize / subCells;
    const maxArrowLength = subCellSize * 0.75;  

    for (let i = -1; i <= amountCellsX; i++) {
        for (let j = -1; j <= amountCellsY; j++) {
            const x = i - Math.floor(amountCellsX / 2);  // Coordenada X centrada
            const y = j - Math.floor(amountCellsY / 2);  // Coordenada Y centrada

            // Iterar sobre las subceldas dentro de cada celda principal
            for (let k = 0; k < subCells; k++) {
                for (let h = 0; h < subCells; h++) {
                    // Donde va a evaluarse la funcion
                    const subX = x + (k + 0.5) / subCells;
                    const subY = y + (h + 0.5) / subCells;
                    const arrowFeet = new Vector(subX, subY);

                    // Evaluar el campo vectorial en la posición actual
                    const arrow = f(t, arrowFeet[0], arrowFeet[1]);

                    const magnitude = arrow.magnitude();
                    if(magnitude === 0){
                        continue
                    }
                    
                    //Tomamos el tamaño real que tendría y lo capamos para que no se pase
                    var arrowLength;
                    if(option){
                        arrowLength = maxArrowLength;
                    } else {
                        arrowLength = Math.min(magnitude * subCellSize, maxArrowLength);
                    }

                    const centerPxl = arrowFeet.scale(cellSize);

                    // Normalizar el vector (solo para calcular la dirección)
                    if(magnitude === 0){
                        continue
                    }
                    const normalizedArrow = arrow.normalize();
                    var start, end;

                    if(option){
                        const scaleFactor = arrowLength;
                        end = Vector.add(centerPxl, normalizedArrow.scale(0.5 * scaleFactor));
                        start = Vector.subtract(centerPxl, normalizedArrow.scale(0.5 * scaleFactor)); 
                    } else {
                        const scaleFactor = arrowLength/subCellSize*arrowSizeInput.value;
                        end = Vector.add(centerPxl, normalizedArrow.scale(0.5 * scaleFactor));
                        start = Vector.subtract(centerPxl, normalizedArrow.scale(0.5 * scaleFactor)); 
                    }

 
                    drawArrow(ctx, start[0], start[1], end[0], end[1], arrowLength/5);
                }
            }
        }
    }

    ctx.restore();  // Restaurar el estado del contexto para evitar acumulaciones
}

function drawGrid(ctx, canvas, cellSize){
    ctx.lineWidth = 2;
    const amountCellsX = Math.floor(canvas.width / cellSize);
    const amountCellsY = Math.floor(canvas.height / cellSize);


    for(let i = -amountCellsX/2 ; i <= amountCellsX/2 ; i++){
        if(Math.ceil(i) === 0){
            ctx.strokeStyle = "rgb(225, 135, 0)";
            origin.x = i * cellSize;
        } else {
            ctx.strokeStyle = "rgb(255, 233, 169)"
        }

        // Líneas verticales
        ctx.beginPath();
        ctx.moveTo(cellSize * i, -canvas.height/2);
        ctx.lineTo(cellSize * i, canvas.height/2);
        ctx.stroke();
    }
    
    for(let i = -amountCellsY/2 ; i <= amountCellsY/2 ; i++){

        if(Math.ceil(i) === 0){
            ctx.strokeStyle = "rgb(225, 135, 0)";
            origin.y = i * cellSize;
        } else {
            ctx.strokeStyle = "rgb(255, 233, 169)"
        }        
        // Líneas horizontales
        
        ctx.beginPath();
        ctx.moveTo(-canvas.width/2, cellSize * i);
        ctx.lineTo(canvas.width/2, cellSize * i);
        ctx.stroke();
    }

}  

function drawArrow(ctx, fromX, fromY, toX, toY, arrowHeadLength = 10) {
    ctx.strokeStyle = "rgb(225, 135, 0)";
    const angle = Math.atan2(toY - fromY, toX - fromX); // Ángulo de la línea de la flecha
  
    // Dibujar la línea de la flecha
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);

    ctx.stroke();
  
    // Dibujar la punta de la flecha (dos líneas)
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - arrowHeadLength * Math.cos(angle - Math.PI / 6),
      toY - arrowHeadLength * Math.sin(angle - Math.PI / 6)
    );
  
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
      toY - arrowHeadLength * Math.sin(angle + Math.PI / 6)
    );
    
    ctx.stroke();
}

function lerp(t, A, B){
    return A + t*(B-A);
}