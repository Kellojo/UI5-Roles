const chokidar = require('chokidar');
const watchDir = "../webapp/";
const lessBuilder = "sh build-less.sh";
 
//start watching
const watcher = chokidar.watch(watchDir, {
    ignoreInitial: true,
});
watcher.on('all', (event, path) => {

    //check for less file changes
    if (path.includes(".less")) {
        console.log("Rebuilding less due to \"" + event + "\" -> " + path);
        buildLess();
    }
});

console.log("Auto less builder running...\n\n");


/**
 * Builds the themes
 * @public
 */
function buildLess() {
    const exec = require('child_process').exec;
    var themeBuilder = exec(lessBuilder,
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
    });
}