let nodes = [];
let totalNodes = 100;
let maxDistance = 100; // Máxima distancia para conectar nodos
let mouseEffectRadius = 100; // Radio de efecto del mouse
let mouseForce = 15; // Fuerza de reacción al mouse

function setup() {

    // Calcula el ancho y alto, pero no permite que excedan el máximo definido
    const canvasWidth = windowWidth-(100);
    const canvasHeight = windowHeight;

    // Crea el canvas con el ancho y alto ajustados
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('networkCanvas'); // Asegúrate de que el ID 'networkCanvas' sea correcto


    // Crear nodos con velocidades iniciales aleatorias
    for (let i = 0; i < totalNodes; i++) {
        let node = {
            position: createVector(random(width), random(height)),
            velocity: p5.Vector.random2D().mult(random(1, 3))
        };
        nodes.push(node);
    }
}

function draw() {
    background(255);

    nodes.forEach(node => {
        // Dibujar nodo
        fill(0);
        noStroke();
        ellipse(node.position.x, node.position.y, 6, 6);

        // Actualizar posición del nodo basado en su velocidad
        node.position.add(node.velocity);

        // Mantener los nodos dentro del canvas
        wrapAround(node.position);

        // Reacción al mouse
        let mouse = createVector(mouseX, mouseY);
        if (dist(node.position.x, node.position.y, mouse.x, mouse.y) < mouseEffectRadius) {
            let flee = p5.Vector.sub(node.position, mouse).setMag(mouseForce);
            node.position.add(flee);
        }
    });

    // Dibujar líneas entre nodos cercanos
    drawLinesBetweenNodes();
}

function wrapAround(position) {
    if (position.x > width) position.x = 0;
    if (position.x < 0) position.x = width;
    if (position.y > height) position.y = 0;
    if (position.y < 0) position.y = height;
}

function drawLinesBetweenNodes() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            let d = dist(nodes[i].position.x, nodes[i].position.y, nodes[j].position.x, nodes[j].position.y);
            if (d < maxDistance) {
                stroke(0, 50);
                line(nodes[i].position.x, nodes[i].position.y, nodes[j].position.x, nodes[j].position.y);
            }
        }
    }
}

function windowResized() {
    const canvasWidth = min(windowWidth, maxWidth);
    const canvasHeight = min(windowHeight, maxHeight);
    resizeCanvas(canvasWidth, canvasHeight);
}


