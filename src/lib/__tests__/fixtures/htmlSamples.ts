export const htmlSamples = {
  simple: `
    <div>
      <p>In addition, frameworks like React and Vue work in content scripts.</p>
    </div>
  `,

  complex: `
    <div>
      <h1>Browser Extension Development</h1>
      <p>This is a browser extension for language learning. It helps users learn new languages while browsing the web.</p>
      <p>In addition, frameworks like React and Vue work in content scripts. This makes development easier.</p>
      <ul>
        <li>React components</li>
        <li>Vue templates</li>
        <li>Content script injection</li>
      </ul>
    </div>
  `,

  multiNode: `
    <div>
      <p>The <strong>same</strong> functionality works across different browsers.</p>
      <p>This is a <em>multi word phrase</em> that spans multiple elements.</p>
    </div>
  `,

  edgeCases: `
    <div>
      <p>I am learning a new language.</p>
      <p>This is a test-case for hyphenated words.</p>
      <p>   Multiple   spaces   between   words   </p>
      <p>Special characters: @#$%^&*()</p>
    </div>
  `,

  nested: `
    <div>
      <article>
        <header>
          <h2>Language Learning</h2>
        </header>
        <section>
          <p>Browser extensions can help with language learning by replacing text on web pages.</p>
          <div class="highlight">
            <p>This approach makes learning more contextual and natural.</p>
          </div>
        </section>
      </article>
    </div>
  `,

  withScripts: `
    <div>
      <p>This content should be processed.</p>
      <script>
        console.log('This should be ignored');
      </script>
      <style>
        .test { color: red; }
      </style>
      <p>This content should also be processed.</p>
    </div>
  `,

  withExistingLexaComponents: `
    <div>
      <p>This is normal text.</p>
      <span class="lexa-root-node" data-original-text="work">funcionan</span>
      <p>This should still be processed.</p>
    </div>
  `,
}

export const problemCases = {
  workInFrameworks: `
    <div>
      <p>In addition, frameworks like React and Vue work in content scripts.</p>
    </div>
  `,

  theSameBug: `
    <div>
      <p>The same functionality works across browsers.</p>
    </div>
  `,

  partialWordMatch: `
    <div>
      <p>The framework works well, but frameworks are better.</p>
    </div>
  `,
}
