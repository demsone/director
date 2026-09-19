import React from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function FeedbackNew() {
  const navigate = useNavigate();
  const { currentFeedbackImage, setCurrentFeedbackImage } = useApp();
  return (
    <>
      <main
        className="source-frame"
        aria-label="Director / New Feedback"
        style={{ width: "1512px", height: "1321px" }}
      >
        <div
          className="node f95"
          data-node="93:11963"
          data-name="0.Director / New Feedback"
        >
          <div className="node f21" data-node="93:11964" data-name="sidebar">
            <div
              className="node f20"
              data-node="93:11965"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f3"
                data-node="I93:11965;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f2"
                  data-node="I93:11965;14:679;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f1"
                    data-node="I93:11965;14:679;84:3330;84:2888"
                    data-name="Heading/H5/Bold/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f0">Director</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f7"
                data-node="I93:11965;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I93:11965;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I93:11965;14:682;84:3230;84:2890"
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
                data-node="I93:11965;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I93:11965;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I93:11965;14:684;84:3230;84:2890"
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
                data-node="I93:11965;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I93:11965;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I93:11965;8025:3809;84:3230;84:2890"
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
                data-node="I93:11965;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f2"
                  data-node="I93:11965;14:686;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I93:11965;14:686;84:3230;84:2890"
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
                className="node f18"
                data-node="I93:11965;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I93:11965;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I93:11965;14:688;84:3230;84:2890"
                    data-name="Heading/H5/Regular/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f4">Prompts</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f19"
                data-node="I93:11965;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I93:11965;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I93:11965;14:697;84:3230;84:2890"
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
          <div className="node f94" data-node="93:11966" data-name="main">
            <div className="node f93" data-node="93:11967" data-name="content">
              <div
                className="node f28"
                data-node="4002:1330"
                data-name="topbar"
              >
                <div
                  className="node f27"
                  data-node="I4002:1330;4010:4232"
                  data-name="UI / Model Bar"
                >
                  <div
                    className="node f23"
                    data-node="I4002:1330;4010:4232;73:1125"
                    data-name="UI / Status Badge"
                  >
                    <div
                      className="node f22"
                      data-node="I4002:1330;4010:4232;73:1125;65:8533"
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
                    data-node="I4002:1330;4010:4232;84:3738"
                    data-name="Label Alternative / Small 10px"
                  >
                    <div
                      className="node f25"
                      data-node="I4002:1330;4010:4232;84:3738;84:3445"
                      data-name="model-name"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-4.77px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f24">
                          ONLINE · LM STUDIO · GEMMA-4
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="node f39"
                data-node="4001:1979"
                data-name="header"
              >
                <div
                  className="node f31"
                  data-node="I4001:1979;84:3761"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f30"
                    data-node="I4001:1979;84:3761;84:3423"
                    data-name="LABEL-ALT/MD/Regular/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f29">DIRECTOR / FEEDBACK</span>
                    </span>
                  </div>
                </div>
                <div
                  className="node f38"
                  data-node="I4001:1979;4002:1245"
                  data-name="header-body"
                >
                  <div
                    className="node f34"
                    data-node="I4001:1979;84:2728"
                    data-name="Heading / H2 32px"
                  >
                    <div
                      className="node f33"
                      data-node="I4001:1979;84:2728;84:1662"
                      data-name="Heading/H2 /Semi-Bold/32px/37"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f32">New Feedback</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f37"
                    data-node="I4001:1979;4002:1161"
                    data-name="Body / Extra Small 12px"
                  >
                    <div
                      className="node f36"
                      data-node="I4001:1979;4002:1161;88:1185"
                      data-name="Body/12px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.456px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f35">
                          Review one photograph, design, screen, layout, poster,
                          or visual direction.
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="node f92"
                data-node="93:11971"
                data-name="feedback-layout"
              >
                <div
                  className="node f81"
                  data-node="93:11973"
                  data-name="Feedback / Panel"
                >
                  <div
                    className="node f80"
                    data-node="I93:11973;77:4016"
                    data-name="feedback-panel"
                  >
                    <div
                      className="node f73"
                      data-node="I93:11973;77:4016;47:583"
                      data-name="content-left"
                    >
                      <div
                        className="node f46"
                        data-node="I93:11973;77:4016;74:1861"
                        data-name="Feedback / File"
                      >
                        <div
                          className="node f42"
                          data-node="I93:11973;77:4016;74:1861;88:947"
                          data-name="label"
                        >
                          <div
                            className="node f41"
                            data-node="I93:11973;77:4016;74:1861;88:947;88:912"
                            data-name="label"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f40">Ask for feedback</span>
                            </span>
                          </div>
                        </div>
                        <div
                          className="node f45"
                          data-node="I93:11973;77:4016;74:1861;88:973"
                          data-name="Label / Huge 26px"
                        >
                          <div
                            className="node f44"
                            data-node="I93:11973;77:4016;74:1861;88:973;88:965"
                            data-name="Label/26px"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f43">Drop a file here</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f50"
                        data-node="I93:11973;77:4016;47:588"
                        data-name="label"
                      >
                        <div
                          className="node f49"
                          data-node="I93:11973;77:4016;84:3893"
                          data-name="form-label"
                        >
                          <div
                            className="node f48"
                            data-node="I93:11973;77:4016;84:3893;84:3862"
                            data-name="Label/11px"
                          >
                            <span
                              className="text-content"
                              style={{
                                top: "-5.793px",
                                width: "calc(100% + 1px)",
                              }}
                            >
                              <span className="f47">Source Type</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f55"
                        data-node="I93:11973;77:4016;47:590"
                        data-name="photography-input"
                      >
                        <div
                          className="node f52"
                          data-node="I93:11973;77:4016;47:590;1:5105"
                          data-name="Photography"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f51">Photography</span>
                          </span>
                        </div>
                        <div
                          className="node f54"
                          data-node="I93:11973;77:4016;47:590;73:1190"
                          data-name="UI / Icon"
                        >
                          <div
                            className="node f53"
                            data-node="I93:11973;77:4016;47:590;73:1190;65:8507"
                            data-name="chevron-down"
                          >
                            <img
                              className="icon"
                              src="assets/icons/chevron-down.svg"
                              alt=""
                              draggable="false"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f57"
                        data-node="I93:11973;77:4016;88:989"
                        data-name="form-label"
                      >
                        <div
                          className="node f56"
                          data-node="I93:11973;77:4016;88:989;84:3862"
                          data-name="Label/11px"
                        >
                          <span
                            className="text-content"
                            style={{
                              top: "-5.793px",
                              width: "calc(100% + 1px)",
                            }}
                          >
                            <span className="f47">Prompt</span>
                          </span>
                        </div>
                      </div>
                      <div
                        className="node f58"
                        data-node="I93:11973;77:4016;47:593"
                        data-name="prompt-selector"
                      >
                        <div
                          className="node f52"
                          data-node="I93:11973;77:4016;47:593;1:5105"
                          data-name="Photography"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f51">Select prompt</span>
                          </span>
                        </div>
                        <div
                          className="node f54"
                          data-node="I93:11973;77:4016;47:593;73:1190"
                          data-name="UI / Icon"
                        >
                          <div
                            className="node f53"
                            data-node="I93:11973;77:4016;47:593;73:1190;65:8507"
                            data-name="chevron-down"
                          >
                            <img
                              className="icon"
                              src="assets/icons/chevron-down.svg"
                              alt=""
                              draggable="false"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f62"
                        data-node="I93:11973;77:4016;47:594"
                        data-name="prompt-textarea"
                      >
                        <div
                          className="node f61"
                          data-node="I93:11973;77:4016;47:594;73:1565"
                          data-name="form-text"
                        >
                          <div
                            className="node f60"
                            data-node="I93:11973;77:4016;47:594;1:5017"
                            data-name="prompt-body"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f59">
                                Select a preset prompt OR enter your own..
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f64"
                        data-node="I93:11973;77:4016;84:3907"
                        data-name="source-note"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f63">
                            Director references this file when a Finder path is
                            available. Browser uploads are stored as a local
                            source copy so they can still be feedbacked.
                          </span>
                        </span>
                      </div>
                      <div
                        className="node f66"
                        data-node="I93:11973;77:4016;4007:2047"
                        data-name="form-label"
                      >
                        <div
                          className="node f65"
                          data-node="I93:11973;77:4016;4007:2047;84:3862"
                          data-name="Label/11px"
                        >
                          <span
                            className="text-content"
                            style={{
                              top: "-5.793px",
                              width: "calc(100% + 1px)",
                            }}
                          >
                            <span className="f47">Project Link</span>
                          </span>
                        </div>
                      </div>
                      <div
                        className="node f67"
                        data-node="I93:11973;77:4016;4007:2031"
                        data-name="prompt-selector"
                      >
                        <div
                          className="node f52"
                          data-node="I93:11973;77:4016;4007:2031;1:5105"
                          data-name="Photography"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f51">Select Project</span>
                          </span>
                        </div>
                        <div
                          className="node f54"
                          data-node="I93:11973;77:4016;4007:2031;73:1190"
                          data-name="UI / Icon"
                        >
                          <div
                            className="node f53"
                            data-node="I93:11973;77:4016;4007:2031;73:1190;65:8507"
                            data-name="chevron-down"
                          >
                            <img
                              className="icon"
                              src="assets/icons/chevron-down.svg"
                              alt=""
                              draggable="false"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f72"
                        data-node="I93:11973;77:4016;47:602"
                        data-name="action-bar"
                      >
                        <div
                          className="node f71"
                          data-node="I93:11973;77:4016;73:878"
                          data-name="UI / Button"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate('/feedback-thinking')}
                        >
                          <div
                            className="node f70"
                            data-node="I93:11973;77:4016;73:878;84:3509"
                            data-name="Label Alternative / Medium 11px"
                          >
                            <div
                              className="node f69"
                              data-node="I93:11973;77:4016;73:878;84:3509;84:3427"
                              data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-5.947px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f68">GET FEEDBACK</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="node f79"
                      data-node="I93:11973;77:4016;47:605"
                      data-name="content-right"
                      style={{ cursor: 'pointer', overflow: 'hidden' }}
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <input 
                        id="file-upload" 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setCurrentFeedbackImage(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                      {currentFeedbackImage ? (
                        <img src={currentFeedbackImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                      ) : (
                        <div
                          className="node f78"
                          data-node="I93:11973;77:4016;47:623"
                          data-name="Form / Field"
                        >
                          <div
                            className="node f77"
                            data-node="I93:11973;77:4016;47:623;73:1572"
                            data-name="form-text"
                          >
                            <div
                              className="node f75"
                              data-node="I93:11973;77:4016;47:623;47:619"
                              data-name="heading"
                            >
                              <span
                                className="text-content"
                                style={{ top: "0px", width: "calc(100% + 1px)" }}
                              >
                                <span className="f74">NOTHING TO FEEDBACK</span>
                              </span>
                            </div>
                            <div
                              className="node f76"
                              data-node="I93:11973;77:4016;47:623;47:620"
                              data-name="output text"
                            >
                              <span
                                className="text-content"
                                style={{ top: "0px", width: "calc(100% + 1px)" }}
                              >
                                <span className="f59">
                                  Select an image to start feedback.
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div
                  className="node f91"
                  data-node="93:11972"
                  data-name="Feedback / Panel"
                >
                  <div
                    className="node f90"
                    data-node="I93:11972;77:4015"
                    data-name="tab navigation"
                  >
                    <Link
                      className="node f85"
                      data-node="I93:11972;77:4015;31:1214"
                      data-name="Navigation / Tab"
                      to="/feedback-new"
                      aria-label="feedback-new"
                    >
                      <div
                        className="node f84"
                        data-node="I93:11972;77:4015;31:1214;91:2345"
                        data-name="Label / Small 11px"
                      >
                        <div
                          className="node f83"
                          data-node="I93:11972;77:4015;31:1214;91:2345;84:3860"
                          data-name="Label/11px"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f82"> Feedback</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      className="node f89"
                      data-node="I93:11972;77:4015;31:1217"
                      data-name="Tab"
                      to="/compare-new"
                      aria-label="compare-new"
                    >
                      <div
                        className="node f88"
                        data-node="I93:11972;77:4015;31:1217;91:2362"
                        data-name="Label / Small 11px"
                      >
                        <div
                          className="node f87"
                          data-node="I93:11972;77:4015;31:1217;91:2362;84:3858"
                          data-name="Label/11px"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f86">Compare</span>
                          </span>
                        </div>
                      </div>
                    </Link>
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
