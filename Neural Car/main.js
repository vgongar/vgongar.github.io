const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
networkCanvas.height = 0.6*window.innerHeight; //60% de la altura del viewport

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=200;
const cars=generateCars(N);
let bestCar=cars[0];
let previousBestCar = bestCar;

const mutationInput = document.getElementById("mutationInput");
let stored = localStorage.getItem("mutation");
let mutation = parseFloat(stored);

// Validar que sea un número real
if (!isNaN(mutation)) {
    mutationInput.value = mutation;
} else {
    mutation = 0.1;
    mutationInput.value = mutation;
    localStorage.setItem("mutation", mutation);
}

if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, parseFloat(mutationInput.value));
        }
    }
}

const presetTrack1 = document.getElementById("presetTrack1");
const presetRandomTrack = document.getElementById("presetRandomTrack");

var traffic=[];

if(localStorage.getItem("selected") !== null) {
    const selected = localStorage.getItem("selected");
    if(selected == "track1"){
        // Cambiar el preset visualmente
        const presets = document.querySelectorAll('.preset');
        presets.forEach(preset => {
            preset.classList.remove("selected");
        });
        presetTrack1.classList.add("selected");

        // Crear el tráfico

        traffic = [
            new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
            new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
            new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
            new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
            new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
            new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
            new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
        ];

    } else if(selected == "randomTrack") {
        // Cambiar el preset visualmente
        const presets = document.querySelectorAll('.preset');
        presets.forEach(preset => {
            preset.classList.remove("selected");
        });
        presetRandomTrack.classList.add("selected");
        // Crear el tráfico
        traffic = [];

        for(let i = 0 ; i < 50 ; i++){
            lane = Math.random()*2;
            lane2 = Math.random()*2;
            traffic.push(new Car(road.getLaneCenter(Math.round(lane)),-i*150-100,30,50,"DUMMY",2));
            traffic.push(new Car(road.getLaneCenter(Math.round(lane2)),-i*150-100,30,50,"DUMMY",2));
        }
    } 
} else { // Si no está creada la variable
    localStorage.setItem("selected", "track1");
    // Cambiar el preset visualmente
    const presets = document.querySelectorAll('.preset');
    presets.forEach(preset => {
        preset.classList.remove("selected");
    });
    presetTrack1.classList.add("selected");

    // Crear el tráfico

    traffic = [
        new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
    ];
}

function selectTrack1() {
    localStorage.setItem("selected", "track1");
    location.reload();
}

function selectRandomTrack() {
    localStorage.setItem("selected", 'randomTrack');    
    location.reload();
}

mutationInput.addEventListener('input', () => {
    const valor = parseFloat(mutationInput.value);

    if (!isNaN(valor)) {
        localStorage.setItem("mutation", valor);
    } else {
        console.warn("Valor no válido para mutation:", mutationInput.value);
        localStorage.setItem("mutation", 0.1);
    }
});


animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
    location.reload();
}

function discard(){
    localStorage.removeItem("bestBrain");
    location.reload();
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);

    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx, 'rgb(186, 13, 1)');
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx, 'rgb(125, 0, 119)');
    }
    carCtx.globalAlpha=1;
    previousBestCar.draw(carCtx, 'rgb(0, 97, 0)');
    bestCar.draw(carCtx, 'rgb(125, 0, 119)',true);
    
    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}