#!/usr/bin/env node
/**
 * Converts appian-functions-complete.json from VS Code snippet format
 * to a clean, LLM-optimized reference format
 */

const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../referenceMaterial/appian-functions-complete.json');
const outputFile = path.join(__dirname, '../unpacked-extension/extension/appian-functions-reference.json');

console.log('Reading input file...');
const snippets = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

const functions = [];
const categories = {
  arrays: [],
  text: [],
  dates: [],
  logic: [],
  ui: [],
  data: [],
  math: [],
  other: []
};

function extractFunctionInfo(key, snippet) {
  // Extract function name from key (e.g., "Appian append()" -> "append")
  const match = key.match(/Appian\s+([a-z!A-Z][a-zA-Z0-9!_]*)\s*\(/);
  if (!match) return null;

  const functionName = match[1];

  // Extract parameters from body
  const bodyLines = snippet.body || [];
  const params = [];

  for (const line of bodyLines) {
    // Match pattern: "  paramName: ${1:paramName (Type)}"
    const paramMatch = line.match(/^\s*([a-zA-Z0-9_]+):\s*\$\{[^:]+:([^}]+)\}/);
    if (paramMatch) {
      const paramName = paramMatch[1];
      const paramInfo = paramMatch[2].trim(); // e.g., "array (Any Type Array)"
      params.push({ name: paramName, info: paramInfo });
    }
  }

  // Extract description
  let description = snippet.description || '';
  // Clean up redundant parts
  description = description
    .replace(/^[^:]+:\s*/, '') // Remove "functionName(): " prefix
    .replace(/\[Deprecated\]/i, '(Deprecated)')
    .replace(/Replaced by\s*/i, 'Use ')
    .trim();

  // Categorize function
  let category = 'other';
  const lowerName = functionName.toLowerCase();

  if (lowerName.includes('array') || ['append', 'insert', 'remove', 'reverse', 'index', 'length', 'where', 'flatten', 'ldrop', 'rdrop', 'joinarray'].includes(lowerName)) {
    category = 'arrays';
  } else if (lowerName.includes('text') || ['concat', 'upper', 'lower', 'trim', 'split', 'search', 'substitute'].includes(lowerName)) {
    category = 'text';
  } else if (lowerName.includes('date') || lowerName.includes('time') || ['now', 'today', 'year', 'month', 'day'].includes(lowerName)) {
    category = 'dates';
  } else if (['if', 'and', 'or', 'not', 'null', 'isnull', 'isempty'].some(keyword => lowerName.includes(keyword))) {
    category = 'logic';
  } else if (lowerName.startsWith('a!') && (lowerName.includes('field') || lowerName.includes('layout') || lowerName.includes('component') || lowerName.includes('section') || lowerName.includes('column'))) {
    category = 'ui';
  } else if (lowerName.includes('query') || lowerName.includes('record') || lowerName.includes('data')) {
    category = 'data';
  } else if (['sum', 'average', 'min', 'max', 'round', 'abs', 'power', 'sqrt'].includes(lowerName)) {
    category = 'math';
  }

  // Build clean signature
  let signature;
  if (params.length === 0) {
    signature = `${functionName}()`;
  } else {
    const paramStr = params.map(p => `${p.name}: ${p.info}`).join(', ');
    signature = `${functionName}(${paramStr})`;
  }

  return {
    name: functionName,
    signature,
    category,
    description: description || functionName,
    searchTerms: [
      functionName.toLowerCase(),
      ...params.map(p => p.name.toLowerCase())
    ]
  };
}

console.log('Converting functions...');
let converted = 0;
let skipped = 0;

for (const [key, snippet] of Object.entries(snippets)) {
  const funcInfo = extractFunctionInfo(key, snippet);
  if (funcInfo) {
    functions.push(funcInfo);
    categories[funcInfo.category].push(funcInfo);
    converted++;
  } else {
    skipped++;
  }
}

console.log(`Converted: ${converted}, Skipped: ${skipped}`);

// Write output
const output = {
  metadata: {
    version: '1.0.0',
    source: 'appian-functions-complete.json',
    convertedAt: new Date().toISOString(),
    totalFunctions: functions.length
  },
  functions,
  categories
};

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
console.log(`✓ Written optimized reference to: ${outputFile}`);

// Also create a markdown version for easy reading
const mdFile = path.join(__dirname, '../unpacked-extension/extension/appian-functions-reference.md');
let md = '# Appian Expression Language Functions Reference\n\n';
md += `Total functions: ${functions.length}\n\n`;

for (const [catName, catFuncs] of Object.entries(categories)) {
  if (catFuncs.length > 0) {
    md += `## ${catName.charAt(0).toUpperCase() + catName.slice(1)} (${catFuncs.length})\n\n`;
    for (const func of catFuncs) {
      md += `- **${func.signature}**`;
      if (func.description && func.description !== func.name) {
        md += ` - ${func.description}`;
      }
      md += '\n';
    }
    md += '\n';
  }
}

fs.writeFileSync(mdFile, md, 'utf8');
console.log(`✓ Written markdown reference to: ${mdFile}`);
