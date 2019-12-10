canvas = document.getElementById("map");
context = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// rectangle dimensions - square
const rectWidth = 80;
const rectHeight = 80;
const platformHeight = 20;

// upper map - 1/5 from top
// lower map - 2/3 from top
const upperMapHeight = canvasHeight / 5;
const lowerMapHeight = 2 * canvasHeight / 3;

const x_vel = 10;
const y_vel = 10;
const platform_vel = 2;

rectLeft = {
    x_pos: canvasWidth / 4,
    y_pos: upperMapHeight,
    isSmiling: false
};

rectCenter = {
    x_pos: canvasWidth / 2,
    y_pos: lowerMapHeight,
    isSmiling: false
};

rectRight = {
    x_pos: 3 * canvasWidth / 4,
    y_pos: lowerMapHeight,
    isSmiling: false
};

rectPlatform = {
    x_pos: canvasWidth / 3,
    y_pos: lowerMapHeight + rectHeight
}

rectButtonLeft = {
    x_pos: 0,
    y_pos: upperMapHeight + rectHeight
}

rectButtonRight = {
    x_pos: canvasWidth - rectWidth,
    y_pos: lowerMapHeight + rectHeight
}

// updates position of specified rectangle by offsets
function moveRect(position, xOffset, yOffset) {
    switch (position) {
        case "left":
            rectLeft.x_pos += xOffset;
            rectLeft.y_pos += yOffset;
            break;
        case "center":
            rectCenter.x_pos += xOffset;
            rectCenter.y_pos += yOffset;
            break;
        case "right":
            rectRight.x_pos += xOffset;
            rectRight.y_pos += yOffset;
            break;
    }
}

function movePlatform(yOffset) {
    rectPlatform.y_pos += yOffset;
    if (Math.abs(rectCenter.x_pos - rectPlatform.x_pos) < rectWidth)
        rectCenter.y_pos += yOffset;
}

// Math.abs position difference?
function onLeftButton() {
    if (Math.abs(rectLeft.x_pos - rectButtonLeft.x_pos) < rectWidth) {
        return true
    }
}

function onRightButton() {
    if (Math.abs(rectRight.x_pos - rectButtonRight.x_pos) < rectWidth) {
        return true
    }
}

function loop() {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvasWidth, canvasHeight)

    context.fillStyle = "green";
    context.fillRect(0, upperMapHeight + rectHeight, canvasWidth / 3, canvasHeight - upperMapHeight - rectHeight)
    context.fillRect(canvasWidth / 3 - 1, lowerMapHeight + rectHeight, 2 * canvasWidth / 3 + 1, lowerMapHeight)


    context.fillStyle = "blue";
    context.fillRect(rectLeft.x_pos, rectLeft.y_pos, rectWidth, rectHeight);

    context.fillStyle = "red";
    context.fillRect(rectCenter.x_pos, rectCenter.y_pos, rectWidth, rectHeight);

    context.fillStyle = "yellow";
    context.fillRect(rectRight.x_pos, rectRight.y_pos, rectWidth, rectHeight);

    context.fillStyle = "black";
    context.fillRect(rectPlatform.x_pos, rectPlatform.y_pos, rectWidth, platformHeight);

    context.fillRect(rectButtonLeft.x_pos, rectButtonLeft.y_pos, rectWidth, platformHeight);
    context.fillRect(rectButtonRight.x_pos, rectButtonRight.y_pos, rectWidth, platformHeight);

    if (onLeftButton()) {
        movePlatform(platform_vel)
    }
    if (onRightButton()) {
        movePlatform(-platform_vel)
    }

    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", function (event) {
    switch (event.code) {
        case "KeyA":
            moveRect("left", -x_vel, 0)
            break;
        case "KeyD":
            moveRect("left", x_vel, 0)
            break;
        case "ArrowLeft":
            moveRect("center", -x_vel, 0)
            break;
        case "ArrowRight":
            moveRect("center", x_vel, 0)
            break;
        case "KeyJ":
            moveRect("right", -x_vel, 0)
            break;
        case "KeyL":
            moveRect("right", x_vel, 0)
            break;
    }
    refresh();
}, true);

window.requestAnimationFrame(loop);