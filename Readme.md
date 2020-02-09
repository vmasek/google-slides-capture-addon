<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()

> Automatically export Google Slides as Images

This chrome plugin provides you a way to automatically export your slide deck as a images.
It will name the images based on the provided metadata placed in the slide.

The meta-data enables you to control the naming of the exported images based on a nested hierarchical order. 
This enables you to create meaningful image names that are grouped by post fixes. 

## Features

- ✅ Export any Slide deck to images
- ✅ Human readable image names
- ✅ Introduce name groups over meta-data

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [FAQ](#faq)

## Installation

### Chrome Browser

If you don't have chrome chrome installed follow the installation guide on their website https://www.google.de/chrome/

### Chrome Web Store Plugin

1. Open [Chrome Web Store](https://chrome.google.com/webstore/search/[PLUGIN_NAME]).
2 .Click on the plugin [](https://chrome.google.com/webstore/detail/[PLUGIN_NAME]/[HASH]).
3. Click the "Add Plugin" button.

The plugin should install to your chrome browser.

After the installation you can find the plugin under @TODO

## Usage

To export your slides to png you have to:
  
1. Open your slides deck
2. Insert a text field 
 @TODO IMAGE HERE
3. Place it outside of the viewport of the slide
 @TODO IMAGE HERE
4. Insert the meta-data as [valid JSON data](#How-can-I-ensure-proper-formatting-the-meta-data?).
5. @TODO

### Usage of Meta Data  

The interface of the metadata looks like that:
```typescritp
interface MetaData{

}
```



## FAQ

### How can I ensure proper formatting the meta-data?
The formatting standard of the meta-data is [JSON](https://en.wikipedia.org/wiki/JSON).
You can verify it for example over online services.

One example could be [jsonformatter](https://jsonformatter.curiousconcept.com/). 
Open it, paste your metadata in, tick the 'Fix JSON' check box and hit the process button.

You should get a proper formatted JSON object as result.
This can be used in any meta-data text-box.


### What should I do if I get a 'Wrong Format' error?

@TODO

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
