// Eric Tsang

// essential variables/constants
canvas = document.getElementById("map");
context = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const rectWidth = 80;
const rectHeight = 80;
const platformHeight = 20;

const upperMapHeight = canvasHeight / 5;
const lowerMapHeight = 2 * canvasHeight / 3;

const x_vel = 10;
const y_vel = 10;
const platform_vel = 5;
var gravity_vel = 5; // not const since it is affected by acceleration

// 3 rectangles - the "characters" interacting in this demonstration
rectLeft = {
    x_pos: canvasWidth / 5,
    y_pos: upperMapHeight
};
rectCenter = {
    x_pos: canvasWidth / 2,
    y_pos: lowerMapHeight,
};
rectRight = {
    x_pos: 3 * canvasWidth / 4,
    y_pos: lowerMapHeight
};

// platform that carries rectCenter from lowerMapHeight to upperMapHeight
rectPlatform = {
    x_pos: canvasWidth / 3,
    y_pos: lowerMapHeight + rectHeight
}
// buttons controlled by rectLeft and rectRight that lower and raise
// rectPlatform respectively
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
            if (withinXBounds(rectLeft.x_pos, rectLeft.y_pos, xOffset))
                rectLeft.x_pos += xOffset;
            if (withinYBounds(rectLeft.y_pos, yOffset))
                rectLeft.y_pos += yOffset;
            break;
        case "center":
            if (withinXBounds(rectCenter.x_pos, rectCenter.y_pos, xOffset))
                rectCenter.x_pos += xOffset;
            if (withinYBounds(rectCenter.y_pos, yOffset))
                rectCenter.y_pos += yOffset;
            break;
        case "right":
            if (withinXBounds(rectRight.x_pos, rectRight.y_pos, xOffset))
                rectRight.x_pos += xOffset;
            if (withinYBounds(rectRight.y_pos, yOffset))
                rectRight.y_pos += yOffset;
            break;
    }
}
// check if x_pos + xOffset is within horizontal bounds of canvas and map
function withinXBounds(x_pos, y_pos, xOffset) {
    if (x_pos + xOffset < 0 || x_pos + xOffset > canvasWidth)
        return false
    if (y_pos >= lowerMapHeight && x_pos + xOffset < canvasWidth / 3)
        return false
    return true
}

// check if y_pos + yOffset is within vertical bounds of canvas and map
function withinYBounds(y_pos, yOffset) {
    if (y_pos + yOffset < 0 || y_pos + yOffset > lowerMapHeight)
        return false
    return true
}

// lowers/raises rectPlatform by yOffset (if positive/negative respectively)
function movePlatform(yOffset) {
    if (withinYBounds(rectPlatform.y_pos - rectHeight, yOffset)) {
        rectPlatform.y_pos += yOffset;
        if (onPlatform() && withinYBounds(rectCenter.y_pos, yOffset))
            rectCenter.y_pos += yOffset;
    }
}

// checks if rectCenter is on the rectPlatform
function onPlatform() {
    if (Math.abs(rectCenter.x_pos - rectPlatform.x_pos) < rectWidth && Math.abs(rectCenter.y_pos + rectHeight - rectPlatform.y_pos) <= platformHeight) {
        return true
    }
    return false
}

// checks if rectLeft is on the left button
function onLeftButton() {
    if (Math.abs(rectLeft.x_pos - rectButtonLeft.x_pos) < rectWidth) {
        return true
    }
}

// checks if rectRight is on the right button
function onRightButton() {
    if (Math.abs(rectRight.x_pos - rectButtonRight.x_pos) < rectWidth) {
        return true
    }
}

// gravity acceleration
function gravity() {
    if (rectCenter.x_pos < canvasWidth / 3 && rectCenter.y_pos < upperMapHeight) {
        gravity_vel += 0.2;
        if (withinYBounds(rectCenter.y_pos, gravity_vel))
            rectCenter.y_pos += gravity_vel;
        else
            rectCenter.y_pos = upperMapHeight;
    } else if (rectCenter.x_pos >= canvasWidth / 3 && rectCenter.y_pos < lowerMapHeight) {
        gravity_vel += 0.2;
        if (withinYBounds(rectCenter.y_pos, gravity_vel))
            rectCenter.y_pos += gravity_vel;
        else
            rectCenter.y_pos = lowerMapHeight;
    } else {
        gravity_vel = 5;
    }
}

// checks if rectCenter is on the upper side of the map in which case it should
// smile in the loop() function
function isSmiling() {
    if (rectCenter.x_pos < canvasWidth / 3 - rectWidth && rectCenter.y_pos <= upperMapHeight + y_vel) {
        return true
    }
    return false
}

// draw frame within canvas
function loop() {
    // fill background
    context.fillStyle = "#7D7ABC";
    context.fillRect(0, 0, canvasWidth, canvasHeight)

    // fill map structure
    context.fillStyle = "#6457A6";
    context.fillRect(0, upperMapHeight + rectHeight, canvasWidth / 3, canvasHeight - upperMapHeight - rectHeight)
    context.fillRect(canvasWidth / 3, lowerMapHeight + rectHeight, 2 * canvasWidth / 3, lowerMapHeight)

    // fill left rect
    context.fillStyle = "#23F0C7";
    context.fillRect(rectLeft.x_pos, rectLeft.y_pos, rectWidth, rectHeight);

    // fill center rect
    context.fillStyle = "#FFE347";
    context.fillRect(rectCenter.x_pos, rectCenter.y_pos, rectWidth, rectHeight);
    // adds smile or frown to center rect depending on position
    let circleXPos = rectCenter.x_pos + rectWidth / 2;
    let circleYPos = rectCenter.y_pos + rectHeight / 2;
    context.beginPath();
    if (isSmiling())
        context.arc(circleXPos, circleYPos, 30, 0, Math.PI, false);
    else
        context.arc(circleXPos, circleYPos + 30, 30, 0, Math.PI, true);
    context.moveTo(circleXPos - 10, circleYPos - 10);
    context.arc(circleXPos - 15, circleYPos - 10, 5, 0, Math.PI * 2, true);
    context.moveTo(circleXPos + 20, circleYPos - 10);
    context.arc(circleXPos + 15, circleYPos - 10, 5, 0, Math.PI * 2, true);
    context.stroke();

    // fill right rect
    context.fillStyle = "#23F0C7";
    context.fillRect(rectRight.x_pos, rectRight.y_pos, rectWidth, rectHeight);

    // fill platform
    context.fillStyle = "#FFE347";
    context.fillRect(rectPlatform.x_pos, rectPlatform.y_pos, rectWidth, platformHeight);

    // fill left and right buttons
    context.fillStyle = "#23F0C7";
    context.fillRect(rectButtonLeft.x_pos, rectButtonLeft.y_pos, rectWidth, platformHeight);
    context.fillRect(rectButtonRight.x_pos, rectButtonRight.y_pos, rectWidth, platformHeight);

    // handle platform movement and gravity depending on rectCenter position
    if (onLeftButton()) {
        movePlatform(platform_vel)
    }
    if (onRightButton()) {
        movePlatform(-platform_vel)
    }
    if (!onPlatform()) {
        gravity();
    }

    // call loop function again to draw next frame
    window.requestAnimationFrame(loop);
}

// keyboard navigation for the 3 rectangles
window.addEventListener("keydown", function (event) {
    switch (event.code) {
        // A and D for left and right movement of rectLeft
        case "KeyA":
            moveRect("left", -x_vel, 0)
            break;
        case "KeyD":
            moveRect("left", x_vel, 0)
            break;
        // left and right arrow keys for left and right movement of rectCenter
        case "ArrowLeft":
            moveRect("center", -x_vel, 0)
            break;
        case "ArrowRight":
            moveRect("center", x_vel, 0)
            break;
        // J and L for left and right movement of rectRight
        case "KeyJ":
            moveRect("right", -x_vel, 0)
            break;
        case "KeyL":
            moveRect("right", x_vel, 0)
            break;
    }
}, true);

// begin demo loop
window.requestAnimationFrame(loop);