const flattenText = (node) => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join('');
  
  if (typeof node === 'object') {
    let text = node['#text'] || '';
    Object.keys(node).forEach(key => {
      if (key !== '#text' && key !== ':@') {
        text += ' ' + flattenText(node[key]);
      }
    });
    return text.trim().replace(/\s+/g, ' ');
  }
  return '';
};

const tests = [
  {
    name: "Simple string",
    input: "Hello World",
    expected: "Hello World"
  },
  {
    name: "Mixed content with italics",
    input: {
      "#text": "Effect of",
      "i": "Staphylococcus aureus",
      "": " on human health" // some parsers do this or use other keys
    },
    expected: "Effect of Staphylococcus aureus on human health"
  },
  {
    name: "Array of mixed content",
    input: [
      "Intro ",
      { "i": "Bold part", "#text": " and more text" },
      " final end."
    ],
    expected: "Intro Bold part and more text final end."
  },
  {
    name: "Deeply nested",
    input: {
      "#text": "Level 1",
      "sub": {
        "#text": "Level 2",
        "sup": "Level 3"
      }
    },
    expected: "Level 1 Level 2 Level 3"
  }
];

tests.forEach(t => {
  const result = flattenText(t.input);
  if (result === t.expected) {
    console.log(`✅ PASS: ${t.name}`);
  } else {
    console.error(`❌ FAIL: ${t.name}`);
    console.error(`   Expected: "${t.expected}"`);
    console.error(`   Found:    "${result}"`);
  }
});
