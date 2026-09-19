import fs from 'fs';
import path from 'path';

const inputDir = './visual-v4';
const outputDir = './src/pages';
const componentsDir = './src/components';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.html'));

function htmlToTsx(html, componentName) {
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : html;

  // Make sure img tags are closed
  bodyContent = bodyContent.replace(/<img([^>]+?)(?<!\/)>/g, '<img$1 />');
  // Make sure input tags are closed
  bodyContent = bodyContent.replace(/<input([^>]+?)(?<!\/)>/g, '<input$1 />');
  // Close br and hr
  bodyContent = bodyContent.replace(/<br([^>]*?)>/g, '<br$1 />');
  bodyContent = bodyContent.replace(/<hr([^>]*?)>/g, '<hr$1 />');
  
  // Replace class= with className=
  bodyContent = bodyContent.replace(/class=/g, 'className=');
  // Replace for= with htmlFor=
  bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');
  
  // Replace inline styles (rough string based replace)
  // style="top:-5.793px;width:calc(100% + 1px);" -> style={{ top: '-5.793px', width: 'calc(100% + 1px)' }}
  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, styleStr) => {
    const rules = styleStr.split(';').filter(Boolean);
    const obj = rules.map(rule => {
      const [key, ...values] = rule.split(':');
      if (!key || values.length === 0) return '';
      const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      const value = values.join(':').trim().replace(/'/g, '"');
      return `${camelKey}: '${value}'`;
    }).filter(Boolean).join(', ');
    return `style={{ ${obj} }}`;
  });

  // Rename SVG attributes
  const svgAttrs = {
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset'
  };
  for (const [attr, jsxAttr] of Object.entries(svgAttrs)) {
    bodyContent = bodyContent.replace(new RegExp(`${attr}=`, 'g'), `${jsxAttr}=`);
  }

  // Also extract `<link>` tags we might need, or we just rely on global visual.css
  // Wrap in a component
  return `
import React from 'react';
import { Link } from 'react-router-dom';

export default function ${componentName}() {
  return (
    <>
      ${bodyContent}
    </>
  );
}
`;
}

files.forEach(file => {
  const content = fs.readFileSync(path.join(inputDir, file), 'utf-8');
  // Convert filename like 'feedback-new.html' -> 'FeedbackNew'
  const componentName = file
    .replace('.html', '')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
    
  const tsxContent = htmlToTsx(content, componentName);
  
  // Convert `<a href="feedback-new.html">` to `<Link to="/feedback-new">`
  let finalContent = tsxContent.replace(/<a([^>]+)href="([^"]+)\.html"([^>]*)>/g, '<Link$1to="/$2"$3>');
  finalContent = finalContent.replace(/<\/a>/g, '</Link>');
  
  fs.writeFileSync(path.join(outputDir, `${componentName}.tsx`), finalContent);
  console.log(`Created ${componentName}.tsx`);
});
