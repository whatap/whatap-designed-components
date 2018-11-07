![WhaTap Logo](whatap-logo.png)

# whatap-designed-components

whatap-designed-components consists set of utilities and components used commonly in WhaTap's monitoring products.

## Table of Contents
[1. Basics](##Basics)

[2. Palette](##Palette)

[3. ColorPicker](##ColorPicker)

[4. React Components](##Components)

[5. Core](##Core)

[#. About Developing](##Developing)

[#. Tests](##Tests)

## Basics
### Installation
`npm install whatap-designed-components`

## Palette
![Color Palette](color-palette.png)

Palette takes an ID and converts it into a RGB value (Vice versa).
* `getColorFromOid(value, toString)`: takes an OID value and returns the respective color from the list. If the OID is not assigned to a color, stores it to the list. returns in Array [R, G, B] if `toString` is set to `false`.
* `getOidFromColor(rgb)`: takes a RGB value array or string and returns an OID value stored. If the OID doesn't exist, returns 0.

### Basic Philosophy
Developers at WhaTap always had concerns with colors when trying to create series charts. One of the main reasons was that colors within charts kept switching when changing pages as our users moved from one page to another. Another was when our users drew more than 20 lines, repetition in color palette lowered our user experience. However, increasing the number of colors wasn't the solution to our problem as increasing the color count made our charts disorienting.

That is why we've created this color palette. Colors are created based on 19 colors provided on our palette (you can customize this too). After all the colors inside the palette has been used at least once, It will find the color with the lowest duplication, and create a child color node with the slightly different rgb color (in this case, find the lowest one within RGB value, and adds 10).

Colors are stored in Array - LinkedList form, so after assigning a color to an OID, user can retrieve that OID based on the designated RGB value.

We went on and solved another issue by storing the data inside localStorage. By providing the same ID (in our case it was the project code), users can maintain their color data even when switching page from one place to another.

### Basic Usage
```javascript
import { Palette } from 'whatap-designed-components';

const palette = new Palette(12345, true);

let firstRgb = palette.getColorFromOid(123); // retrieves the first palette color, in the default case, it is "rgb(50,154,240)"
let secondRgb = palette.getColorFromOid(456); // retrieves the second palette color

let firstValueOid = palette.getOidFromColor(firstRgb); // retrieves `123`
let secondValueOid = palette.getOidFromColor(secondRgb); // retrives `456`
```

## ColorPicker
ColorPicker takes Number / String value and converts it into a RGB value.
* `fromInteger(value, typeString, alpha)`: takes a number value, converts it into a RGB value. By providing an alpha value, you can retrieve a RGBA value.
* `fromString(value, typeString, hash)`: takes a string value, converts it into a RGB value. Default hashing function is included, but you may provide your own hash function. Hash function must return a number value.
* `getStoreColor()`: returns the current color stored.
* `setStoreColor(value)`: takes a string value, converts it into a RGB value
### Basic Usage
```javascript
import { ColorPicker } from 'whatap-designed-components';

const cp = new ColorPicker();
cp.fromInteger(12345, true) // returns rgb value
cp.fromInteger(12345, true, 0.5) // returns rgba value
cp.fromString("hello,world!", true); // returns rgb value 
cp.getStoreColor(); // returns the stored color
cp.setStoreColor("#FFFFFF"); // sets the store color
```

## Components

## Core

## Developing

## Tests