/* --- Chronometer --- */
// Chronometer variables
let clear_time;
let milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
let chron_millis, chron_secs, chron_mins, chron_hours;

const start_chron = () => {
    // Formatting milliseconds to show in chronometer
    chron_millis = (milliseconds < 1000) ? ("0" + milliseconds) : (milliseconds);
    if (milliseconds === 1000) {
        milliseconds = 0;
        seconds++;
    }
    // Formatting seconds to show in chronometer
    chron_secs = (seconds < 10) ? ("0" + seconds + " : ") : (seconds + " : ");
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    // Formatting minutes to show in chronometer
    chron_mins = (minutes < 10) ? ("0" + minutes + " : ") : (minutes + " : ");
    if (minutes === 60) {
        minutes = 0;
        hours++;
    }
    // Formatting hours to show in chronometer
    chron_hours = (hours < 10) ? ("0" + hours + " : ") : (hours + " : ");

    // Display the chronometer
    const chron = document.getElementById("chronometer");
    chron.innerHTML = "Time: " + chron_hours + chron_mins + chron_secs + chron_millis;
    milliseconds += 100;
    clear_time = setTimeout(start_chron, 100);
};

const reset_chron = () => {
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
};

const stop_chron = () => {
    clearTimeout(clear_time)
};
/* ---~~~--- */

// Available difficulties
const diff_enum = {
    EASY: 0,
    MEDIUM: 25,
    HARD: 50,
    EXTREME: 100,
};

//Setting difficulty from url
const url = new URL(window.location);
let diff_param = url.searchParams.get("difficulty");
diff_param =  diff_param ? diff_param.toUpperCase() : "HARD";

// Utility Functions
const mv_x = (what, x) => what.style.left = x + "px",
    mv_y = (what, y) => what.style.top = y + "px",
    rand = (limit) => Math.random() * limit,
    inRange = (lower, upper, what) => what >= lower && what <= upper;

// Selectors. Duh!
const catch_me = document.getElementById("catch_me"),
    counter = document.getElementById("counter"),
    body = document.querySelectorAll(".body")[0],
    diff_btns = document.querySelectorAll(".diff-btn"),
    active_diff_btn = document.getElementById(diff_param);

// Useful global values
const catch_height = 50,
    catch_width = 100,
    difficulty = diff_enum[diff_param];
    
const incr_counter = () => counter.innerText = +counter.innerText + 1;
// Next positions should be within the visible portion of the window.
const rand_x = () => rand(window.innerWidth - catch_width),
    rand_y = () => rand(window.innerHeight - catch_height),
    mv_catch_x = () => mv_x(catch_me, rand_x()),
    mv_catch_y = () => mv_y(catch_me, rand_y());

// Initial State
active_diff_btn.setAttribute("disabled", "disabled");
start_chron();
catch_me.style.position = "absolute";
catch_me.style.height = catch_height + "px";
catch_me.style.width = catch_width + "px";
catch_me.style.backgroundColor = "#CE1836";
mv_catch_x();
mv_catch_y();

// If you can get your mouse inside here you get a point.
// But the question is, can you? ;)
catch_me.addEventListener("mouseenter", () => {
    mv_catch_x();
    mv_catch_y();
    incr_counter();
});

// Track mouse movement inside body.
body.addEventListener("mousemove", e => {
    const delta_x = e.offsetX - catch_me.offsetLeft,
        delta_y = e.offsetY - catch_me.offsetTop,
        xInRange = inRange(-difficulty, difficulty + catch_width, delta_x),
        yInRange = inRange(-difficulty, difficulty + catch_height, delta_y);
    if (xInRange && yInRange) {
        mv_catch_x();
        mv_catch_y();
        // console.log(`x: ${delta_x} y: ${delta_y}`);
    }
});

diff_btns.forEach(el => {
    el.addEventListener("click", e => {
        url.searchParams.set("difficulty", e.target.id);
        window.location.replace(url);
    })
});
