import * as Handlebars from "handlebars";

const template = Handlebars.compile(`<html>
<head></head>
<body>
  <div class="reveal">
    <div class="slides">
      <section data-markdown>
        <textarea data-template>
        {{{markdown}}}
        </textarea>
      </section>
    </div>
  </div>
  {{{script}}}
</body>
</html>`);

export function buildRevealTemplate({ script, markdown }) {
  return template({ script, markdown });
}
