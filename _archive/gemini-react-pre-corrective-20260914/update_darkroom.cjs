const fs = require('fs');

function updateFile(file, isDarkroom) {
  let content = fs.readFileSync(file, 'utf8');

  // Add import
  if (!content.includes('useApp')) {
    content = content.replace(
      'import { Link } from "react-router-dom";',
      `import { Link } from "react-router-dom";\nimport { useApp } from '../context/AppContext';`
    );
  }

  // Add hook
  if (isDarkroom) {
    if (!content.includes('const { records }')) {
      content = content.replace(
        'export default function Darkroom() {\n  return (',
        `export default function Darkroom() {\n  const { records } = useApp();\n  const items = records.filter(r => r.type === 'feedback');\n  return (`
      );
    }
  } else {
    if (!content.includes('const { projects }')) {
      content = content.replace(
        'export default function Projects() {\n  return (',
        `export default function Projects() {\n  const { projects } = useApp();\n  const items = projects;\n  return (`
      );
    }
  }

  // Find list container
  const listMatch = isDarkroom ? 'data-name="feedback-list"' : 'data-name="project-grid"';
  const listIndex = content.indexOf(listMatch);
  if (listIndex === -1) return;

  const startContainer = content.indexOf('>', listIndex) + 1;
  const endContainerStr = isDarkroom ? 
    '              </div>\n            </div>\n          </div>\n        </div>\n      </main>\n    </>\n  );\n}' :
    '              </div>\n            </div>\n          </div>\n        </div>\n      </main>\n    </>\n  );\n}';
    
  const endContainer = content.lastIndexOf(endContainerStr);

  const innerContent = content.substring(startContainer, endContainer);
  
  // Get the first item (Link)
  const firstLinkStart = innerContent.indexOf('<Link');
  let openTags = 0;
  let firstLinkEnd = -1;
  for (let i = firstLinkStart; i < innerContent.length; i++) {
    if (innerContent.substring(i, i + 5) === '<Link') openTags++;
    else if (innerContent.substring(i, i + 7) === '</Link>') {
      openTags--;
      if (openTags === 0) {
        firstLinkEnd = i + 7;
        break;
      }
    }
  }

  if (firstLinkStart !== -1 && firstLinkEnd !== -1) {
    let template = innerContent.substring(firstLinkStart, firstLinkEnd);
    
    // Modify template for dynamic data
    if (isDarkroom) {
      template = template.replace(/to="\/[^"]+"/, 'to={`/darkroom-detail`}'); // Or `/darkroom-detail/${item.id}` if we had routing
      template = template.replace(/<span className="f387">[\s\S]*?<\/span>/, '<span className="f387">{item.title}</span>');
      template = template.replace(/<span className="f399">[\s\S]*?<\/span>/, '<span className="f399">{item.date}</span>');
    } else {
      template = template.replace(/to="\/[^"]+"/, 'to={`/project-overview`}');
      template = template.replace(/<span className="f497">[\s\S]*?<\/span>/, '<span className="f497">{item.title}</span>');
      // maybe description
      template = template.replace(/<span className="f35">[\s\S]*?<\/span>/, '<span className="f35">{item.description}</span>');
    }

    const mapped = `\n                {items.map((item, index) => (\n${template.replace('<Link', '<Link key={item.id || index}')}\n                ))}\n`;
    
    content = content.substring(0, startContainer) + mapped + content.substring(endContainer);
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}

updateFile('src/pages/Darkroom.tsx', true);
updateFile('src/pages/Projects.tsx', false);

