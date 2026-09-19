import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function CompareNew() {
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();
  return (
    <>
      <main
        className="source-frame"
        aria-label="Director / New Compare"
        style={{ width: "1512px", height: "1110.429px" }}
      >
        <div
          className="node f279"
          data-node="93:12069"
          data-name="0.Director / New Compare"
        >
          <div className="node f228" data-node="8025:4090" data-name="sidebar">
            <div
              className="node f20"
              data-node="8025:4091"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f3"
                data-node="I8025:4091;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f2"
                  data-node="I8025:4091;14:679;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f1"
                    data-node="I8025:4091;14:679;84:3330;84:2888"
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
                data-node="I8025:4091;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I8025:4091;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I8025:4091;14:682;84:3230;84:2890"
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
                data-node="I8025:4091;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I8025:4091;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I8025:4091;14:684;84:3230;84:2890"
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
                data-node="I8025:4091;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I8025:4091;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I8025:4091;8025:3809;84:3230;84:2890"
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
                data-node="I8025:4091;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f2"
                  data-node="I8025:4091;14:686;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:4091;14:686;84:3230;84:2890"
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
                data-node="I8025:4091;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I8025:4091;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I8025:4091;14:688;84:3230;84:2890"
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
                data-node="I8025:4091;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I8025:4091;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:4091;14:697;84:3230;84:2890"
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
          <div className="node f278" data-node="93:12072" data-name="main">
            <div className="node f277" data-node="93:12073" data-name="content">
              <div
                className="node f28"
                data-node="8021:1065"
                data-name="topbar"
              >
                <div
                  className="node f27"
                  data-node="I8021:1065;4010:4232"
                  data-name="UI / Model Bar"
                >
                  <div
                    className="node f23"
                    data-node="I8021:1065;4010:4232;73:1125"
                    data-name="UI / Status Badge"
                  >
                    <div
                      className="node f22"
                      data-node="I8021:1065;4010:4232;73:1125;65:8533"
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
                    data-node="I8021:1065;4010:4232;84:3738"
                    data-name="Label Alternative / Small 10px"
                  >
                    <div
                      className="node f25"
                      data-node="I8021:1065;4010:4232;84:3738;84:3445"
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
                data-node="8021:2531"
                data-name="header"
              >
                <div
                  className="node f234"
                  data-node="I8021:2531;93:8702"
                  data-name="header-title"
                >
                  <div
                    className="node f230"
                    data-node="I8021:2531;93:8703"
                    data-name="Label Alternative / Medium 11px"
                  >
                    <div
                      className="node f229"
                      data-node="I8021:2531;93:8703;84:3423"
                      data-name="LABEL-ALT/MD/Regular/11px/19"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f29">DIRECTOR / COMPARE</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f233"
                    data-node="I8021:2531;4007:4191"
                    data-name="title-body"
                  >
                    <div
                      className="node f232"
                      data-node="I8021:2531;93:8704"
                      data-name="Heading / H2 32px"
                    >
                      <div
                        className="node f231"
                        data-node="I8021:2531;93:8704;84:1662"
                        data-name="Heading/H2 /Semi-Bold/32px/37"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f32">Compare</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className="node f37"
                      data-node="I8021:2531;4007:4161"
                      data-name="Body / Extra Small 12px"
                    >
                      <div
                        className="node f36"
                        data-node="I8021:2531;4007:4161;88:1185"
                        data-name="Body/12px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.456px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f35">
                            Choose the strongest option from 2–6 photographs or
                            designs.
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="node f238"
                  data-node="I8021:2531;4007:4452"
                  data-name="project-toolbar"
                >
                  <Link
                    className="node f237"
                    data-node="I8021:2531;93:8705"
                    data-name="UI / Button"
                    to="/compare-new"
                    aria-label="compare-new"
                  >
                    <div
                      className="node f236"
                      data-node="I8021:2531;93:8705;84:3644"
                      data-name="Label Alternative / Medium 11px"
                    >
                      <div
                        className="node f235"
                        data-node="I8021:2531;93:8705;84:3644;84:3427"
                        data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f68">CLEAR</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className="node f245"
                data-node="93:12077"
                data-name="Feedback / Panel"
              >
                <div
                  className="node f90"
                  data-node="I93:12077;77:4015"
                  data-name="tab navigation"
                >
                  <Link
                    className="node f241"
                    data-node="I93:12077;77:4015;31:1214"
                    data-name="Navigation / Tab"
                    to="/feedback-new"
                    aria-label="feedback-new"
                  >
                    <div
                      className="node f240"
                      data-node="I93:12077;77:4015;31:1214;91:2362"
                      data-name="Label / Small 11px"
                    >
                      <div
                        className="node f239"
                        data-node="I93:12077;77:4015;31:1214;91:2362;84:3858"
                        data-name="Label/11px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f86">Single Feedback</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Link
                    className="node f244"
                    data-node="I93:12077;77:4015;31:1217"
                    data-name="Navigation / Tab"
                    to="/compare-new"
                    aria-label="compare-new"
                  >
                    <div
                      className="node f243"
                      data-node="I93:12077;77:4015;31:1217;91:2345"
                      data-name="Label / Small 11px"
                    >
                      <div
                        className="node f242"
                        data-node="I93:12077;77:4015;31:1217;91:2345;84:3860"
                        data-name="Label/11px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f82">Compare</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className="node f276"
                data-node="93:12078"
                data-name="compare-panel"
              >
                <div
                  className="node f275"
                  data-node="93:12079"
                  data-name="Feedback / Panel"
                >
                  <div
                    className="node f274"
                    data-node="I93:12079;77:4016"
                    data-name="feedback-panel"
                  >
                    <div
                      className="node f249"
                      data-node="I93:12079;77:4016;74:1754"
                      data-name="file-box"
                      style={{ cursor: "pointer", position: 'relative', overflow: 'hidden' }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          const files = Array.from(e.dataTransfer.files).map(file => URL.createObjectURL(file));
                          setImages(prev => [...prev, ...files]);
                        }
                      }}
                    >
                      {images.length > 0 && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: '8px', padding: '16px', overflowX: 'auto', background: '#1c1c1c' }}>
                          {images.map((img, idx) => (
                            <img key={idx} src={img} style={{ height: '100%', objectFit: 'contain' }} alt="" />
                          ))}
                        </div>
                      )}
                      <div
                        className="node f248"
                        data-node="I93:12079;77:4016;74:1893"
                        data-name="Feedback / File"
                      >
                        <div
                          className="node f246"
                          data-node="I93:12079;77:4016;74:1893;88:947"
                          data-name="label"
                        >
                          <div
                            className="node f41"
                            data-node="I93:12079;77:4016;74:1893;88:947;88:912"
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
                          className="node f247"
                          data-node="I93:12079;77:4016;74:1893;88:973"
                          data-name="Label / Extra Large 26px"
                        >
                          <div
                            className="node f44"
                            data-node="I93:12079;77:4016;74:1893;88:973;88:965"
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
                    </div>
                    <div
                      className="node f273"
                      data-node="I93:12079;77:4016;74:1773"
                      data-name="feedback"
                    >
                      <div
                        className="node f257"
                        data-node="I93:12079;77:4016;4014:5128"
                        data-name="source-meta"
                      >
                        <div
                          className="node f255"
                          data-node="I93:12079;77:4016;4014:5078"
                          data-name="source-type"
                        >
                          <div
                            className="node f250"
                            data-node="I93:12079;77:4016;4014:4903"
                            data-name="label"
                          >
                            <div
                              className="node f49"
                              data-node="I93:12079;77:4016;4014:4904"
                              data-name="form-label"
                            >
                              <div
                                className="node f48"
                                data-node="I93:12079;77:4016;4014:4904;84:3862"
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
                            className="node f254"
                            data-node="I93:12079;77:4016;4014:4905"
                            data-name="photography-input"
                          >
                            <div
                              className="node f252"
                              data-node="I93:12079;77:4016;4014:4905;1:5105"
                              data-name="Photography"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f251">Select</span>
                              </span>
                            </div>
                            <div
                              className="node f253"
                              data-node="I93:12079;77:4016;4014:4905;73:1190"
                              data-name="UI / Icon"
                            >
                              <div
                                className="node f53"
                                data-node="I93:12079;77:4016;4014:4905;73:1190;65:8507"
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
                        </div>
                        <div
                          className="node f256"
                          data-node="I93:12079;77:4016;4014:5103"
                          data-name="project-link"
                        >
                          <div
                            className="node f250"
                            data-node="I93:12079;77:4016;4014:5050"
                            data-name="label"
                          >
                            <div
                              className="node f49"
                              data-node="I93:12079;77:4016;4014:5051"
                              data-name="form-label"
                            >
                              <div
                                className="node f48"
                                data-node="I93:12079;77:4016;4014:5051;84:3862"
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
                          </div>
                          <div
                            className="node f254"
                            data-node="I93:12079;77:4016;4014:5052"
                            data-name="photography-input"
                          >
                            <div
                              className="node f252"
                              data-node="I93:12079;77:4016;4014:5052;1:5105"
                              data-name="Photography"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f251">Select project</span>
                              </span>
                            </div>
                            <div
                              className="node f253"
                              data-node="I93:12079;77:4016;4014:5052;73:1190"
                              data-name="UI / Icon"
                            >
                              <div
                                className="node f53"
                                data-node="I93:12079;77:4016;4014:5052;73:1190;65:8507"
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
                        </div>
                      </div>
                      <div
                        className="node f268"
                        data-node="I93:12079;77:4016;74:1919"
                        data-name="prompt-bar"
                      >
                        <div
                          className="node f260"
                          data-node="I93:12079;77:4016;88:1009"
                          data-name="form-label"
                        >
                          <div
                            className="node f259"
                            data-node="I93:12079;77:4016;88:1009;84:3856"
                            data-name="Label/11px"
                          >
                            <span
                              className="text-content"
                              style={{
                                top: "-5.793px",
                                width: "calc(100% + 1px)",
                              }}
                            >
                              <span className="f258">Prompt</span>
                            </span>
                          </div>
                        </div>
                        <div
                          className="node f267"
                          data-node="I93:12079;77:4016;74:1770"
                          data-name="action-bar"
                        >
                          <div
                            className="node f263"
                            data-node="I93:12079;77:4016;74:1915"
                            data-name="photography-input"
                          >
                            <div
                              className="node f261"
                              data-node="I93:12079;77:4016;74:1915;1:5105"
                              data-name="Photography"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f251">Select prompt</span>
                              </span>
                            </div>
                            <div
                              className="node f262"
                              data-node="I93:12079;77:4016;74:1915;73:1190"
                              data-name="UI / Icon"
                            >
                              <div
                                className="node f53"
                                data-node="I93:12079;77:4016;74:1915;73:1190;65:8507"
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
                            className="node f264"
                            data-node="I93:12079;77:4016;74:1771"
                            data-name="UI / Button"
                          >
                            <div
                              className="node f126"
                              data-node="I93:12079;77:4016;74:1771;84:3644"
                              data-name="Label Alternative / Medium 11px"
                            >
                              <div
                                className="node f69"
                                data-node="I93:12079;77:4016;74:1771;84:3644;84:3427"
                                data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                              >
                                <span
                                  className="text-content"
                                  style={{
                                    top: "-5.947px",
                                    width: "calc(100% + 1px)",
                                  }}
                                >
                                  <span className="f68">CLEAR PROMPT</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            className="node f266"
                            data-node="I93:12079;77:4016;74:1772"
                            data-name="UI / Button"
                            style={{ cursor: images.length > 0 ? "pointer" : "not-allowed", opacity: images.length > 0 ? 1 : 0.5 }}
                            onClick={() => {
                              if (images.length > 0) {
                                navigate('/compare-thinking', { state: { images } });
                              }
                            }}
                          >
                            <div
                              className="node f265"
                              data-node="I93:12079;77:4016;74:1772;84:3509"
                              data-name="Label Alternative / Medium 11px"
                            >
                              <div
                                className="node f130"
                                data-node="I93:12079;77:4016;74:1772;84:3509;84:3427"
                                data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                              >
                                <span
                                  className="text-content"
                                  style={{
                                    top: "-5.947px",
                                    width: "calc(100% + 1px)",
                                  }}
                                >
                                  <span className="f68">COMPARE SOURCES</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f272"
                        data-node="I93:12079;77:4016;74:1774"
                        data-name="reply"
                      >
                        <div
                          className="node f271"
                          data-node="I93:12079;77:4016;74:1774;73:1572"
                          data-name="form-text"
                        >
                          <div
                            className="node f269"
                            data-node="I93:12079;77:4016;74:1774;47:619"
                            data-name="heading"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f74">{images.length > 0 ? "READY TO COMPARE" : "NOTHING TO COMPARE"}</span>
                            </span>
                          </div>
                          <div
                            className="node f270"
                            data-node="I93:12079;77:4016;74:1774;47:620"
                            data-name="output text"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f59">
                                {images.length > 0 ? `${images.length} images selected.` : "Select 2 images to start comparing."}
                              </span>
                            </span>
                          </div>
                        </div>
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
