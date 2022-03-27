import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import Highlight from "reveal.js/plugin/highlight/highlight.js";
import 'highlight.js/styles/monokai.css';
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import mermaid from 'mermaid';

mermaid.initialize({
  theme: 'dark',
  startOnLoad: false
});

async function asyncMermaidRender(event) {
    var graphs = document.getElementsByClassName("mermaid");
    graphs.forEach((item, index) => {
        let graphCode = item.innerText.trim(); //trim() becase of gantt, class and git diagram
        let mermaidDiv = document.createElement('div');
        mermaidDiv.classList.add('mermaid');
        mermaidDiv.setAttribute("data-processed", "true");

        try {
            // item.innerText ignores html elements added by revealjs highlight plugin.
            mermaid.mermaidAPI.render('theGraph' + index, graphCode, function(svgCode) {
                mermaidDiv.innerHTML = svgCode;
            });

            let parentDiv = document.createElement('div');
            parentDiv.appendChild(mermaidDiv);
            item.parentNode.parentNode.insertBefore(parentDiv, item.parentNode);
            item.parentNode.remove();
        }
        catch(err) {
            console.log("Cannot render mermaid diagram " + index + "\n" + graphCode);
            console.log(err.message);
        }
    })
}


let deck = new Reveal({
  plugins: [Markdown, Highlight],
});

deck.addEventListener('ready', event => asyncMermaidRender(event));

deck.initialize();
