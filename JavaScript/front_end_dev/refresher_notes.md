# Front End Dev Refresher Notes

## HTML

- &lt;strong> is the new bolding tag convention, previously (&lt;b>)
- &lt;em> is the new italics tag convention (emphasis), previously (&lt;i>)
- Lists, both ordered and unordered can be nested inside each other.
- alt &lt;img> attribute can also take an alternative link, not just text.
- &lt;inputs>, either text, buttons, radio, textareas should go inside forms &lt;form>
- Drop down menu: Use the &lt;select> tag and its values use the &lt;option> tag
- Data collected from the above components is sent to the back in the url upon clicking a submit
   in form of name=value pairs i.e what is on an element's "name" attribute and "value" attirbute.
   Using these we dipslay different values on the front end and have it represented differently on the back-end for analysis for example.
- Lorem.... test latin test text, can be auto filled by tying lo.. then tab

## CSS

- Selector * for selecting all elements on a page does not override ids (#).
- You can concatenate selections for elements that are next to each other via + e.g:
  h3 + ul { color: blue;} would turn all uls immediately after a h3 to blue. (Adjascent siblings)
- Sentence selector e.g. li a { color:red; }
- Selecting elements with certain attributes e.g li a[href="www.something.com"] { color:red; }
- Pseudo classes e.g :hover are used to styke elements based on their states.
- Specificity: Hierarchy of CSS styles: i.d, *, class, tag. READ MORE!
- FONTS:

  - Achieved via the 'font-family property.
  - Not all fonts are available on all OSs, better to include in your website via a CDN.
  - Font sizes should not be set in px for individual elements. The solution is to use 'em' values,
    are a dynamic font metric. It equal to the font size of the element's parent, if the base font
    size has not been set anywhere.
    - Best practice is to set a base font size in the body in px, then use em for all other elements.
  - The browser default font size is 16px which is equal to 1em.

- <https://www.cssfontstack.com/> will show what fonts are on what OS.
- Download fonts from:

  - Google fonts
  - Font library

- COLORS:

  Choosing color palette: coolors.com

## Bootstrap

- A front-end framework. A framework:
  - Defines the rules to be followed when manupilating the code
  - Has defualt non-modifiable behaviour
  - Is extensible
  - Uses set classes to implement functionality by making calls to those classes in HTML.
  - You can add you own classes for further customization.
- Get bootstrap.com (For ideas on implementing different elements including grids (row & col))

## JavaScript

- For ... of ... Loop e.g `For (letter of array) {}`
- forEach() ideal for passing elements of an array to a function.
- Arrays (lists) & Objects (dicttionaries), check MDN for documentation.
- Demo code:

      function AddAwesome (item) {
        console.log(item + " is awesome!");
      }

      var items = ["python", "django", "science"]

      items.forEach(AddAwesome);

  Result:
  python is awesome!
  django is awesome!
  science is awesome!

- objects are JavaScript key value-pair data unordered structures:

    `var carInfo = {make:Toyota, year:1990, model:"Camry"}`

- Access items: `carInfo["make"]`

- View large object in browser: `console.dir(objectName)`
- Looping in objects: `for (key in carInfo) { // Do stuff }`
- Object methods:

      var myObj = {
        property:"Hello",
        myObjMethod: function () {
          console.log(this.property);
        }
      }

      Object property read: `myObj.property; > "Hello"`
      Object method call: `myObj.myObjMethod(); > "Hello"`

## DOM

- DOM is a representation of all website elements as JS objects in Hierarchical order, from the root element (document).
- To see a site's DOM as HTML, type 'document' in the console, for the actual objects, type console.dir(document)
- You can retrieve a bunch of document attributes e.g document.URL, document.body etc. In console, typing document. brings up a pop-up with a list of these attributes and methods.

## JQuery

- Is a JavaScript library (large .js file) having pre-built methods and object for simplifying DOM interactions and making HTTP request (AJAX), before the intro of querySelector() & querySelectorAll()
- It uses the $ to replace most of vanilla JS code e.g:

  Vanilla JS: `var divs = document.querySelectorAll('div');`
  jQuery: `var divs = $('div');`

  Vanilla JS: `element.style.borderWidth = '20px';`
  jQuery: `$(element).css('borderWidth', '20px');`

  Vanilla JS:

      function ready (fn) {
        if (document.readyState != 'loading) {
          fn();

        } else {
          document.addEventListener('DOMContent'. fn);
        }
      }

  jQuery:

      $(document).ready(function () {
        if (document.readyState != 'loading) {
          fn();

        } else {
          document.addEventListener('DOMContent'. fn);
        }
      });

_Link to get jQuery script link: code.jquery.com_
_Interacting with the DOM using jQuery examples: Part1_ _Basic_ _jQuery.js_
