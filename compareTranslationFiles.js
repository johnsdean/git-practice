﻿/*******************************************************
* compareJsonFiles.js
* John Dean
*
* This file contains functions that support the comparison
* of JSON files.
*******************************************************/

var enFile = null;     // selected en.json file
var enJson;            // converted to JSON object
var otherFile = null;  // selected *.json file
var otherJson;         // converted to JSON object

function initialize() {
} // end function initialize

//****************************************************

// This function reads the user-selected file and checks
// to make sure its filename is valid and it uses proper
// JSON syntax.

function readFile(form, fileType, filePickerEvent) {
  var file;        // file object from file picker
  var filename;    // lowercase name of file
  var reader;      // for reading a file
  var warning;     // container that displays invalid file input
  var makeCopyBtn; // the button that creates copy of other file
  var surplusKeysInOtherBtn; // displays surplus keys in other file

  form.elements["surplus-keys-in-en-btn"].disabled = true;
  form.elements["surplus-keys-in-other-btn"].disabled = true;
  form.elements["make-copy-btn"].disabled = true;

  if (fileType == "en") {
    warning = document.getElementById("en-warning");
  }
  else {
    warning = document.getElementById("other-warning");
  }

  // If user selects cancel, that will change the file picker's
  // display to "No file chosen," so need to null the chosen file
  // and clear any warnings.
  // Selecting cancel causes the file picker to return "".
  if (filePickerEvent.target.value == "") {
    warning.innerHTML = "";
    if (fileType == "en") {
      enFile = null;
    }
    else {
      otherFile = null;
    }
  } // end if user cancels

  // Handle normal case, when user did not cancel.
  else {
    file = filePickerEvent.target.files[0];
    filename = file.name.toLowerCase();

    if (fileType == "en") {
      if (filename == "en.json") {
        warning.innerHTML = "";
      }
      else {
        enFile = null;
        warning.innerHTML =
          "You must select an en.json file.";
      }
    }

    // Handle fileType == "other"
    else {
      if (filename == "en.json") {
        otherFile = null;
        warning.innerHTML =
          "You must not select an en.json file.";
      }
      else if (filename.split(".")[1] != "json") {
        otherFile = null;
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
          enFile = readerEvent.target;
          try {
            enJson = JSON.parse(enFile.result);
          }
          catch (err) {
            enJson = null;
            warning.innerHTML =
              "JSON syntax error in " + enFile.filename;
          }
        } // end if en file

        else {
          otherFile = readerEvent.target;
          try {
            otherJson = JSON.parse(otherFile.result);
          }
          catch (err) {
            otherJson = null;
            warning.innerHTML =
              "JSON syntax error in " + otherFile.filename;
          }
        } // end else

        if (enJson != null && otherJson != null) {
          form.elements["surplus-keys-in-en-btn"].disabled = false;

          surplusKeysInOtherBtn =
            form.elements["surplus-keys-in-other-btn"];
          surplusKeysInOtherBtn.disabled = false;
          surplusKeysInOtherBtn.value =
            surplusKeysInOtherBtn.value.replace(
              /\S*\.json/, otherFile.filename);

          makeCopyBtn = form.elements["make-copy-btn"];
          makeCopyBtn.disabled = false;
          makeCopyBtn.value =
            makeCopyBtn.value.replace(
              /\S*\.json/, otherFile.filename);
        }
      } // end reader.onload

      reader.onerror = function (e) {
        console.log("error reading file");
      }
    } // end if warning == ""
  } // end else user did not cancel
} // end function readFile

//****************************************************

function findSurplusKeys(form, fileType) {
  var warning;

  if (fileType == "en") {
    form.elements["en-msg"].innerText =
      "Here are the en.json lines (with key numbers inserted\n" +
      " at the left) whose keys are missing in the " +
      otherFile.filename + " file.\n" +
      "If you click the \"Make improved copy\" button, these\n" +
      " lines will be inserted in the generated file.";
    form.elements["en-results"].style.display = "block";
  }
  else {
    form.elements["other-msg"].innerText =
      "Here are the " + otherFile.filename +
      " lines (with key numbers inserted\n" +
      " at the left) whose keys are missing in the en.json file.\n" +
      "If you click the \"Make improved copy\" button, these\n" +
      " lines will NOT be inserted in the generated file,\n" +
      "and they should be investigated manually.";

    form.elements["other-results"].style.display = "block";
  }

  displaySurplusLines(form, fileType);
} // end findSurplusKeys

//****************************************************

// This function finds the keys that are in the file
// specified by fileType and not in the other file.
// For each of those surplus keys, display the line where
// the key comes from and preface with the line's number.

function displaySurplusLines(form, fileType) {
  var results;      // container that displays results
  var surplusKeys;  // keys in en.json file
  var compareKeys;  // keys in other file
  var surplusLines; // lines in en.json that are not in other
  var keyNum;       // the key number for each printed line

  if (fileType == "en") {
    results = form.elements["en-results"];
    surplusKeys = Object.keys(enJson);
    compareKeys = Object.keys(otherJson);
    surplusJson = enJson;
  }
  else {
    results = form.elements["other-results"];
    surplusKeys = Object.keys(otherJson);
    compareKeys = Object.keys(enJson);
    surplusJson = otherJson;
  }
  surplusLines = "";

  keyNum = 0;

  surplusKeys.forEach(
    function(key) {
      keyNum++;
      if (compareKeys.indexOf(key) == -1) {
        // Build a key-value line with key number at start
        // and newline at the end.
        line = keyNum.toString().padEnd(6) +
          "\"" + key + "\": \"" + surplusJson[key] +
          "\",\n";
        surplusLines += line;
      }
    }
  );

  if (surplusLines == "") {
    results.value = "There are no missing lines.";
  }
  else {
    results.value = surplusLines;
  }
} // end displaysurplusLines

//****************************************************

// This function displays en.json's content with the other
// file's values replacing the values in en.json.
// For the keys in en.json that are not in the other file,
// those keys' line are displayed in green.

function makeCopy(form) {
  var content;      // displayed content of proposed new JSON file
  var enKeys;       // keys in en.json file

  enKeys = Object.keys(enJson);
  content = "{\n";

  enKeys.forEach(
    function (key) {

      // Build a key-value line with newline at the end.
      if (key in otherJson) {
        content += "  ";
        value = otherJson[key];
      }
      else {
        content += "\u27A4  ";
        value = enJson[key];
      }

      content +=
        "\"" + key + "\": \"" + value + "\",\n";
    } 
  );

  // remove trailing comma
  content = content.substring(0, content.length - 2);
  content += "\n}";

  form.elements["copied-file-msg"].innerText =
    "Here is the proposed new " + otherFile.filename + " file.\n" +
    "If en.json has surplus keys, those lines are marked with" +
    " arrows at the left.";

  form.elements["copied-file"].style.display = "block";
  form.elements["copied-file"].value = content;
} // end makeCopy