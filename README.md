# quarto-web-clipper

This is a bookmarklet based on [the one web clipper for Obsidian](https://stephango.com/obsidian-web-clipper). It saves articles and pages from the web as Quarto-flavored Markdown files. Credit goes to [Steph Ango](https://stephango.com/), the CEO of Obsidian and the original creator of Obsidian Web Clipper. 

I've similarly used the using [Bookmarklet Maker](https://caiorss.github.io/bookmarklet-maker/) to minify and URI encode the bookmarklet and include it in this repository.

## Installation

Simply copy the code in the minified JS code linked below as a new bookmark in your browser. You can do this by going into your bookmark manager and adding a new page. It should allow you to paste the code into the URL field.

[quarto-web-clipper.min.js](quarto-web-clipper.min.js)

Then click the bookmark to clip a page of interest. This will clip the page as a Qmd file in your current Downloads folder and try to insert metadata about the article.

Alternatively, you can directly run the [quarto-web-clipper.js](quarto-web-clipper.js) code in your browser console to clip the page as a Quarto document.

## Troubleshooting

Ensure that you have Automatic Downloads set to “On” in your browser settings for the webpage of interest. 

Similar to the Obsidian Web Clipper, this bookmarklet will not work on all websites. Also, you can troubleshoot issues by opening the Developer Console in your browser and checking if any errors appear when you click the bookmarklet. The most common error is that a website or the browser itself is blocking third party code execution.

Note that the clip may not be perfect and may require some manual editing to fix formatting issues.