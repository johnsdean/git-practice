# How to Edit Translation Files (a Translator’s Guide)

This document is intended for translators. In reading this document, if you find that something is wrong or unclear, please post your concern so that the wording can be improved.

As a translator, you’ll be given a file with a filename of ??.json, where ?? is the domain code for the language you’re working with. For example, fr.json is DAP’s French translation file.

The .json filename extension is required for JavaScript Object Notation (JSON) files. JSON files’ content must follow a specific format, otherwise the translation files won’t work.

Your translation file will consist of a single JSON object. A JSON object uses this syntax:
```
{
  "key": "value",
  "key": "value",
  "key": "value",
  .
  .
  .
  "key": "value",
  "": ""
}  
```
Each key is a description of a word or phrase that appears on one or more of DAP’s web pages. And each value is the text associated with that key such that the text will be displayed with the user’s selected language. For example, this is the key-value pair in the French translation file that says to display “Oui” every time an affirmation message is required:
```json
"UNIVERSAL-YES": "Oui",
```
As a translator, it’s your job to go through your translation file and provide the values for the key-value pairs, such that the values are in the language you’ve signed up for. More specifically, look for lines that have English values and replace the English values with translated values. For example, if you’re working on a Spanish translation file, you might see this key-value pair:
```json
"SurveyCommon-ENTER_START_DATE": "Enter a Start Date",
```
And you should change that line to this:
```json
"SurveyCommon-ENTER_START_DATE": "Ponga una Fecha de Comienzo",
```
Note that you should NOT edit the English key, which is the string at the left of the colon. Only change the value, which is the string at the right of the colon.

If you’re creating a brand new translation file, then all of the values will be in English initially, and you’ll examine every value to see if it should be translated.

If you’re updating an existing translation file, you might need to examine every value to see if it should be translated. But normally, if you’re updating an existing translation file, you’ll be told that the lines that need updating are prefaced with arrows, like this:
```json
➤  "LocationSpecificSurveyComponent-STEP_2_Q_FULL_NAME_OF_THE_IMPORTER_OF_GOODS": "Please list the full name of the \"Importer of Record\" ",
```
You should delete the arrow and translate the value. So if you saw the above line in the Spanish translation file, you should change it to this:
```json
"LocationSpecificSurveyComponent-STEP_2_Q_FULL_NAME_OF_THE_IMPORTER_OF_GOODS": "Por favor, lista el nombre completo de \"importador del registro\" ",
```
Sometimes, you might decide that using the original English value is better than trying to translate. Normally, if a value has a proper noun, you should leave it as is (do not translate the proper noun). But that's a guideline, not an absolute rule. For example, SmartResponse, Infoplease, 50States, and City-Data are proper nouns that appear as values, and you should not translate them. However, Disaster Accountability Project is a proper noun, and you should translate it if you feel a translation would improve readability. If you're unsure about whether to translate, ask.

As you know, JSON file syntax includes curly braces (\{\}), quotes, colons, and commas. Those items should be correct in your original file. Try to avoid introducing errors to those items, but if you do so, your JSON editor tool (described below) should be able to identify such errors, so you can correct them.


## Special Cases to Look For

- If a value has the two-character sequence \\" in it, do not change it. The \\" thing is an escape sequence, and it’s how the value can display the quote (") character. For example, in the above Spanish translation file line, note this embedded text: completo de \\"importador del registro\\". If you delete the backslash that appears after "de," then the subsequent quote will indicate the end of the value (remember that a value always ends with a quote), and that would lead to a JSON syntax error. Same problem if you delete the backslash that appears after "registro." So do not delete the backslashes! 😊

- Do not modify comment lines. Here’s an example comment line:
```json
  "---------------- THIS IS A COMMENT actual-comment-goes-here--------": "",
```
- If a value has an interpolation in it (an interpolation is a snippet of programming language code surrounded by two pairs of curly braces), do not modify the text between the curly braces. For example:

```json
  "UNIVERSAL-DOWNLOAD_NAME_FILE": "Download File {{index}}",
```
      In the above line, you should translate "Download File" to your language’s words, but you should not modify "index".

- If a value has a URL in it (typically, a URL has http in it) do not modify the code between the brackets. For example:
```json
  "UNIVERSAL-FORM_ERRORS_INVALID_URL": "URL not in format: https://www.example.com/",
```
      In the above line, you should translate "URL not in format" to your language’s words, but you should not modify "https://www.example.com".

- If a value has an HTML tag in it (an HTML tag is a snippet of code surrounded by angled brackets, < >), do not modify the code between the brackets. For example:
```json
  "Dap_Donation-PHONE-METHOD-DETAIL": "<p>If you wish to donate by phone, please call <a class=\"sr-bold black-text\" href=\"tel:12025563023\">202-556-3023</a>.</p><p>Thank you!</p>",
```
      In the above line, you should translate "If you wish to donate by phone, please call" and "Thank you" to your language’s words, but you should not modify the code between the pairs of brackets.

- Some languages use characters that are not supported by standard keyboards. Here’s an example key-value line that uses the French character é:
```json
  "UNIVERSAL-ENTRIES_TEXT": "Entrées",
```
      The JSON file stores the é using the Unicode value \u00e9, so here is the equivalent line in the raw JSON file:
```json
  "UNIVERSAL-ENTRIES_TEXT": "Entr\u00e9es",
```
      In your JSON editor tool (described below), you would see the above line in the tool’s left panel and you would see the prior line (with é) in the tool’s right panel.

      If you need to enter a character that’s not found on your keyboard, you’ll need to enter it as a Unicode character into your tool’s left panel. You can find all the Unicode symbols at https://unicode.org/charts/. Better yet, go to https://unicodelookup.com and search for the alphabet you’re interested in—Latin (for English, French, Spanish, etc.), Greek, Arabic, and so on.


## Code Beautify’s JSON Viewer Tool

Go to https://codebeautify.org/jsonviewer and follow these steps:
- To load your translation file into the Code Beautify tool, you might be tempted to use the Browse button. If you have ➤'s in your translation file, those ➤'s are invalid JSON syntax, and loading a file with the Browse button works only for valid JSON files. Thus, you need to first open your translation file with another tool (NotePad?) and then copy and paste the file’s content into Code Beautify's left panel.
- In the right panel, select View > Code:

  ![Code Beautify](codeBeautify.png)

- After editing your code in the left panel, click the JSON Validator checkmark button (&check;) to validate your code.
If you get a “Valid JSON” message, that means there are no errors.
If you get error messages, fix the errors.
- Click the Beautify button. If you’re happy with the beautified result in the right panel, click the right panel’s download icon and save your file locally.
- Provide your translation file to the DAP team member who gave you your original translation file.
