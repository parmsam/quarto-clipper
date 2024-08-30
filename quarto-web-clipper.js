(function () {
    javascript: Promise.all([
        import('https://unpkg.com/turndown@6.0.0?module'),
        import('https://unpkg.com/@tehshrike/readability@0.2.0'),
    ]).then(async ([{
        default: Turndown
    }, {
        default: Readability
    }]) => {

        // optional full folder path to downloads folder
        // const downloadsFolder = "/Users/USERNAME/Downloads/";
        let tags = ["clippings"];

        /* Parse the site's meta keywords content into tags, if present */
        if (document.querySelector('meta[name="keywords" i]')) {
            var keywords = document.querySelector('meta[name="keywords" i]').getAttribute('content').split(',');

            keywords.forEach(function (keyword) {
                let tag = ' ' + keyword.split(' ').join('');
                tags += tag;
            });
        }

        function getSelectionHtml() {
            var html = "";
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            } else if (typeof document.selection != "undefined") {
                if (document.selection.type == "Text") {
                    html = document.selection.createRange().htmlText;
                }
            }
            return html;
        }

        const selection = getSelectionHtml();

        const {
            title,
            byline,
            content
        } = new Readability(document.cloneNode(true)).parse();

        function getFileName(fileName) {
            fileName = title.replace(/[:\/\\?%*|"<>]/g, '-');
            return fileName;
        }
        const fileName = getFileName(title);

        var markdownify = selection ? selection : content;

        const markdownBody = new Turndown({
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
        }).turndown(markdownify);

        var date = new Date();

        function convertDate(date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            var mmChars = mm.split('');
            var ddChars = dd.split('');
            return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
        }

        const today = convertDate(date);

        /* Utility function to get meta content by name or property */
        function getMetaContent(attr, value) {
            var element = document.querySelector(`meta[${attr}='${value}']`);
            return element ? element.getAttribute("content").trim() : "";
        }

        /* Fetch byline, meta author, property author, or site name */
        var author = byline || getMetaContent("name", "author") || getMetaContent("property", "author") || getMetaContent("property", "og:site_name");

        /* Check if there's an author and add brackets */
        var authorBrackets = author ? `[[${author}]]` : "";

        /* Try to get published date */
        var timeElement = document.querySelector("time");
        var publishedDate = timeElement ? timeElement.getAttribute("datetime") : "";

        if (publishedDate && publishedDate.trim() !== "") {
            var date = new Date(publishedDate);
            var year = date.getFullYear();
            var month = date.getMonth() + 1; // Months are 0-based in JavaScript
            var day = date.getDate();

            // Pad month and day with leading zeros if necessary
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;

            var published = year + '-' + month + '-' + day;
        } else {
            var published = ''
        }

        /* YAML front matter as tags render cleaner with special chars */
        const fileContent =
`---
title: "${title}"
author: "${author || 'Unknown Author'}"
date: "${today}"
params: 
    published_date: ${published ? `"${published}"` : ""}
keywords: [${tags.map(tag => `"${tag}"`).join(', ')}]
source: "${document.URL}"
format: html
---

${markdownBody}`;

        const blob = new Blob([fileContent], { type: 'text/plain' });
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `${fileName}.qmd`;
        document.body.appendChild(link);
        link.click();
        console.log(`Downloaded ${link.download}`);
        document.body.removeChild(link);
        // console.log(`Atttempting to point VSCode to ${downloadsFolder}${fileName}.qmd`);
        // const vscode_href = `vscode://file/${downloadsFolder}${fileName}.qmd`;
        // document.location.href = vscode_href;
    })
})();
