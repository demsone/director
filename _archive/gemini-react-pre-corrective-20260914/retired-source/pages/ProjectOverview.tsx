import React from "react";
import { Link } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function ProjectOverview() {
  const { records, projects } = useApp();
  return (
    <>
      <main
        className="source-frame"
        aria-label="Projects / Detail / Overview"
        style={{ width: "1512px", height: "1644px" }}
      >
        <div
          className="node f581"
          data-node="4011:5891"
          data-name="Projects / Detail / Overview"
        >
          <div className="node f521" data-node="4011:5892" data-name="sidebar">
            <div
              className="node f379"
              data-node="4011:5893"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f375"
                data-node="I4011:5893;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f374"
                  data-node="I4011:5893;14:679;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f373"
                    data-node="I4011:5893;14:679;84:3230;84:2890"
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
                data-node="I4011:5893;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I4011:5893;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I4011:5893;14:682;84:3230;84:2890"
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
                data-node="I4011:5893;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I4011:5893;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I4011:5893;14:684;84:3230;84:2890"
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
                data-node="I4011:5893;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I4011:5893;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I4011:5893;8025:3809;84:3230;84:2890"
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
                className="node f495"
                data-node="I4011:5893;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f17"
                  data-node="I4011:5893;14:686;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f494"
                    data-node="I4011:5893;14:686;84:3330;84:2888"
                    data-name="Heading/H5/Bold/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f0">Projects</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f18"
                data-node="I4011:5893;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I4011:5893;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I4011:5893;14:688;84:3230;84:2890"
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
                data-node="I4011:5893;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I4011:5893;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I4011:5893;14:697;84:3230;84:2890"
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
          <div className="node f580" data-node="4011:5894" data-name="main">
            <div className="node f381" data-node="4011:5895" data-name="topbar">
              <Link
                className="node f168"
                data-node="I4011:5895;73:1074"
                data-name="UI / Button"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f165"
                  data-node="I4011:5895;73:1074;72:653"
                  data-name="UI / Icon"
                >
                  <div
                    className="node f164"
                    data-node="I4011:5895;73:1074;72:653;65:8523"
                    data-name="arrow-left"
                  >
                    <img
                      className="icon"
                      src="assets/icons/arrow-left.svg"
                      alt=""
                      draggable="false"
                    />
                  </div>
                </div>
                <div
                  className="node f167"
                  data-node="I4011:5895;73:1074;84:3616"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f166"
                    data-node="I4011:5895;73:1074;84:3616;84:3427"
                    data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f68">BACK TO PROJECTS</span>
                    </span>
                  </div>
                </div>
              </Link>
              <div
                className="node f27"
                data-node="I4011:5895;4010:4273"
                data-name="UI / Model Bar"
              >
                <div
                  className="node f23"
                  data-node="I4011:5895;4010:4273;73:1125"
                  data-name="UI / Status Badge"
                >
                  <div
                    className="node f22"
                    data-node="I4011:5895;4010:4273;73:1125;65:8533"
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
                  data-node="I4011:5895;4010:4273;84:3738"
                  data-name="Label Alternative / Small 10px"
                >
                  <div
                    className="node f25"
                    data-node="I4011:5895;4010:4273;84:3738;84:3445"
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
              className="node f384"
              data-node="4011:5896"
              data-name="UI / Header"
            >
              <div
                className="node f118"
                data-node="I4011:5896;77:4531"
                data-name="header-title"
              >
                <div
                  className="node f115"
                  data-node="I4011:5896;84:3771"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f114"
                    data-node="I4011:5896;84:3771;84:3423"
                    data-name="LABEL-ALT/MD/Regular/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f29">
                        DIRECTOR / DARKROOM / projects
                      </span>
                    </span>
                  </div>
                </div>
                <div
                  className="node f117"
                  data-node="I4011:5896;84:2778"
                  data-name="Heading / H2 32px"
                >
                  <div
                    className="node f116"
                    data-node="I4011:5896;84:2778;84:1662"
                    data-name="Heading/H2 /Semi-Bold/32px/37"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f32">Colour Where It Lives</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f526"
                data-node="I4011:5896;93:8727"
                data-name="Project / Toolbar"
              >
                <div
                  className="node f525"
                  data-node="I4011:5896;93:8727;93:8695"
                  data-name="toolbar-actions"
                >
                  <div
                    className="node f522"
                    data-node="I4011:5896;93:8727;93:8832"
                    data-name="Project / Toolbar Action"
                  >
                    <Link
                      className="node f119"
                      data-node="I4011:5896;93:8727;93:8832;93:8633"
                      data-name="pencil"
                      to="/project-settings"
                      aria-label="project-settings"
                    >
                      <img
                        className="icon"
                        src="assets/icons/pencil.svg"
                        alt=""
                        draggable="false"
                      />
                    </Link>
                  </div>
                  <div
                    className="node f523"
                    data-node="I4011:5896;93:8727;93:8687"
                    data-name="Project / Toolbar Action"
                  >
                    <div
                      className="node f121"
                      data-node="I4011:5896;93:8727;93:8687;93:8678"
                      data-name="Star"
                    >
                      <img
                        className="icon"
                        src="assets/icons/Star.svg"
                        alt=""
                        draggable="false"
                      />
                    </div>
                  </div>
                  <div
                    className="node f524"
                    data-node="I4011:5896;93:8727;93:8688"
                    data-name="Project / Toolbar Action"
                  >
                    <div
                      className="node f123"
                      data-node="I4011:5896;93:8727;93:8688;93:8673"
                      data-name="bin"
                    >
                      <img
                        className="icon"
                        src="assets/icons/bin.svg"
                        alt=""
                        draggable="false"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="node f579"
              data-node="4011:6156"
              data-name="project-content"
            >
              <div
                className="node f90"
                data-node="4011:5897"
                data-name="Navigation / Tabs"
              >
                <Link
                  className="node f529"
                  data-node="I4011:5897;31:1214"
                  data-name="Navigation / Tab"
                  to="/project-overview"
                  aria-label="project-overview"
                >
                  <div
                    className="node f528"
                    data-node="I4011:5897;31:1214;91:2345"
                    data-name="Label / Small 11px"
                  >
                    <div
                      className="node f527"
                      data-node="I4011:5897;31:1214;91:2345;84:3860"
                      data-name="Label/11px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f82">Overview</span>
                      </span>
                    </div>
                  </div>
                </Link>
                <Link
                  className="node f532"
                  data-node="I4011:5897;31:1217"
                  data-name="Tab"
                  to="/project-feedback"
                  aria-label="project-feedback"
                >
                  <div
                    className="node f531"
                    data-node="I4011:5897;31:1217;91:2362"
                    data-name="Label / Small 11px"
                  >
                    <div
                      className="node f530"
                      data-node="I4011:5897;31:1217;91:2362;84:3858"
                      data-name="Label/11px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f86">Feedback</span>
                      </span>
                    </div>
                  </div>
                </Link>
                <div
                  className="node f535"
                  data-node="I4011:5897;4011:5690"
                  data-name="Navigation / Tab"
                >
                  <div
                    className="node f534"
                    data-node="I4011:5897;4011:5690;91:2362"
                    data-name="Label / Small 11px"
                  >
                    <div
                      className="node f533"
                      data-node="I4011:5897;4011:5690;91:2362;84:3858"
                      data-name="Label/11px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f86">Notes</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="node f578"
                data-node="4011:5898"
                data-name="project-data"
              >
                <div
                  className="node f541"
                  data-node="4011:6159"
                  data-name="project-summary"
                >
                  <div
                    className="node f538"
                    data-node="4011:6151"
                    data-name="Heading / H5 16px"
                  >
                    <div
                      className="node f537"
                      data-node="I4011:6151;84:2892"
                      data-name="Heading/H5/Semi-Bold/16px/21"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.358px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f536">Project Summary</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f540"
                    data-node="4011:6095"
                    data-name="Body / Extra Small 12px"
                  >
                    <div
                      className="node f539"
                      data-node="I4011:6095;88:1185"
                      data-name="Body/12px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.456px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f35">
                          A quiet, sun-drenched snapshot of domestic stillness.
                          The bright yellow laundry immediately draws the eye,
                          while the empty wooden chair and long shadows evoke a
                          sense of absence and pause. It feels observed rather
                          than staged, with a gentle, contemplative mood.
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="node f577"
                  data-node="4011:6160"
                  data-name="latest-activity"
                >
                  <div
                    className="node f543"
                    data-node="4012:7344"
                    data-name="Heading / H5 16px"
                  >
                    <div
                      className="node f542"
                      data-node="I4012:7344;84:2892"
                      data-name="Heading/H5/Semi-Bold/16px/21"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.358px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f536">Latest Activity</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f576"
                    data-node="4011:6469"
                    data-name="recent-sessions"
                  >
                    <div
                      className="node f570"
                      data-node="4011:6544"
                      data-name="Project / Session Card"
                    >
                      <div
                        className="node f550"
                        data-node="I4011:6544;4011:6177"
                        data-name="activity box"
                      >
                        <div
                          className="node f546"
                          data-node="I4011:6544;4011:6206"
                          data-name="Body / Medium 14px"
                        >
                          <div
                            className="node f545"
                            data-node="I4011:6544;4011:6206;88:1096"
                            data-name="Body/14px"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f544">5</span>
                            </span>
                          </div>
                        </div>
                        <div
                          className="node f549"
                          data-node="I4011:6544;4011:6209"
                          data-name="Body / Medium 14px"
                        >
                          <div
                            className="node f548"
                            data-node="I4011:6544;4011:6209;88:1104"
                            data-name="Body/14px"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f547">Feedback Sessions</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f562"
                        data-node="I4011:6544;4011:6188"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6544;4011:6839"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6544;4011:6832"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6544;4011:6832;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6544;4011:6203"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6544;4011:6203;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6544;4011:6196"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6544;4011:6189"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6544;4011:6189;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6544;4011:6190"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6544;4011:6190;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f563"
                        data-node="I4011:6544;4012:7347"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6544;4012:7348"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6544;4012:7349"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6544;4012:7349;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6544;4012:7350"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6544;4012:7350;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6544;4012:7351"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6544;4012:7352"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6544;4012:7352;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6544;4012:7353"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6544;4012:7353;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f564"
                        data-node="I4011:6544;4012:7380"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6544;4012:7381"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6544;4012:7382"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6544;4012:7382;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6544;4012:7383"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6544;4012:7383;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6544;4012:7384"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6544;4012:7385"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6544;4012:7385;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6544;4012:7386"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6544;4012:7386;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f565"
                        data-node="I4011:6544;4012:7413"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6544;4012:7414"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6544;4012:7415"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6544;4012:7415;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6544;4012:7416"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6544;4012:7416;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6544;4012:7417"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6544;4012:7418"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6544;4012:7418;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6544;4012:7419"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6544;4012:7419;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f566"
                        data-node="I4011:6544;4012:7446"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6544;4012:7447"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6544;4012:7448"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6544;4012:7448;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6544;4012:7449"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6544;4012:7449;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6544;4012:7450"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6544;4012:7451"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6544;4012:7451;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6544;4012:7452"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6544;4012:7452;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f569"
                        data-node="I4011:6544;4011:6319"
                        data-name="Body / Extra Small 12px"
                      >
                        <Link
                          className="node f568"
                          data-node="I4011:6544;4011:6319;88:1185"
                          data-name="Body/12px"
                          to="/project-feedback"
                          aria-label="project-feedback"
                        >
                          <span
                            className="text-content"
                            style={{
                              top: "-5.456px",
                              width: "calc(100% + 1px)",
                            }}
                          >
                            <span className="f567">See all</span>
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div
                      className="node f575"
                      data-node="4011:6577"
                      data-name="Project / Session Card"
                    >
                      <div
                        className="node f550"
                        data-node="I4011:6577;4011:6177"
                        data-name="activity box"
                      >
                        <div
                          className="node f572"
                          data-node="I4011:6577;4011:6206"
                          data-name="Body / Medium 14px"
                        >
                          <div
                            className="node f571"
                            data-node="I4011:6577;4011:6206;88:1096"
                            data-name="Body/14px"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f544">0</span>
                            </span>
                          </div>
                        </div>
                        <div
                          className="node f574"
                          data-node="I4011:6577;4011:6209"
                          data-name="Body / Medium 14px"
                        >
                          <div
                            className="node f573"
                            data-node="I4011:6577;4011:6209;88:1104"
                            data-name="Body/14px"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f547">Compare Sessions</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f562"
                        data-node="I4011:6577;4011:6188"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6577;4011:6839"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6577;4011:6832"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6577;4011:6832;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6577;4011:6203"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6577;4011:6203;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6577;4011:6196"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6577;4011:6189"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6577;4011:6189;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6577;4011:6190"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6577;4011:6190;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f563"
                        data-node="I4011:6577;4012:7347"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6577;4012:7348"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6577;4012:7349"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6577;4012:7349;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6577;4012:7350"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6577;4012:7350;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6577;4012:7351"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6577;4012:7352"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6577;4012:7352;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6577;4012:7353"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6577;4012:7353;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f564"
                        data-node="I4011:6577;4012:7380"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6577;4012:7381"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6577;4012:7382"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6577;4012:7382;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6577;4012:7383"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6577;4012:7383;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6577;4012:7384"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6577;4012:7385"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6577;4012:7385;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6577;4012:7386"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6577;4012:7386;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f565"
                        data-node="I4011:6577;4012:7413"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6577;4012:7414"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6577;4012:7415"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6577;4012:7415;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6577;4012:7416"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6577;4012:7416;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6577;4012:7417"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6577;4012:7418"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6577;4012:7418;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6577;4012:7419"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6577;4012:7419;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f566"
                        data-node="I4011:6577;4012:7446"
                        data-name="feedback-title"
                      >
                        <div
                          className="node f556"
                          data-node="I4011:6577;4012:7447"
                          data-name="session-title"
                        >
                          <div
                            className="node f552"
                            data-node="I4011:6577;4012:7448"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f551"
                              data-node="I4011:6577;4012:7448;93:8169"
                              data-name="left-indent-image"
                            >
                              <img
                                className="icon"
                                src="assets/icons/left-indent-image.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f555"
                            data-node="I4011:6577;4012:7449"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f554"
                              data-node="I4011:6577;4012:7449;88:1189"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "0px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f553">Feedback 1</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="node f561"
                          data-node="I4011:6577;4012:7450"
                          data-name="date-created"
                        >
                          <div
                            className="node f557"
                            data-node="I4011:6577;4012:7451"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I4011:6577;4012:7451;4008:2592"
                              data-name="icon-time"
                            >
                              <img
                                className="icon"
                                src="assets/icons/icon-time.svg"
                                alt=""
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div
                            className="node f560"
                            data-node="I4011:6577;4012:7452"
                            data-name="Body / Tiny"
                          >
                            <div
                              className="node f559"
                              data-node="I4011:6577;4012:7452;91:3019"
                              data-name="Body/9.6px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.265px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f558">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f569"
                        data-node="I4011:6577;4011:6319"
                        data-name="Body / Extra Small 12px"
                      >
                        <Link
                          className="node f568"
                          data-node="I4011:6577;4011:6319;88:1185"
                          data-name="Body/12px"
                          to="/project-feedback"
                          aria-label="project-feedback"
                        >
                          <span
                            className="text-content"
                            style={{
                              top: "-5.456px",
                              width: "calc(100% + 1px)",
                            }}
                          >
                            <span className="f567">See all</span>
                          </span>
                        </Link>
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
