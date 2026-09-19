import React from "react";
import { Link } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function Projects() {
  const { projects } = useApp();
  const items = projects;
  return (
    <>
      <main
        className="source-frame"
        aria-label="Projects / Library"
        style={{ width: "1512px", height: "989.75px" }}
      >
        <div
          className="node f520"
          data-node="93:11329"
          data-name="Projects / Legacy / Darkroom"
        >
          <div className="node f496" data-node="93:11330" data-name="sidebar">
            <div
              className="node f379"
              data-node="93:11331"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f375"
                data-node="I93:11331;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f374"
                  data-node="I93:11331;14:679;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f373"
                    data-node="I93:11331;14:679;84:3230;84:2890"
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
                data-node="I93:11331;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I93:11331;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I93:11331;14:682;84:3230;84:2890"
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
                data-node="I93:11331;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I93:11331;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I93:11331;14:684;84:3230;84:2890"
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
                data-node="I93:11331;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I93:11331;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I93:11331;8025:3809;84:3230;84:2890"
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
                data-node="I93:11331;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f17"
                  data-node="I93:11331;14:686;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f494"
                    data-node="I93:11331;14:686;84:3330;84:2888"
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
                data-node="I93:11331;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I93:11331;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I93:11331;14:688;84:3230;84:2890"
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
                data-node="I93:11331;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I93:11331;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I93:11331;14:697;84:3230;84:2890"
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
          <div className="node f519" data-node="93:11332" data-name="main">
            <div className="node f381" data-node="93:11333" data-name="topbar">
              <div
                className="node f168"
                data-node="I93:11333;73:1074"
                data-name="UI / Button"
              >
                <div
                  className="node f165"
                  data-node="I93:11333;73:1074;72:653"
                  data-name="UI / Icon"
                >
                  <div
                    className="node f164"
                    data-node="I93:11333;73:1074;72:653;65:8523"
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
                  data-node="I93:11333;73:1074;84:3616"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f166"
                    data-node="I93:11333;73:1074;84:3616;84:3427"
                    data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f68">BACK TO PREVIOUS</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f27"
                data-node="I93:11333;4010:4273"
                data-name="UI / Model Bar"
              >
                <div
                  className="node f23"
                  data-node="I93:11333;4010:4273;73:1125"
                  data-name="UI / Status Badge"
                >
                  <div
                    className="node f22"
                    data-node="I93:11333;4010:4273;73:1125;65:8533"
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
                  data-node="I93:11333;4010:4273;84:3738"
                  data-name="Label Alternative / Small 10px"
                >
                  <div
                    className="node f25"
                    data-node="I93:11333;4010:4273;84:3738;84:3445"
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
              data-node="93:11334"
              data-name="UI / Header"
            >
              <div
                className="node f118"
                data-node="I93:11334;77:4531"
                data-name="header-title"
              >
                <div
                  className="node f115"
                  data-node="I93:11334;84:3771"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f114"
                    data-node="I93:11334;84:3771;84:3423"
                    data-name="LABEL-ALT/MD/Regular/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f29">DIRECTOR / PROJECTS</span>
                    </span>
                  </div>
                </div>
                <div
                  className="node f117"
                  data-node="I93:11334;84:2778"
                  data-name="Heading / H2 32px"
                >
                  <div
                    className="node f116"
                    data-node="I93:11334;84:2778;84:1662"
                    data-name="Heading/H2 /Semi-Bold/32px/37"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f32">Projects</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f128"
                data-node="I93:11334;93:8727"
                data-name="Project / Toolbar"
              >
                <Link
                  className="node f127"
                  data-node="I93:11334;93:8727;93:8696"
                  data-name="UI / Button"
                  to="/project-settings"
                  aria-label="project-settings"
                >
                  <div
                    className="node f224"
                    data-node="I93:11334;93:8727;93:8696;84:3509"
                    data-name="Label Alternative / Medium 11px"
                  >
                    <div
                      className="node f130"
                      data-node="I93:11334;93:8727;93:8696;84:3509;84:3427"
                      data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f68">ADD NEW PROJECT</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div
              className="node f518"
              data-node="93:11335"
              data-name="project-data"
            >
              <div
                className="node f517"
                data-node="93:11337"
                data-name="project-grid"
              >
                {items.map((item, index) => (
<Link key={item.id || index}
                  className="node f507"
                  data-node="93:11338"
                  data-name="UI / Card"
                  to={`/project-overview`}
                  aria-label="project-overview"
                >
                  <div
                    className="node f502"
                    data-node="I93:11338;91:4069"
                    data-name="header"
                  >
                    <div
                      className="node f499"
                      data-node="I93:11338;84:2806"
                      data-name="H4"
                    >
                      <div
                        className="node f498"
                        data-node="I93:11338;84:2806;84:1714"
                        data-name="H4/20px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f497">{item.title}</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className="node f501"
                      data-node="I93:11338;91:4048"
                      data-name="UI / Icon"
                    >
                      <div
                        className="node f500"
                        data-node="I93:11338;91:4048;91:4024"
                        data-name="three-dots"
                      >
                        <img
                          className="icon"
                          src="assets/icons/three-dots.svg"
                          alt=""
                          draggable="false"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f504"
                    data-node="I93:11338;91:2498"
                    data-name="Body / Small"
                  >
                    <div
                      className="node f503"
                      data-node="I93:11338;91:2498;88:1185"
                      data-name="Body/12px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.456px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f35">{item.description}</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f506"
                    data-node="I93:11338;4009:3745"
                    data-name="UI / Button"
                  >
                    <div
                      className="node f505"
                      data-node="I93:11338;4009:3745;84:3602"
                      data-name="VIEW FEEDBACK"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-2.448px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f464">VIEW PROJECT</span>
                      </span>
                    </div>
                  </div>
                </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
