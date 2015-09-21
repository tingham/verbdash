// # VERBDASH
// Conslidates MODO Collada output to capture all action animation sequences as named actions.
//

var fs = require("fs");
var _ = require("underscore");
var parseArgs = require("minimist")(process.argv.slice(2));
var inputKey = {"key": "input", "description": "The directory of source DAE files."};
var outputKey = {"key": "output", "description": "The output directory to store the file. (Optional)"};
var dashKey = {"key": "dash", "description": "The character Verbdash uses to find Action names."};
var inputPath = null;
var dashCharacter = "@";
var outputPath = null;
var actions = {};
var help = "==VERBDASH====(@,#,!,?)=================\n";
var canRun = true;
var ignores = [".DS_Store"];

function start () {
    var fileList = filterFiles(fs.readdirSync(inputPath));

    // Clean all action file animation<> blocks.
    // Replace or append the animation name (lowercased, posixed) to the animation<> tag.
    // Insert all animation blocks into the destination string.
    // Write target file.

    // s.match(/[\@](.*)(\.dae)/i)
    var regex = new RegExp(dashCharacter + "(.*)(\\.dae)", "i");
    var removeAnimationSubtagsRegex = new RegExp("</animation>[\r|\n].*<animation.*", "g");
    var yankAnimationChunkRegex = new RegExp("<animation id=.*>((.|\n|\r)*)</animation>", "i");
    var replaceIdRegex = new RegExp("id=\"(.*)\"", "i");
    var match = null;
    var filePath = "";

    var inputString = "";
    var cleansedString = "";
    var actionName = "";
    var idName = "";
    var animationChunk = "";

    var masterFileString = readFile([inputPath, fileList[0]].join("/"));

    if (masterFileString === false) {
        console.log("Cannot locate the master file in the target directory.");
        return;
    }

    console.log("Processing: " + fileList[0]);
    for (var file = 0; file < fileList.length; file++) {

        match = fileList[file].match(regex);
        if (_.isEmpty(match) || match.length !== 3) {
            continue;
        }

        actionName = match[1];

        console.log("  Action: " + actionName);

        filePath = [inputPath, fileList[file]].join("/");
        inputString = readFile(filePath);

        if (inputString === false) {
            console.log("There was an error processing a file. (" + filePath + ") not found.");
            return;
        }

        if (inputString.match(removeAnimationSubtagsRegex) === null) {
            console.log("There was an error processing (" + filePath + ") - Verbdash couldn't locate the <animation> chunks to consolidate. No further work will be performed, sorry.");
            return;
        }

        cleansedString = inputString.replace(removeAnimationSubtagsRegex, "");

        idName = [" id=\"", sanitizeId(actionName), "Id\"", " name=\"", sanitizeId(actionName), "\""].join("");

        if (cleansedString.match(yankAnimationChunkRegex) === null) {
            console.log("While we were able to extract the errant animation components in the file, we couldn't locate the single animation chunk afterwards. No further work will be performed, sorry.");
            return;
        }

        actions[actionName] = cleansedString.match(yankAnimationChunkRegex)[0].replace(replaceIdRegex, idName);

    }
    
    var outputString = "</asset>" + "\n" + "<library_animations>";

    for (var action in actions) {
        outputString += "\n" + actions[action] + "\n";
    }

    outputString += "</library_animations>";

    outputString = masterFileString.replace("</asset>", outputString);

    if (outputPath === null) {
        outputPath = [inputPath, fileList[0].replace(".dae", "-Condensed.dae")].join("/");
    }

    writeOutput(outputString, outputPath);

}

function writeOutput (output, toFile) {
    if (fs.existsSync(toFile)) {
        console.log("Output file: " + toFile + " already exists.");
        return;
    }

    var handle = fs.openSync(toFile, 'w');
    fs.writeSync(handle, output);
    fs.closeSync(handle);
}

function sanitizeId (someId) {
    var cleanRegExp = new RegExp(/([^\w\s\d\[\]\(\).])/g);
    return someId.replace(cleanRegExp, "").toLowerCase();
}

function readFile (filePath) {
    if (!fs.existsSync(filePath)) {
        return false;
    }
    var data = fs.readFileSync(filePath, {encoding: "utf8"});

    return data;
}

function filterFiles (fileList) {
    fileList = _.filter(fileList, function (item) {
        for (var ignore = 0; ignore < ignores.length; ignore++) {
            if (item === ignores[ignore]) {
                return false;
            }
        }
        return true;
    });
    return fileList;
}

if (_.isEmpty(parseArgs[inputKey["key"]])) {
    help += "  " + inputKey["key"] + ":\n";
    help += "    " + inputKey["description"] + "\n";
    canRun = false;
}
else {
    inputPath = parseArgs[inputKey["key"]];
}

if (_.isEmpty(parseArgs[dashKey["key"]])) {
    help += "  " + dashKey["key"] + ":\n";
    help += "    " + dashKey["description"] + "\n";
    help += "    " + "(Will use the default: " + dashCharacter + ")\n";
}

if (_.isEmpty(parseArgs[outputKey["key"]])) {
    help += "  " + outputKey["key"] + ":\n";
    help += "    " + outputKey["description"] + "\n";
    if (canRun) {
        help += "    " + "(Will use: " + inputPath + ")\n";
    }
}

console.log(help + "\n");

if (canRun) {
    start();
}
