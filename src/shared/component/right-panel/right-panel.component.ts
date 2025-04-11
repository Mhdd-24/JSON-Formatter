import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-right-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.css'
})
export class RightPanelComponent {
  public jsonInput = signal<string>('');
  public formattedOutput = signal<string>(
    '<span class="placeholder">Formatted JSON Will Automatically Display Here</span>'
  );
  public currentView = signal<string>('formatted');
  public currentJSON = signal<any>(null);

  private elementRef = inject(ElementRef);

  public formatJSON = () => {
    const input = this.jsonInput().trim();
    if (!input) {
      this.formattedOutput.set(
        '<span class="placeholder">Formatted JSON Will Automatically Display Here</span>'
      );
      this.currentJSON.set(null);
      return;
    }
    try {
      let jsonObj;
      try {
        jsonObj = JSON.parse(input);
      } catch (e) {
        let cleanInput = input.replace(/^["']|["']$/g, '');
        cleanInput = cleanInput.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        try {
          jsonObj = JSON.parse(cleanInput);
        } catch (e2) {
          cleanInput = input
            .replace(/^\{\\/, '{')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
          jsonObj = JSON.parse(cleanInput);
        }
      }

      this.currentJSON = jsonObj;
      this.displayJSON();
    } catch (error: any) {
      this.formattedOutput.set(
        `<span style="color: red;">SyntaxError: ${error.message}</span>`
      );
    }
  };

  public displayJSON = () => {
    if (!this.currentJSON()) return;
    switch (this.currentView()) {
      case 'formatted':
        this.formattedOutput.set(
          this.syntaxHighlight(JSON.stringify(this.currentJSON(), null, 4))
        );
        break;
      case 'tree':
        this.formattedOutput.set(this.createTreeView(this.currentJSON()));
        break;
      case 'compact':
        this.formattedOutput.set(
          this.syntaxHighlight(JSON.stringify(this.currentJSON()))
        );
        break;
    }
  };

  createTreeView(json: any): string {
    if (typeof json !== 'object' || json === null) {
      return this.formatPrimitive(json);
    }

    const isArray = Array.isArray(json);
    let html = '<div class="json-tree">';

    Object.keys(json).forEach((key) => {
      const value = json[key];
      const isComplex = typeof value === 'object' && value !== null;

      html += '<div class="json-tree-item">';

      // Add expand/collapse arrow for objects and arrays
      if (isComplex) {
        html += '<span class="tree-toggle">▼</span> ';
      } else {
        html += '<span class="tree-spacer"></span> ';
      }

      // Key with colon (purple for keys)
      html += `<span class="json-key">${isArray ? '' : key}</span>`;
      if (!isArray) html += '<span class="json-colon">: </span>';

      // Value
      if (isComplex) {
        const childContent = this.createTreeView(value);
        html += `<div class="json-children">${childContent}</div>`;
      } else {
        html += this.formatPrimitive(value);
      }

      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  formatPrimitive(value: any): string {
    if (value === null) return '<span class="json-null">null</span>';
    if (typeof value === 'string')
      return `<span class="json-string">"${this.escapeHTML(value)}"</span>`;
    if (typeof value === 'number')
      return `<span class="json-number">${value}</span>`;
    if (typeof value === 'boolean')
      return `<span class="json-boolean">${value}</span>`;
    return `<span>${this.escapeHTML(String(value))}</span>`;
  }

  syntaxHighlight(json: string): string {
    // Simple syntax highlighting for JSON
    json = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      }
    );
  }

  escapeHTML(html: string): string {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  clear() {
    this.jsonInput.set('');
    this.formattedOutput.set(
      '<span class="placeholder">Formatted JSON Will Automatically Display Here</span>'
    );
    this.currentJSON.set(null);
  }

  async paste() {
    try {
      const text = await navigator.clipboard.readText();
      this.jsonInput.set(text);
      this.formatJSON();
    } catch (err) {
      alert('Failed to read clipboard contents. Please paste manually.');
    }
  }

  async copy() {
    if (!this.currentJSON()) return;

    try {
      let textToCopy;
      switch (this.currentView()) {
        case 'formatted':
          textToCopy = JSON.stringify(this.currentJSON(), null, 4);
          break;
        case 'compact':
          textToCopy = JSON.stringify(this.currentJSON());
          break;
        default:
          textToCopy = JSON.stringify(this.currentJSON());
      }

      await navigator.clipboard.writeText(textToCopy);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy text.');
    }
  }

  setView(view: string) {
    this.currentView.set(view);
    this.displayJSON();
  }

  ngAfterViewInit() {
    // Add event listener for tree toggle functionality
    this.elementRef.nativeElement.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('tree-toggle')) {
        const treeItem = target.closest('.json-tree-item') as HTMLElement;
        if (treeItem) {
          const children = treeItem.querySelector(
            '.json-children'
          ) as HTMLElement;
          if (children) {
            if (children.style.display === 'none') {
              children.style.display = 'block';
              target.textContent = '▼';
            } else {
              children.style.display = 'none';
              target.textContent = '►';
            }
          }
        }
      }
    });
  }
}
