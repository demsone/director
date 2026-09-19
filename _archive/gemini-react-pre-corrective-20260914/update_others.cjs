const fs = require('fs');

const files = [
  'src/pages/DarkroomDetail.tsx',
  'src/pages/DarkroomQuick.tsx',
  'src/pages/ProjectOverview.tsx',
  'src/pages/ProjectFeedback.tsx',
  'src/pages/ProjectSettings.tsx',
  'src/pages/ProjectQuick.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('useApp')) {
    content = content.replace(
      'import { Link } from "react-router-dom";',
      `import { Link } from "react-router-dom";\nimport { useApp } from '../context/AppContext';`
    );
    
    // Also inject `const { records, projects } = useApp();` into the component
    const funcMatch = content.match(/export default function ([A-Za-z0-9_]+)\(\) \{\n  return \(/);
    if (funcMatch) {
      content = content.replace(
        funcMatch[0],
        `export default function ${funcMatch[1]}() {\n  const { records, projects } = useApp();\n  return (`
      );
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
