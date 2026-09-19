const fs = require('fs');
const content = fs.readFileSync('src/pages/Prompts.tsx', 'utf-8');
const lines = content.split('\n');

let startIdx = 462;
let endIdx = 2640;

const prefix = lines.slice(0, startIdx).join('\n');
const suffix = lines.slice(endIdx).join('\n');

const mapped = `
                  {prompts.map((prompt) => (
                    <div className="node f734" data-node="4013:3176" data-name="UI / Card with Toolbar" key={prompt.id}>
                      <div className="node f717" data-node="I4013:3176;4013:3108" data-name="header">
                        <div className="node f716" data-node="I4013:3176;4013:3109" data-name="Heading / H4 20px">
                          <div className="node f715" data-node="I4013:3176;4013:3109;84:1714" data-name="H4/20px">
                            <span className="text-content" style={{ top: "0px", width: "calc(100% + 1px)" }}>
                              <span className="f497">{prompt.title}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="node f719" data-node="I4013:3176;4013:3111" data-name="Body / Extra Small 12px">
                        <div className="node f718" data-node="I4013:3176;4013:3111;88:1185" data-name="Body/12px">
                          <span className="text-content" style={{ top: "-5.456px", width: "calc(100% + 1px)", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: "2", overflow: "hidden" }}>
                            <span className="f35">{prompt.body}</span>
                          </span>
                        </div>
                      </div>
                      <div className="node f733" data-node="I4013:3176;4013:3112" data-name="toolbar">
                        <div className="node f722" data-node="I4013:3176;4013:3113" data-name="UI / Category Badge">
                          <div className="node f721" data-node="I4013:3176;4013:3113;4009:3503" data-name="Label Alternative / Extra Small 9.6px">
                            <div className="node f720" data-node="I4013:3176;4013:3113;4009:3503;84:3471" data-name="LABEL-ALT/XS/Semi-Bold/9.6px/12">
                              <span className="text-content" style={{ top: "-2.448px", width: "calc(100% + 1px)" }}>
                                <span className="f191">PROMPT</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="node f732" data-node="I4013:3176;4013:3143" data-name="toolbar-actions">
                          <div className="node f727" data-node="I4013:3176;4013:3144" data-name="Project / Toolbar Action">
                            <Link className="node f119" data-node="I4013:3176;4013:3144;93:8633" data-name="pencil" to={"/prompt-edit?id=" + prompt.id} aria-label="prompt-edit">
                              <img className="icon" src="assets/icons/pencil.svg" alt="" draggable="false" />
                            </Link>
                          </div>
                          <div className="node f731" data-node="I4013:3176;4013:3146" data-name="Project / Toolbar Action">
                            <div className="node f730" data-node="I4013:3176;4013:3146;93:8673" data-name="bin">
                              <img className="icon" src="assets/icons/bin.svg" alt="" draggable="false" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
`;

fs.writeFileSync('src/pages/Prompts.tsx', prefix + '\n' + mapped + '\n' + suffix);
