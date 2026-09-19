import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

export default function CompareComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveRecord, modelCompare } = useApp();
  const images = location.state?.images || [];
  
  useEffect(() => {
    // Only save the record once when the component mounts and has images
    if (images.length > 0) {
      saveRecord({
        id: uuidv4(),
        type: 'compare',
        title: 'Comparison Results',
        date: new Date().toLocaleDateString(),
        sourceImages: images,
        prompt: 'Analyze and compare these options',
        model: modelCompare,
        result: 'Comparison generated successfully.',
        chat: []
      });
    }
  }, []);

  return (
    <>
      <main
        className="source-frame"
        aria-label="Director / Comparison + Chat"
        style={{ width: "1512px", height: "2087.941px" }}
      >
        <div
          className="node f337"
          data-node="93:10140"
          data-name="02.Director / Compare"
        >
          <div className="node f296" data-node="8025:4138" data-name="sidebar">
            <div
              className="node f20"
              data-node="8025:4139"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f3"
                data-node="I8025:4139;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f2"
                  data-node="I8025:4139;14:679;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f1"
                    data-node="I8025:4139;14:679;84:3330;84:2888"
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
                data-node="I8025:4139;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I8025:4139;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I8025:4139;14:682;84:3230;84:2890"
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
                data-node="I8025:4139;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I8025:4139;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I8025:4139;14:684;84:3230;84:2890"
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
                data-node="I8025:4139;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I8025:4139;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I8025:4139;8025:3809;84:3230;84:2890"
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
                data-node="I8025:4139;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f2"
                  data-node="I8025:4139;14:686;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:4139;14:686;84:3230;84:2890"
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
                data-node="I8025:4139;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I8025:4139;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I8025:4139;14:688;84:3230;84:2890"
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
                data-node="I8025:4139;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I8025:4139;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:4139;14:697;84:3230;84:2890"
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
          <div className="node f336" data-node="93:10143" data-name="main">
            <div
              className="node f330"
              data-node="93:10144"
              data-name="feedback-content"
            >
              <div className="node f28" data-node="93:10145" data-name="topbar">
                <div
                  className="node f27"
                  data-node="I93:10145;4010:4232"
                  data-name="UI / Model Bar"
                >
                  <div
                    className="node f23"
                    data-node="I93:10145;4010:4232;73:1125"
                    data-name="UI / Status Badge"
                  >
                    <div
                      className="node f22"
                      data-node="I93:10145;4010:4232;73:1125;65:8533"
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
                    data-node="I93:10145;4010:4232;84:3738"
                    data-name="Label Alternative / Small 10px"
                  >
                    <div
                      className="node f25"
                      data-node="I93:10145;4010:4232;84:3738;84:3445"
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
              <div className="node f97" data-node="93:10146" data-name="header">
                <div
                  className="node f234"
                  data-node="I93:10146;93:8702"
                  data-name="header-title"
                >
                  <div
                    className="node f230"
                    data-node="I93:10146;93:8703"
                    data-name="Label Alternative / Medium 11px"
                  >
                    <div
                      className="node f229"
                      data-node="I93:10146;93:8703;84:3423"
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
                    data-node="I93:10146;4007:4191"
                    data-name="title-body"
                  >
                    <div
                      className="node f232"
                      data-node="I93:10146;93:8704"
                      data-name="Heading / H2 32px"
                    >
                      <div
                        className="node f231"
                        data-node="I93:10146;93:8704;84:1662"
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
                      data-node="I93:10146;4007:4161"
                      data-name="Body / Extra Small 12px"
                    >
                      <div
                        className="node f36"
                        data-node="I93:10146;4007:4161;88:1185"
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
                  data-node="I93:10146;4007:4452"
                  data-name="project-toolbar"
                >
                  <Link
                    className="node f299"
                    data-node="I93:10146;4007:4132"
                    data-name="UI / Button"
                    to="/compare-new"
                    aria-label="compare-new"
                  >
                    <div
                      className="node f298"
                      data-node="I93:10146;4007:4132;84:3509"
                      data-name="Label Alternative / Medium 11px"
                    >
                      <div
                        className="node f297"
                        data-node="I93:10146;4007:4132;84:3509;84:3427"
                        data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f68">NEW COMPARISON</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className="node f98"
                data-node="4014:5207"
                data-name="Feedback / Panel"
              >
                <div
                  className="node f90"
                  data-node="I4014:5207;77:4015"
                  data-name="tab navigation"
                >
                  <Link
                    className="node f241"
                    data-node="I4014:5207;77:4015;31:1214"
                    data-name="Navigation / Tab"
                    to="/feedback-new"
                    aria-label="feedback-new"
                  >
                    <div
                      className="node f240"
                      data-node="I4014:5207;77:4015;31:1214;91:2362"
                      data-name="Label / Small 11px"
                    >
                      <div
                        className="node f239"
                        data-node="I4014:5207;77:4015;31:1214;91:2362;84:3858"
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
                    data-node="I4014:5207;77:4015;31:1217"
                    data-name="Navigation / Tab"
                    to="/compare-new"
                    aria-label="compare-new"
                  >
                    <div
                      className="node f243"
                      data-node="I4014:5207;77:4015;31:1217;91:2345"
                      data-name="Label / Small 11px"
                    >
                      <div
                        className="node f242"
                        data-node="I4014:5207;77:4015;31:1217;91:2345;84:3860"
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
                className="node f329"
                data-node="93:10147"
                data-name="feedback-panel"
              >
                <div
                  className="node f286"
                  data-node="I93:10147;74:1754"
                  data-name="file-box"
                >
                  <div
                    className="node f285"
                    data-node="I93:10147;74:1893"
                    data-name="Feedback / File"
                  >
                    <div
                      className="node f281"
                      data-node="I93:10147;74:1893;74:1830"
                      data-name="image.jpg"
                    ></div>
                    <div
                      className="node f282"
                      data-node="I93:10147;74:1893;74:1853"
                      data-name="image.jpg"
                    ></div>
                    <div
                      className="node f283"
                      data-node="I93:10147;74:1893;74:1854"
                      data-name="image.jpg"
                    ></div>
                    <div
                      className="node f284"
                      data-node="I93:10147;74:1893;74:1855"
                      data-name="image.jpg"
                    ></div>
                  </div>
                </div>
                <div
                  className="node f328"
                  data-node="I93:10147;74:1773"
                  data-name="feedback"
                >
                  <div
                    className="node f257"
                    data-node="I93:10147;4014:5128"
                    data-name="source-meta"
                  >
                    <div
                      className="node f255"
                      data-node="I93:10147;4014:5078"
                      data-name="source-type"
                    >
                      <div
                        className="node f250"
                        data-node="I93:10147;4014:4903"
                        data-name="label"
                      >
                        <div
                          className="node f49"
                          data-node="I93:10147;4014:4904"
                          data-name="form-label"
                        >
                          <div
                            className="node f48"
                            data-node="I93:10147;4014:4904;84:3862"
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
                        data-node="I93:10147;4014:4905"
                        data-name="photography-input"
                      >
                        <div
                          className="node f252"
                          data-node="I93:10147;4014:4905;1:5105"
                          data-name="Photography"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f251">Photography</span>
                          </span>
                        </div>
                        <div
                          className="node f253"
                          data-node="I93:10147;4014:4905;73:1190"
                          data-name="UI / Icon"
                        >
                          <div
                            className="node f53"
                            data-node="I93:10147;4014:4905;73:1190;65:8507"
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
                      data-node="I93:10147;4014:5103"
                      data-name="project-link"
                    >
                      <div
                        className="node f250"
                        data-node="I93:10147;4014:5050"
                        data-name="label"
                      >
                        <div
                          className="node f49"
                          data-node="I93:10147;4014:5051"
                          data-name="form-label"
                        >
                          <div
                            className="node f48"
                            data-node="I93:10147;4014:5051;84:3862"
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
                        data-node="I93:10147;4014:5052"
                        data-name="photography-input"
                      >
                        <div
                          className="node f252"
                          data-node="I93:10147;4014:5052;1:5105"
                          data-name="Photography"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f251">
                              Diego De Nicola Collection
                            </span>
                          </span>
                        </div>
                        <div
                          className="node f253"
                          data-node="I93:10147;4014:5052;73:1190"
                          data-name="UI / Icon"
                        >
                          <div
                            className="node f53"
                            data-node="I93:10147;4014:5052;73:1190;65:8507"
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
                    data-node="I93:10147;74:1919"
                    data-name="prompt-bar"
                  >
                    <div
                      className="node f260"
                      data-node="I93:10147;88:1009"
                      data-name="form-label"
                    >
                      <div
                        className="node f259"
                        data-node="I93:10147;88:1009;84:3856"
                        data-name="Label/11px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f258">Prompt</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className="node f287"
                      data-node="I93:10147;74:1770"
                      data-name="action-bar"
                    >
                      <div
                        className="node f301"
                        data-node="I93:10147;74:1915"
                        data-name="photography-input"
                      >
                        <div
                          className="node f261"
                          data-node="I93:10147;74:1915;1:5105"
                          data-name="Photography"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f251">Select prompt</span>
                          </span>
                        </div>
                        <div
                          className="node f300"
                          data-node="I93:10147;74:1915;73:1190"
                          data-name="UI / Icon"
                        >
                          <div
                            className="node f53"
                            data-node="I93:10147;74:1915;73:1190;65:8507"
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
                        className="node f266"
                        data-node="I93:10147;74:1772"
                        data-name="UI / Button"
                      >
                        <div
                          className="node f302"
                          data-node="I93:10147;74:1772;84:3509"
                          data-name="Label Alternative / Medium 11px"
                        >
                          <div
                            className="node f297"
                            data-node="I93:10147;74:1772;84:3509;84:3427"
                            data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                          >
                            <span
                              className="text-content"
                              style={{
                                top: "-5.947px",
                                width: "calc(100% + 1px)",
                              }}
                            >
                              <span className="f68">UPDATE COMPARE</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f305"
                    data-node="I93:10147;74:1774"
                    data-name="reply"
                  >
                    <div
                      className="node f304"
                      data-node="I93:10147;74:1774;73:1572"
                      data-name="form-text"
                    >
                      <div
                        className="node f132"
                        data-node="I93:10147;74:1774;47:619"
                        data-name="heading"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f74">FIRST READ</span>
                        </span>
                      </div>
                      <div
                        className="node f303"
                        data-node="I93:10147;74:1774;47:620"
                        data-name="output text"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f59">
                            1. **First impression:** A quiet, sun-drenched
                            snapshot of domestic stillness. The bright yellow
                            laundry immediately draws the eye, while the empty
                            wooden chair and long shadows evoke a sense of
                            absence and pause. It feels observed rather than
                            staged, with a gentle, contemplative mood. 2. **What
                            works:** The strong color contrast of the yellow
                            garments against the white siding creates an
                            immediate visual anchor. The interplay of light and
                            shadow adds texture and depth, especially on the
                            brick column and concrete porch. The empty chair
                            introduces a subtle narrative of waiting or absence
                            without being heavy-handed. 3. **What feels weak or
                            unresolved:** The left-side windows are dark and
                            visually heavy, pulling focus away from the central
                            subjects. The AC unit feels slightly intrusive and
                            breaks the clean lines of the composition. The
                            foreground grass is a bit overgrown and distracts
                            from the porch area, making the base of the frame
                            feel slightly uncontrolled. 10. **Tags:** domestic
                            photography, still life, quiet moment, shadows and
                            light, laundry line, empty chair, American house,
                            observational photography, natural light,
                            architectural detail, absence and presence. Thanks
                            for sharing this—there’s a really quiet power in how
                            the yellow laundry and empty chair hold the space
                            together. If you’re building a series around
                            domestic stillness, this could anchor it
                            beautifully. Let me know if you want to tweak the
                            crop or explore tonal adjustments together.
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f327"
                    data-node="I93:10147;4015:3078"
                    data-name="Recommendations"
                  >
                    <div
                      className="node f307"
                      data-node="I93:10147;4015:3069"
                      data-name="form-label"
                    >
                      <div
                        className="node f306"
                        data-node="I93:10147;4015:3069;84:3862"
                        data-name="Label/11px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f47">Director Recommendations</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className="node f326"
                      data-node="I93:10147;4015:2933"
                      data-name="Compare / Recommendation"
                    >
                      {images.map((img: string, i: number) => (
                        <div
                          key={i}
                          className="node f319"
                          data-node="I93:10147;4015:2933;4015:2625"
                          data-name="Compare / Results"
                        >
                          <div
                            className="node f318"
                            data-node="I93:10147;4015:2933;4015:2625;4015:2572"
                            data-name={i === 0 ? "compare-card-active" : "compare-card-disabled"}
                          >
                            {i === 0 && (
                              <div
                                className="node f310"
                                data-node="I93:10147;4015:2933;4015:2625;4015:2572;4015:2530"
                                data-name="Label Alternative / Small 10px"
                              >
                                <div
                                  className="node f309"
                                  data-node="I93:10147;4015:2933;4015:2625;4015:2572;4015:2530;84:3449"
                                  data-name="LABEL-ALT/SM/Semi-Bold/10px/16"
                                >
                                  <span
                                    className="text-content"
                                    style={{
                                      top: "-4.77px",
                                      width: "calc(100% + 1px)",
                                    }}
                                  >
                                    <span className="f308">Recommended</span>
                                  </span>
                                </div>
                              </div>
                            )}
                            <div
                              className="node f311"
                              data-node="I93:10147;4015:2933;4015:2625;4015:2572;4015:2531"
                              data-name="UI / Image"
                            >
                              <div className="image-clip">
                                <img
                                  className="source-image"
                                  alt=""
                                  draggable="false"
                                  src={img}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              className="node f317"
                              data-node="I93:10147;4015:2933;4015:2625;4015:2572;4015:2589"
                              data-name="title-caption"
                            >
                              <div
                                className="node f314"
                                data-node="I93:10147;4015:2933;4015:2625;4015:2572;4015:2532"
                                data-name="Label Alternative / Extra Large 15px"
                              >
                                <div
                                  className="node f313"
                                  data-node="I93:10147;4015:2933;4015:2625;4015:2572;4015:2532;84:3389"
                                  data-name="LABEL-ALT/XL/Medium/15px/34"
                                >
                                  <span
                                    className="text-content"
                                    style={{
                                      top: "-7.155px",
                                      width: "calc(100% + 1px)",
                                    }}
                                  >
                                    <span className="f312">#{i + 1} · Option {i + 1}</span>
                                  </span>
                                </div>
                              </div>
                              <div
                                className="node f316"
                                data-node="I93:10147;4015:2933;4015:2625;4015:2572;4015:2533"
                                data-name="Strongest overall balance and visual decision."
                              >
                                <span
                                  className="text-content"
                                  style={{
                                    top: "0px",
                                    width: "calc(100% + 1px)",
                                  }}
                                >
                                  <span className="f315">
                                    {i === 0 ? "Strongest overall balance and visual decision." : "A useful alternative with a less decisive centre."}
                                  </span>
                                </span>
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
            <div
              className="node f334"
              data-node="93:10148"
              data-name="prompt-section"
            >
              <div
                className="node f138"
                data-node="I93:10148;74:1702"
                data-name="top-bar"
              >
                <div
                  className="node f137"
                  data-node="I93:10148;84:2903"
                  data-name="H5"
                >
                  <div
                    className="node f136"
                    data-node="I93:10148;84:2903;84:2888"
                    data-name="Heading/H5/Bold/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f0">Ask Director</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f155"
                data-node="I93:10148;4002:1699"
                data-name="Prompt / Editor"
              >
                <div
                  className="node f154"
                  data-node="I93:10148;4002:1699;4002:1567"
                  data-name="prompt-textarea-group"
                >
                  <div
                    className="node f142"
                    data-node="I93:10148;4002:1699;4002:1568"
                    data-name="prompt-text-row"
                  >
                    <div
                      className="node f141"
                      data-node="I93:10148;4002:1699;4002:1569"
                      data-name="prompt-text"
                    >
                      <div
                        className="node f140"
                        data-node="I93:10148;4002:1699;4002:1569;88:1108"
                        data-name="Body/14px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f139">
                            Discuss the reasoning why the image was selected...
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f153"
                    data-node="I93:10148;4002:1699;4002:1571"
                    data-name="prompt-metadata-bar"
                  >
                    <div
                      className="node f144"
                      data-node="I93:10148;4002:1699;4002:1572"
                      data-name="add-files"
                    >
                      <div
                        className="node f143"
                        data-node="I93:10148;4002:1699;4002:1572;65:8500"
                        data-name="plus"
                      >
                        <img
                          className="icon"
                          src="assets/icons/plus.svg"
                          alt=""
                          draggable="false"
                        />
                      </div>
                    </div>
                    <div
                      className="node f333"
                      data-node="I93:10148;4002:1699;4002:1574"
                      data-name="Prompt / Model Selector"
                    >
                      <div
                        className="node f331"
                        data-node="I93:10148;4002:1699;4002:1574;4002:1900"
                        data-name="Label Alternative / Small 10px"
                      >
                        <div
                          className="node f146"
                          data-node="I93:10148;4002:1699;4002:1574;4002:1900;84:3449"
                          data-name="LABEL-ALT/SM/Semi-Bold/10px/16"
                        >
                          <span
                            className="text-content"
                            style={{
                              top: "-4.77px",
                              width: "calc(100% + 1px)",
                            }}
                          >
                            <span className="f145">GEMMA-4</span>
                          </span>
                        </div>
                      </div>
                      <div
                        className="node f332"
                        data-node="I93:10148;4002:1699;4002:1574;73:1550"
                        data-name="UI / Icon"
                      >
                        <div
                          className="node f53"
                          data-node="I93:10148;4002:1699;4002:1574;73:1550;65:8507"
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
                      className="node f152"
                      data-node="I93:10148;4002:1699;4002:1694"
                      data-name="enter-button"
                    >
                      <div
                        className="node f151"
                        data-node="I93:10148;4002:1699;4002:1694;73:1199"
                        data-name="UI / Icon"
                      >
                        <div
                          className="node f150"
                          data-node="I93:10148;4002:1699;4002:1694;73:1199;65:8518"
                          data-name="arrow-up"
                        >
                          <img
                            className="icon"
                            src="assets/icons/arrow-up.svg"
                            alt=""
                            draggable="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="node f335"
              data-node="93:10149"
              data-name="save-button"
            >
              <div
                className="node f159"
                data-node="93:10150"
                data-name="UI / Button"
              >
                <div
                  className="node f224"
                  data-node="I93:10150;84:3509"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f130"
                    data-node="I93:10150;84:3509;84:3427"
                    data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f68">SAVE COMPARISON</span>
                    </span>
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
