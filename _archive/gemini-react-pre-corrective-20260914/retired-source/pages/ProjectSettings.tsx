import React from "react";
import { Link } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function ProjectSettings() {
  const { records, projects } = useApp();
  return (
    <>
      <main
        className="source-frame"
        aria-label="Project / Settings"
        style={{ width: "1512px", height: "2000px" }}
      >
        <div
          className="node f683"
          data-node="4008:1817"
          data-name="Project / Settings"
        >
          <div
            className="node f682"
            data-node="4008:1818"
            data-name="project-settings-modal"
          >
            <div
              className="node f658"
              data-node="4008:1819"
              data-name="background"
            ></div>
            <div
              className="node f659"
              data-node="4008:1820"
              data-name="Modal / Background"
            ></div>
            <div
              className="node f681"
              data-node="4008:1821"
              data-name="Modal / Edit"
            >
              <div
                className="node f662"
                data-node="I4008:1821;4008:958"
                data-name="project-title"
              >
                <div
                  className="node f661"
                  data-node="I4008:1821;4008:958;84:1724"
                  data-name="title"
                >
                  <span
                    className="text-content"
                    style={{ top: "0px", width: "calc(100% + 1px)" }}
                  >
                    <span className="f660">Edit project</span>
                  </span>
                </div>
              </div>
              <div
                className="node f680"
                data-node="I4008:1821;4008:810"
                data-name="modal-meta"
              >
                <div
                  className="node f667"
                  data-node="I4008:1821;4008:811"
                  data-name="label-title"
                >
                  <div
                    className="node f49"
                    data-node="I4008:1821;4008:937"
                    data-name="form-label"
                  >
                    <div
                      className="node f663"
                      data-node="I4008:1821;4008:937;84:3856"
                      data-name="Label/11px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f258">Project title</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f666"
                    data-node="I4008:1821;4008:940"
                    data-name="Form / Field"
                  >
                    <div
                      className="node f665"
                      data-node="I4008:1821;4008:940;1:5012"
                      data-name="field"
                    >
                      <div
                        className="node f664"
                        data-node="I4008:1821;4008:940;1:5013"
                        data-name="Photography"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f251">Photography</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="node f668"
                  data-node="I4008:1821;4008:944"
                  data-name="label-type"
                >
                  <div
                    className="node f49"
                    data-node="I4008:1821;4008:945"
                    data-name="form-label"
                  >
                    <div
                      className="node f663"
                      data-node="I4008:1821;4008:945;84:3856"
                      data-name="Label/11px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f258">Type</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f666"
                    data-node="I4008:1821;4008:946"
                    data-name="Form / Field"
                  >
                    <div
                      className="node f665"
                      data-node="I4008:1821;4008:946;1:5012"
                      data-name="field"
                    >
                      <div
                        className="node f664"
                        data-node="I4008:1821;4008:946;1:5013"
                        data-name="Photography"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f251">Photography</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="node f672"
                  data-node="I4008:1821;4008:950"
                  data-name="label-description-container"
                >
                  <div
                    className="node f49"
                    data-node="I4008:1821;4008:951"
                    data-name="form-label"
                  >
                    <div
                      className="node f663"
                      data-node="I4008:1821;4008:951;84:3856"
                      data-name="Label/11px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f258">Description</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f671"
                    data-node="I4008:1821;4008:952"
                    data-name="Form / Field"
                  >
                    <div
                      className="node f670"
                      data-node="I4008:1821;4008:952;73:1565"
                      data-name="form-text"
                    >
                      <div
                        className="node f669"
                        data-node="I4008:1821;4008:952;1:5017"
                        data-name="field-value"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f251">
                            High-contrast natural light creates strong tonal
                            separation between sunlit surfaces and deep shadows.
                            The palette is restrained (whites, grays, warm wood)
                            but punctuated by a vivid, saturated yellow that
                            reads almost like a flag. Tonal range is good,
                            though shadow detail could be slightly lifted to
                            avoid flatness in the darkest areas.
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="node f679"
                  data-node="I4008:1821;4008:826"
                  data-name="link"
                >
                  <div
                    className="node f675"
                    data-node="I4008:1821;4008:1117"
                    data-name="cancel-button"
                  >
                    <div
                      className="node f674"
                      data-node="I4008:1821;4008:1117;84:3644"
                      data-name="Label Alternative / Medium 11px"
                    >
                      <div
                        className="node f673"
                        data-node="I4008:1821;4008:1117;84:3644;84:3427"
                        data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f68">CANCEL</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f678"
                    data-node="I4008:1821;4008:1121"
                    data-name="save-button"
                  >
                    <div
                      className="node f677"
                      data-node="I4008:1821;4008:1121;84:3509"
                      data-name="Label Alternative / Medium 11px"
                    >
                      <div
                        className="node f676"
                        data-node="I4008:1821;4008:1121;84:3509;84:3427"
                        data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f68">SAVE</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
