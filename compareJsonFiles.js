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

// This function reads the user-selected file and checks
// to make sure its filename is valid and it uses proper
// JSON syntax.

function readFile(form, fileType, filePickerEvent) {
  var file;      // file object from file picker
  var filename;  // lowercase name of file
  var reader;    // for reading a file
  var warning;   // container that displays invalid file input

  form.elements["findLinesBtn"].disabled = true;

  if (fileType == "template") {
    warning = document.getElementById("template-warning");
  }
  else {
    warning = document.getElementById("target-warning");
  }

  // If user selects cancel, that will change the file picker's
  // display to "No file chosen," so need to null the chosen file
  // and clear any warnings.
  // Selecting cancel causes the file picker to return "".
  if (filePickerEvent.target.value == "") {
    warning.innerHTML = "";
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

    if (fileType == "template") {
      if (filename == "en.json") {
        warning.innerHTML = "";
      }
      else {
        templateFile = null;
        warning.innerHTML =
          "You must select an en.json file.";
      }
    }

    // Handle fileType == "target"
    else {
      if (filename == "en.json") {
        targetFile = null;
        warning.innerHTML =
          "You must not select an en.json file.";
      }
      else if (filename.split(".")[1] != "json") {
        targetFile = null;
        warning.innerHTML =
          "You must select a *.json file.";
      }
      else {
        warning.innerHTML = "";
      }
    }

    if (warning.innerHTML == "") {
      reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      // Add a filename property so the onload event handler can
      // know which file is being read.
      reader.filename = filename;

      // The file can be parsed only after it has loaded, which
      // takes some time. Thus the callback mechanism...
      reader.onload = function (readerEvent) {
        if (readerEvent.target.filename == "en.json") {
          templateFile = readerEvent.target;
          try {
            templateJson = JSON.parse(templateFile.result);
          }
          catch (err) {
            templateJson = null;
            warning.innerHTML =
              "JSON syntax error in " + templateFile.filename;
          }
        } // end if template file

        else {
          targetFile = readerEvent.target;
          try {
            targetJson = JSON.parse(targetFile.result);
          }
          catch (err) {
            targetJson = null;
            warning.innerHTML =
              "JSON syntax error in " + targetFile.filename;
          }
        } // end else

        if (templateJson != null && targetJson != null) {
          form.elements["findLinesBtn"].disabled = false;
        }
      } // end reader.onload

      reader.onerror = function (e) {
        console.log("error reading file");
      }
    } // end if warning == ""
  } // end else user did not cancel
} // end function readFile

//****************************************************

function findLines(form) {
  // With the button disabled, the files should be valid at
  // this point and this warning should never be displayed.
  if (templateJson == null || targetJson == null) {
    form.elements["message"].value =
      "You must select valid files before comparing.";
  }
  else {
    form.elements["message"].value =
      "Here are the en.json lines (with key numbers inserted" +
      " at the left) whose keys are missing in the " +
      targetFile.filename + " file:"
    form.elements["results"].style.display = "block";
    displayMissingLines(form);
  }
} // end findLines

//****************************************************

// This function finds the template file's JSON keys that
// are not in the target file.
// For each of those missing keys, display the template file's
// relevant line and preface with the line's number.

function displayMissingLines(form) {
  var results;      // container that displays results
  var templateKeys; // keys in template file
  var targetKeys;   // keys in target file
  var missingLines; // lines in template that are not in target
  var keyNum;       // pint the key number for each printed line

  results = form.elements["results"];
  templateKeys = Object.keys(templateJson);
  targetKeys = Object.keys(targetJson);
  missingLines = "";

  keyNum = 0;

  templateKeys.forEach(
    function(key) {
      keyNum++;
      if (targetKeys.indexOf(key) == -1) {
        // Build a key-value line with key number at start
        // and newline at the end.
        line = keyNum.toString().padEnd(6) +
          "\"" + key + "\": \"" + templateJson[key] +
          "\",\n";
        missingLines += line;
      }
    }
  );

  if (missingLines == "") {
    results.value = "There are no missing lines.";
  }
  else {
    results.value = missingLines;
  }
} // end displayMissingLines