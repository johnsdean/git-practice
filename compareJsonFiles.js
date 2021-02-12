/*******************************************************
* compareJsonFiles.js
* John Dean
*
* This file contains functions that support the comparison
* of JSON files.
*******************************************************/

var templateFile = null; // selected en.json file
var templateJson;        // converted to JSON object
var targetFile = null;   // selected *.json file
var targetJson;          // converted to JSON object

function initialize() {
} // end function initialize

//****************************************************

// This function reads the passed-in file that must be in the
// same directory as the directory that stores this web page's
// file.

function readFile(fileType, filePickerEvent) {
  var file;      // file object from file picker
  var filename;  // lowercase name of file
  var reader;    // for reading a file
  var warning;   // container that displays invalid file input

  document.getElementById("comparison-warning").innerHTML = "";

  // If user selects cancel, that will change the file picker's
  // display to "No file chosen," so need to null the chosen file.
  if (filePickerEvent.target.value == "") {
    if (fileType == "template") {
      templateFile = null;
    }
    else {
      targetFile = null;
    }
  } // end if user cancels

  // Handle normal case, when user did not cancel.
  else {
    file = filePickerEvent.target.files[0];
    filename = file.name.toLowerCase();
    console.log("filename = " + filename);

    if (fileType == "template") {
      warning = document.getElementById("template-warning");
      if (filename == "en.json") {
        warning.innerHTML = "";
      }
      else {
        templateFile = null;
        warning.innerHTML =
          "Invalid selection. You must select an en.json file.";
      }
    }

    // Handle fileType == "target"
    else {
      warning = document.getElementById("target-warning");
      if (filename.split(".")[1] == "json") {
        warning.innerHTML = "";
      }
      else {
        targetFile = null;
        warning.innerHTML =
          "Invalid selection. You must select a *.json file.";
      }
    }

    if (warning.innerHTML == "") {
      reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      // Add a filename property so the onload event handler can know
      // which file is being read.
      reader.filename = filename;

      reader.onload = function (readerEvent) {
        if (readerEvent.target.filename == "en.json") {
          templateFile = readerEvent.target;
        }
        else {
          targetFile = readerEvent.target;
        }
      } // end reader.onload

      reader.onerror = function (e) {
        console.log("error reading file");
      }
    } // end if warning == ""
  } // end else user did not cancel
} // end function readFile

//****************************************************

function compareFiles() {
  var warning = ""; // warning message about the comparison

  templateJson = targetJson = null;

  if (templateFile == null || targetFile == null) {
    warning =
      "You must select valid files before comparing.\n";
  }
  else {
    try {
      templateJson = JSON.parse(templateFile.result);
    }
    catch (err) {
      warning =
        "JSON syntax error in file " + templateFile.filename;
    }
    try {
      targetJson = JSON.parse(targetFile.result);
    }
    catch (err) {
      if (warning != "") {
        warning += "<br>";
      }
      warning +=
        "JSON syntax error in file " + targetFile.filename;
    }
  } // end else

  document.getElementById("comparison-warning").innerHTML =
    warning;

  if (templateJson != null && targetJson != null) {
    displayMissingLines();
  }
} // end compareFiles

//****************************************************

// This function finds the template file's JSON keys that
// are not in the target file.
// For each of those missing keys, display the template file's
// relevant line and preface with the line's number.

function displayMissingLines() {
  var results;      // container that displays comparison message
  var templateKeys; // keys in template file
  var targetKeys;   // keys in target file
  var missingLines; // lines in template that are not in target

  templateKeys = Object.keys(templateJson);
  targetKeys = Object.keys(targetJson);
  missingLines = "";

  results = document.getElementById("results");

  templateKeys.forEach(
    function(key) {
      if (targetKeys.indexOf(key) == -1) {
        line = "  \"" + key + "\": \"" + templateJson[key] + "\",<br>";
        missingLines += line;
      }
    }
  );

  results.innerHTML = missingLines;
} // end displayMissingLines