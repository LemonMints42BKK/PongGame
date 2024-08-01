// let lastTimestamp = new Date().getSeconds();
// const delay = 2;

// function loop() {
//     let timecurrent = new Date().getSeconds();

//     // Handle the case where seconds wrap around from 59 to 0
//     if ((timecurrent - lastTimestamp >= delay)) {

//         console.log(lastTimestamp); // Replace with your own logic
//         lastTimestamp = timecurrent;
//     }

//     requestAnimationFrame(loop);
// }

// function main() {
//     requestAnimationFrame(loop);
// }

// // Call the main function to start waiting for input
// main();
let startTime = null;
let delay = 2000; // delay in milliseconds

function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let elapsed = timestamp - startTime;

    if (elapsed >= delay) {
        console.log("Printing" + timestamp);

        // Reset startTime for the next cycle
        startTime = timestamp;
    }

    // Continue the animation loop
    requestAnimationFrame(animate);
}

// Start the animation loop
requestAnimationFrame(animate);

