# git-practice
Practice git commands. Local repo was created first with git init.

## Additional heading
2nd new-work.

Caiden hay bale pic:
![test](caidenHayBale.jpg)

- [Front-end/CSS/Angular Volunteers](#front-endcssangular-volunteers)

# Front-end/CSS/Angular Volunteers

# Front-end Angular Volunteers

The purpose of this page is to help front-end developers
[understand](#understanding-translation-files) and
[update](#updating-translation-files) translation files.

## Understanding Translation Files

### Background Information

To provide support for translations, you must do two things:

Remember to update your packages! Run `npm install` to ensure that the latest package requirements are installed.

1. Define a name-spaced key for your static string.

    - Name space your key like this: "ComponentName - Tell", where `tell` explains the intent of the string (it should be shorter than the string). For example, "CarouselComponent-CAROUSEL_MESSAGE".

2. Then, add the key and value to the English dictionary. The dictionary is located at `SmartWeb/src/assets/i18n/en.json`.

- For example, "CarouselComponent-CAROUSEL_MESSAGE": "This would our carousel message, if we still had a carousel!"
- Don't worry about adding translations in other languages, strings will change so often during development that any translation work you do will inevitably be lost.

### Notes

- Every static/constant string on the page must be translate-friendly.
- For strings with interpolated variables (i.e. "This house is {{ red }} but my house is {{ blue }}"), instead of defining several key, value pairs: the library supports interpolating values into the translated string. See below.

### Example

- This is an example of a button code before translation: 

`<a [routerLink]="['create']" class="waves-effect waves-light btn cyan" role="button">`

      `<i class="material-icons left">add</i>`

      `Add Disaster`

`</a>`

- This is an example of a button code after translation:

`<a [routerLink]="['create']" class="waves-effect waves-light btn cyan" role="button">`

      `<i class="material-icons left">add</i>`

      `{{ 'DashboardDisasterBaseComponent-ADD_BUTTON' | translate}}`

`</a>`

en.json: 

`{`

     `"DashboardDisasterBaseComponent-ADD_BUTTON" : "Add disaster"`

`}`

- Add a key/value comment for every new component : 

`{`

     `"---------------- THIS IS A COMMENT : Disaster Base Page -------------":"",`


     `"DashboardDisasterBaseComponent-ADD_BUTTON" : "Add disaster",`

`}`

- Labels, buttons, tooltips and any static text should be translated. Dynamic variables like {{message}} are not included.

- For mixed static and dynamic content like ` Welcome {{user.name}} to dashboard </div>`, we should use interpolation like below: 

`{{'ComponentName-WELCOME_MESSAGE' | translate:{ value:user.name }}}`

 In en.json, it looks like this: 

`"ComponentName-WELCOME_MESSAGE" : "Welcome {{value}} to dashboard"`

- If a message contains html tags, like ` <div> View <span class="title"> {{myDisaster.name}} </span> Information </div>`, we don't use interpolation so we just split this into two strings:

`{{'DashboardDisasterViewComponent-VIEW_DISASTER_1_TITLE' | translate}}`

        `<span class="title">{{myDisaster.name}}</span>`

`{{'DashboardDisasterViewComponent-VIEW_DISASTER_2_TITLE' | translate}}`

en.json : 

` "DashboardDisasterViewComponent-VIEW_DISASTER_1_TITLE" : "View ",`

 `"DashboardDisasterViewComponent-VIEW_DISASTER_2_TITLE" : " Information "`

- For messages in ts file, you should : 
  1. Add the translation string into translation file.
  2. Import TranslateService  : 

     `import {TranslatePipe, TranslateService} from "ng2-translate";`

  3. Add it in the constructor : 

     ` private translateService: TranslateService`

   4. Replace the static text with the corresponding translate string : 

      ` this.translateService.instant('UNIVERSAL-CLOSE_WITHOUT_SAVING')`

- Use universal strings for common text like "UNIVERSAL-YES": "Yes" and "UNIVERSAL-NAVIGATION_CANCEL": "Cancel".
- New component strings should be added at the end of the translation file.

### Mistakes to avoid

- en.json file is not commited.
- Duplicated keys in en.json file.
- The translate string does not include the component name.
- Not all static text are being translated => There should be no English text in HTML/ ts files.
- Dynamic content is being translated like {{error | translate}} ==> This is wrong.
- Not using universal translation strings.
- Translation string in HTML and en.json files is not the same.

### Library Documentation

Documentation for our library here: https://github.com/ocombe/ng2-translate

## Updating Translation Files

### How to Propagate New Lines - Initially

After adding a line to the en.json file, you should insert that same line into each
of the non-English translation files (e.g., es.json, fr.json) in the same place as
it appears in en.json. Then do a PR for all the updated translation files.

Note that the above instructions do not suggest performing translations on the
newly inserted non-English translation files. To avoid too much back and forth
with translators, the translations are normally done only when there’s an upcoming
release.

### How to Propagate New Lines - When There's an Upcoming Release

When there’s an upcoming release, you (or another developer) should use the
translation tool at
https://johnsdean.github.io/DAP-utility/compareTranslationFiles.html to perform
clean-up work on the translation files. Here’s what the translation tool does:
* Finds lines in en.json that are not in the other file.
* Finds lines in the other file that are not in the en.json file.
* Finds lines in the other file that have not been translated.
* Formats every line in the other file in order to promote consistency, such as
  surrounding the key-value separator colon with no space at the left and a single
  space at the right.

After using the translation tool, you should ask Ben to find a translator to give
the translation file to. Ask the translator to edit their translation file as
indicated by the "Translators How To" document at
https://github.com/Disaster-Accountability-Project/SR-Front/blob/develop/translatorsHowTo.md.

After the translator updates their translation file, you should make a PR to merge
the updated translation file into the SR-Front develop branch.
