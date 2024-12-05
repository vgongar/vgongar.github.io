class Simulation{
    constructor(particle, F){
        this.particle = particle;
        this.F = F;
    }

    update(t, deltaTime){
        const joined = new Vector(...this.particle.position, ...this.particle.velocity); // dimension 4
        const nextStep = RK4(this.F, t, joined, deltaTime);
        
        this.particle.position = new Vector(...nextStep.slice(0,2));
        this.particle.velocity = new Vector(...nextStep.slice(2,4));

        // actualizamos el trail
        this.particle.trail.shift();
        this.particle.trail.push(this.particle.position);
    }
}

function RK4(F, t, x, h) {
    const tmed = t + 0.5 * h;
  
    const k1 = F(t, ...x);
    const k2 = F(tmed, ...Vector.add(x, k1.scale(0.5 * h)));
    const k3 = F(tmed, ...Vector.add(x, k2.scale(0.5 * h)));
    const k4 = F(t + h, ...Vector.add(x, k3.scale(h)));
  
    return Vector.add(x, Vector.add(k1, k2.scale(2), k3.scale(2), k4).scale(h / 6));
  }
  

function rk4(f,t,x,h){
    const tmed = t + 0.5*h;
    
    const k1 = f(t   , x);
    const k2 = f(tmed, x + 0.5*h*k1);
    const k3 = f(tmed, x + 0.5*h*k2);
    const k4 = f(t+h,  x +     h*k3);

    return x + h/6*(k1 + 2*k2 + 2*k3 + k4);
}