let nodes = [];
let totalNodes = 70;
const maxDistance = 120;
const mouseEffectRadius = 120;
const mouseForce = 12;
let networkHost = null;

function setup() {
    networkHost = document.getElementById('networkCanvas');

    if (!networkHost) {
        noCanvas();
        return;
    }

    const canvas = createCanvas(getCanvasWidth(), getCanvasHeight());
    canvas.parent('networkCanvas');
    canvas.attribute('aria-hidden', 'true');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        noLoop();
        background(245, 247, 251);
        return;
    }

    updateNodeCount();
    createNodes();
}

function draw() {
    if (!networkHost) {
        return;
    }

    clear();
    background(245, 247, 251);

    for (const node of nodes) {
        fill(15, 23, 42, 165);
        noStroke();
        ellipse(node.position.x, node.position.y, 4, 4);

        node.position.add(node.velocity);
        wrapAround(node.position);

        const mouse = createVector(mouseX, mouseY);
        if (dist(node.position.x, node.position.y, mouse.x, mouse.y) < mouseEffectRadius) {
            const flee = p5.Vector.sub(node.position, mouse).setMag(mouseForce);
            node.position.add(flee);
        }
    }

    drawLinesBetweenNodes();
}

function getCanvasWidth() {
    return networkHost ? networkHost.offsetWidth : windowWidth;
}

function getCanvasHeight() {
    const minHeight = Math.max(window.innerHeight - 84, 520);
    return networkHost ? Math.max(networkHost.offsetHeight, minHeight) : minHeight;
}

function updateNodeCount() {
    totalNodes = window.innerWidth < 640 ? 28 : window.innerWidth < 980 ? 46 : 70;
}

function createNodes() {
    nodes = [];
    for (let i = 0; i < totalNodes; i += 1) {
        nodes.push({
            position: createVector(random(width), random(height)),
            velocity: p5.Vector.random2D().mult(random(0.5, 1.8))
        });
    }
}

function wrapAround(position) {
    if (position.x > width) position.x = 0;
    if (position.x < 0) position.x = width;
    if (position.y > height) position.y = 0;
    if (position.y < 0) position.y = height;
}

function drawLinesBetweenNodes() {
    for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
            const distance = dist(
                nodes[i].position.x,
                nodes[i].position.y,
                nodes[j].position.x,
                nodes[j].position.y
            );

            if (distance < maxDistance) {
                stroke(15, 91, 216, map(distance, 0, maxDistance, 55, 8));
                line(nodes[i].position.x, nodes[i].position.y, nodes[j].position.x, nodes[j].position.y);
            }
        }
    }
}

function windowResized() {
    if (!networkHost) {
        return;
    }

    updateNodeCount();
    resizeCanvas(getCanvasWidth(), getCanvasHeight());
    createNodes();
}

