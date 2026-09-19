import React from "react";
import { Link } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function Prompts() {
  const { prompts } = useApp();
  return (
    <>
      <main
        className="source-frame"
        aria-label="Prompts / Library"
        style={{ width: "1512px", height: "1086.714px" }}
      >
        <div
          className="node f776"
          data-node="2001:3499"
          data-name="Prompts / All"
        >
          <div className="node f692" data-node="2001:3500" data-name="sidebar">
            <div
              className="node f379"
              data-node="2001:3501"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f375"
                data-node="I2001:3501;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f374"
                  data-node="I2001:3501;14:679;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f373"
                    data-node="I2001:3501;14:679;84:3230;84:2890"
                    data-name="Heading/H5/Regular/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f4">Director</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f7"
                data-node="I2001:3501;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I2001:3501;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I2001:3501;14:682;84:3230;84:2890"
                    data-name="Heading/H5/Regular/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f4">Design Studio</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f10"
                data-node="I2001:3501;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I2001:3501;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I2001:3501;14:684;84:3230;84:2890"
                    data-name="Heading/H5/Regular/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f4">Darkroom</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f13"
                data-node="I2001:3501;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I2001:3501;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I2001:3501;8025:3809;84:3230;84:2890"
                    data-name="Heading/H5/Regular/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f4">Compare</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f15"
                data-node="I2001:3501;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f2"
                  data-node="I2001:3501;14:686;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I2001:3501;14:686;84:3230;84:2890"
                    data-name="Heading/H5/Regular/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f4">Projects</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f691"
                data-node="I2001:3501;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f690"
                  data-node="I2001:3501;14:688;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f689"
                    data-node="I2001:3501;14:688;84:3330;84:2888"
                    data-name="Heading/H5/Bold/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f0">Prompts</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f19"
                data-node="I2001:3501;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I2001:3501;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I2001:3501;14:697;84:3230;84:2890"
                    data-name="Heading/H5/Regular/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f4">Settings</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="node f775" data-node="2001:3502" data-name="main">
            <div className="node f381" data-node="2001:3503" data-name="topbar">
              <div
                className="node f27"
                data-node="I2001:3503;4010:4232"
                data-name="UI / Model Bar"
              >
                <div
                  className="node f23"
                  data-node="I2001:3503;4010:4232;73:1125"
                  data-name="UI / Status Badge"
                >
                  <div
                    className="node f22"
                    data-node="I2001:3503;4010:4232;73:1125;65:8533"
                    data-name="status-active"
                  >
                    <img
                      className="icon"
                      src="assets/icons/status-active.svg"
                      alt=""
                      draggable="false"
                    />
                  </div>
                </div>
                <div
                  className="node f26"
                  data-node="I2001:3503;4010:4232;84:3738"
                  data-name="Label Alternative / Small 10px"
                >
                  <div
                    className="node f25"
                    data-node="I2001:3503;4010:4232;84:3738;84:3445"
                    data-name="model-name"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-4.77px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f24">ONLINE · LM STUDIO · GEMMA-4</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="node f703"
              data-node="2001:3504"
              data-name="UI / Header"
            >
              <div
                className="node f698"
                data-node="I2001:3504;93:8702"
                data-name="header-title"
              >
                <div
                  className="node f694"
                  data-node="I2001:3504;93:8703"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f693"
                    data-node="I2001:3504;93:8703;84:3423"
                    data-name="LABEL-ALT/MD/Regular/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f29">DIRECTOR / PROMPTS</span>
                    </span>
                  </div>
                </div>
                <div
                  className="node f697"
                  data-node="I2001:3504;4007:4191"
                  data-name="title-body"
                >
                  <div
                    className="node f696"
                    data-node="I2001:3504;93:8704"
                    data-name="Heading / H2 32px"
                  >
                    <div
                      className="node f695"
                      data-node="I2001:3504;93:8704;84:1662"
                      data-name="Heading/H2 /Semi-Bold/32px/37"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f32">Prompt Library</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f37"
                    data-node="I2001:3504;4007:4161"
                    data-name="Body / Extra Small 12px"
                  >
                    <div
                      className="node f36"
                      data-node="I2001:3504;4007:4161;88:1185"
                      data-name="Body/12px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.456px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f35">
                          Editable defaults for photography, design, comparison,
                          and general feedback.
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="node f702"
                data-node="I2001:3504;4007:4452"
                data-name="project-toolbar"
              >
                <Link
                  className="node f701"
                  data-node="I2001:3504;4007:4132"
                  data-name="UI / Button"
                  to="/prompt-edit"
                  aria-label="prompt-edit"
                >
                  <div
                    className="node f700"
                    data-node="I2001:3504;4007:4132;84:3509"
                    data-name="Label Alternative / Medium 11px"
                  >
                    <div
                      className="node f699"
                      data-node="I2001:3504;4007:4132;84:3509;84:3427"
                      data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f68">ADD PROMPT</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div
              className="node f774"
              data-node="4013:3546"
              data-name="prompt-grid"
            >
              <div
                className="node f714"
                data-node="4013:3535"
                data-name="search-bar"
              >
                <div
                  className="node f706"
                  data-node="I4013:3535;4013:3519"
                  data-name="Form / Field"
                >
                  <div
                    className="node f705"
                    data-node="I4013:3535;4013:3519;1:5012"
                    data-name="field"
                  >
                    <div
                      className="node f704"
                      data-node="I4013:3535;4013:3519;1:5013"
                      data-name="Photography"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f59">Search Prompts</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="node f707"
                  data-node="I4013:3535;4013:3526"
                  data-name="Form / Field"
                >
                  <div
                    className="node f705"
                    data-node="I4013:3535;4013:3526;1:5012"
                    data-name="field"
                  >
                    <div
                      className="node f704"
                      data-node="I4013:3535;4013:3526;1:5013"
                      data-name="Photography"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f59">All categories</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="node f713"
                  data-node="I4013:3535;4013:4081"
                  data-name="Label"
                >
                  <div
                    className="node f709"
                    data-node="I4013:3535;4013:4082"
                    data-name="UI / Icon"
                  >
                    <div
                      className="node f708"
                      data-node="I4013:3535;4013:4082;4013:3740"
                      data-name="Input"
                    ></div>
                  </div>
                  <div
                    className="node f712"
                    data-node="I4013:3535;4013:4083"
                    data-name="form-label"
                  >
                    <div
                      className="node f711"
                      data-node="I4013:3535;4013:4083;84:3423"
                      data-name="LABEL-ALT/MD/Regular/11px/19"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f710">SHOW ARCHIVE</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="node f773"
                data-node="2001:3505"
                data-name="prompt-data"
              >
                <div
                  className="node f772"
                  data-node="2001:3507"
                  data-name="prompt-grid"
                >

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

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
