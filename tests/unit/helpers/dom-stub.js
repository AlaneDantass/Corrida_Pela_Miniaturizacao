/**
 * Minimal DOM stub for unit-testing UI helpers under `node --test` (no jsdom).
 *
 * Mirrors the manual `localStorage` stub already used by the suite: it supports
 * exactly the surface Timeline/HUD touch — getElementById, createElement,
 * classList, style (incl. custom properties), textContent, innerHTML,
 * appendChild, querySelector, and `disabled`.
 */

class FakeClassList {
  constructor() {
    this._set = new Set();
  }

  add(...classes) {
    for (const cls of classes) this._set.add(cls);
  }

  remove(...classes) {
    for (const cls of classes) this._set.delete(cls);
  }

  contains(cls) {
    return this._set.has(cls);
  }

  toggle(cls, force) {
    const shouldAdd = force === undefined ? !this._set.has(cls) : force;
    if (shouldAdd) this._set.add(cls);
    else this._set.delete(cls);
    return shouldAdd;
  }

  get value() {
    return [...this._set].join(' ');
  }
}

class FakeStyle {
  constructor() {
    this._props = {};
  }

  setProperty(name, value) {
    this._props[name] = String(value);
  }

  getPropertyValue(name) {
    return this._props[name] ?? '';
  }
}

class FakeElement {
  constructor(tagName, doc) {
    this.tagName = String(tagName).toUpperCase();
    this._doc = doc;
    this._id = '';
    this.className = '';
    this.children = [];
    this.parent = null;
    this.classList = new FakeClassList();
    this.style = new FakeStyle();
    this._text = '';
    this._html = '';
    this.disabled = false;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    if (this._doc) this._doc._register(this);
  }

  get textContent() {
    return this._text;
  }

  set textContent(value) {
    this._text = String(value);
  }

  get innerHTML() {
    return this._html;
  }

  set innerHTML(value) {
    this._html = String(value);
    if (value === '') this.children = [];
  }

  appendChild(child) {
    this.children.push(child);
    child.parent = this;
    if (this._doc) this._doc._registerTree(child);
    return child;
  }

  // No-op event wiring: UI helpers attach click handlers at build time; unit
  // tests drive behavior by calling methods directly, not by dispatching events.
  addEventListener() {}

  removeAttribute() {}

  setAttribute() {}

  // Supports only the selectors HUD actually uses: `span:first-child` (buy
  // button label) and `.class` descendant lookups (`.buy-subtext`).
  querySelector(selector) {
    if (selector === 'span:first-child') {
      return this.children.find((child) => child.tagName === 'SPAN') || null;
    }
    if (typeof selector === 'string' && selector.startsWith('.')) {
      const cls = selector.slice(1);
      const search = (el) => {
        for (const child of el.children) {
          if (child.classList.contains(cls)) return child;
          const nested = search(child);
          if (nested) return nested;
        }
        return null;
      };
      return search(this);
    }
    return null;
  }

  querySelectorAll() {
    return [];
  }
}

/**
 * Builds an isolated fake document plus a helper to register pre-made elements.
 * @returns {{document: object, makeElement: (tag: string, id?: string) => FakeElement, registry: Map<string, FakeElement>}}
 */
export function createDomStub() {
  const registry = new Map();

  const document = {
    _registry: registry,
    _register(el) {
      if (el._id) registry.set(el._id, el);
    },
    _registerTree(el) {
      if (el._id) registry.set(el._id, el);
      for (const child of el.children || []) this._registerTree(child);
    },
    createElement(tag) {
      return new FakeElement(tag, document);
    },
    getElementById(id) {
      return registry.get(id) || null;
    }
  };

  function makeElement(tag, id) {
    const el = new FakeElement(tag, document);
    if (id) el.id = id;
    return el;
  }

  return { document, makeElement, registry };
}

export { FakeElement };
