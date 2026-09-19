import React from "react";
import { Link } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function ProjectFeedback() {
  const { records, projects } = useApp();
  return (
    <>
      <main
        className="source-frame"
        aria-label="Projects / Detail / Feedback"
        style={{ width: "1512px", height: "1644px" }}
      >
        <div
          className="node f581"
          data-node="93:11503"
          data-name="Projects / Detail / Feedback"
        >
          <div className="node f521" data-node="2001:3806" data-name="sidebar">
            <div
              className="node f379"
              data-node="2001:3807"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f375"
                data-node="I2001:3807;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f374"
                  data-node="I2001:3807;14:679;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f373"
                    data-node="I2001:3807;14:679;84:3230;84:2890"
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
                data-node="I2001:3807;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I2001:3807;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I2001:3807;14:682;84:3230;84:2890"
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
                data-node="I2001:3807;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I2001:3807;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I2001:3807;14:684;84:3230;84:2890"
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
                data-node="I2001:3807;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I2001:3807;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I2001:3807;8025:3809;84:3230;84:2890"
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
                data-node="I2001:3807;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f17"
                  data-node="I2001:3807;14:686;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f494"
                    data-node="I2001:3807;14:686;84:3330;84:2888"
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
                data-node="I2001:3807;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I2001:3807;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I2001:3807;14:688;84:3230;84:2890"
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
                data-node="I2001:3807;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I2001:3807;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I2001:3807;14:697;84:3230;84:2890"
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
          <div className="node f580" data-node="93:11506" data-name="main">
            <div className="node f381" data-node="93:11507" data-name="topbar">
              <Link
                className="node f168"
                data-node="I93:11507;73:1074"
                data-name="UI / Button"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f165"
                  data-node="I93:11507;73:1074;72:653"
                  data-name="UI / Icon"
                >
                  <div
                    className="node f164"
                    data-node="I93:11507;73:1074;72:653;65:8523"
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
                  data-node="I93:11507;73:1074;84:3616"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f166"
                    data-node="I93:11507;73:1074;84:3616;84:3427"
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
                data-node="I93:11507;4010:4273"
                data-name="UI / Model Bar"
              >
                <div
                  className="node f23"
                  data-node="I93:11507;4010:4273;73:1125"
                  data-name="UI / Status Badge"
                >
                  <div
                    className="node f22"
                    data-node="I93:11507;4010:4273;73:1125;65:8533"
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
                  data-node="I93:11507;4010:4273;84:3738"
                  data-name="Label Alternative / Small 10px"
                >
                  <div
                    className="node f25"
                    data-node="I93:11507;4010:4273;84:3738;84:3445"
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
              className="node f587"
              data-node="93:11508"
              data-name="UI / Header"
            >
              <div
                className="node f585"
                data-node="I93:11508;93:8702"
                data-name="header-title"
              >
                <div
                  className="node f230"
                  data-node="I93:11508;93:8703"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f229"
                    data-node="I93:11508;93:8703;84:3423"
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
                  className="node f584"
                  data-node="I93:11508;4007:4191"
                  data-name="title-body"
                >
                  <div
                    className="node f232"
                    data-node="I93:11508;93:8704"
                    data-name="Heading / H2 32px"
                  >
                    <div
                      className="node f231"
                      data-node="I93:11508;93:8704;84:1662"
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
                  <div
                    className="node f583"
                    data-node="I93:11508;4007:4161"
                    data-name="Body / Extra Small 12px"
                  >
                    <div
                      className="node f582"
                      data-node="I93:11508;4007:4161;88:1185"
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
              </div>
              <div
                className="node f238"
                data-node="I93:11508;4007:4453"
                data-name="Project / Toolbar"
              >
                <div
                  className="node f586"
                  data-node="I93:11508;4007:4453;93:8695"
                  data-name="toolbar-actions"
                >
                  <div
                    className="node f120"
                    data-node="I93:11508;4007:4453;93:8832"
                    data-name="Project / Toolbar Action"
                  >
                    <Link
                      className="node f119"
                      data-node="I93:11508;4007:4453;93:8832;93:8633"
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
                    className="node f122"
                    data-node="I93:11508;4007:4453;93:8687"
                    data-name="Project / Toolbar Action"
                  >
                    <div
                      className="node f121"
                      data-node="I93:11508;4007:4453;93:8687;93:8678"
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
                    className="node f124"
                    data-node="I93:11508;4007:4453;93:8688"
                    data-name="Project / Toolbar Action"
                  >
                    <div
                      className="node f123"
                      data-node="I93:11508;4007:4453;93:8688;93:8673"
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
              className="node f594"
              data-node="4011:5580"
              data-name="Navigation / Tabs"
            >
              <Link
                className="node f590"
                data-node="I4011:5580;31:1214"
                data-name="Navigation / Tab"
                to="/project-overview"
                aria-label="project-overview"
              >
                <div
                  className="node f589"
                  data-node="I4011:5580;31:1214;91:2362"
                  data-name="Label / Small 11px"
                >
                  <div
                    className="node f588"
                    data-node="I4011:5580;31:1214;91:2362;84:3858"
                    data-name="Label/11px"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f86">Overview</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f593"
                data-node="I4011:5580;31:1217"
                data-name="Navigation / Tab"
                to="/project-feedback"
                aria-label="project-feedback"
              >
                <div
                  className="node f592"
                  data-node="I4011:5580;31:1217;91:2345"
                  data-name="Label / Small 11px"
                >
                  <div
                    className="node f591"
                    data-node="I4011:5580;31:1217;91:2345;84:3860"
                    data-name="Label/11px"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f82">Feedback</span>
                    </span>
                  </div>
                </div>
              </Link>
              <div
                className="node f535"
                data-node="I4011:5580;4011:5690"
                data-name="Navigation / Tab"
              >
                <div
                  className="node f534"
                  data-node="I4011:5580;4011:5690;91:2362"
                  data-name="Label / Small 11px"
                >
                  <div
                    className="node f533"
                    data-node="I4011:5580;4011:5690;91:2362;84:3858"
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
              className="node f657"
              data-node="93:11510"
              data-name="project-data"
            >
              <div
                className="node f656"
                data-node="93:11521"
                data-name="feedback-grid"
              >
                <div
                  className="node f596"
                  data-node="93:11522"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11522;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f600"
                  data-node="93:11523"
                  data-name="grid-item"
                >
                  <div
                    className="node f597"
                    data-node="I93:11523;93:8476"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="node f599"
                    data-node="I93:11523;93:8483"
                    data-name="UI / Icon"
                  >
                    <div
                      className="node f598"
                      data-node="I93:11523;93:8483;93:8479"
                      data-name="view"
                    >
                      <img
                        className="icon"
                        src="assets/icons/view.svg"
                        alt=""
                        draggable="false"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f601"
                  data-node="93:11524"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11524;93:8478"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f602"
                  data-node="93:11525"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11525;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f603"
                  data-node="93:11526"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11526;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f604"
                  data-node="93:11527"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11527;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f605"
                  data-node="93:11528"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11528;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f606"
                  data-node="93:11529"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11529;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f607"
                  data-node="93:11530"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11530;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f608"
                  data-node="93:11531"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11531;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f609"
                  data-node="93:11532"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11532;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f610"
                  data-node="93:11533"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11533;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f611"
                  data-node="93:11534"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11534;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f612"
                  data-node="93:11535"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11535;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f613"
                  data-node="93:11536"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11536;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f614"
                  data-node="93:11537"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11537;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f615"
                  data-node="93:11538"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11538;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f616"
                  data-node="93:11539"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11539;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f617"
                  data-node="93:11540"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11540;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f618"
                  data-node="93:11541"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11541;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f619"
                  data-node="93:11542"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11542;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f620"
                  data-node="93:11543"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11543;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f621"
                  data-node="93:11544"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11544;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f622"
                  data-node="93:11545"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11545;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f623"
                  data-node="93:11546"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11546;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f624"
                  data-node="93:11547"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11547;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f625"
                  data-node="93:11548"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11548;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f626"
                  data-node="93:11549"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11549;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f627"
                  data-node="93:11550"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11550;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f628"
                  data-node="93:11551"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11551;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f629"
                  data-node="93:11552"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11552;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f630"
                  data-node="93:11553"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11553;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f631"
                  data-node="93:11554"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11554;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f632"
                  data-node="93:11555"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11555;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f633"
                  data-node="93:11556"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11556;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f634"
                  data-node="93:11557"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11557;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f635"
                  data-node="93:11558"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11558;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f636"
                  data-node="93:11559"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11559;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f637"
                  data-node="93:11560"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11560;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f638"
                  data-node="93:11561"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11561;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f639"
                  data-node="93:11562"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11562;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f640"
                  data-node="93:11563"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11563;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f641"
                  data-node="93:11564"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11564;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f642"
                  data-node="93:11565"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11565;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f643"
                  data-node="93:11566"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11566;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f644"
                  data-node="93:11567"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11567;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f645"
                  data-node="93:11568"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11568;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f646"
                  data-node="93:11569"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11569;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f647"
                  data-node="93:11570"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11570;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f648"
                  data-node="93:11571"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11571;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f649"
                  data-node="93:11572"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11572;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f650"
                  data-node="93:11573"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11573;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f651"
                  data-node="93:11574"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11574;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f652"
                  data-node="93:11575"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11575;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f653"
                  data-node="93:11576"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11576;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f654"
                  data-node="93:11577"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11577;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="node f655"
                  data-node="93:11578"
                  data-name="grid-item"
                >
                  <div
                    className="node f595"
                    data-node="I93:11578;93:8473"
                    data-name="image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "133.33333333333334%",
                          height: "100%",
                          left: "-16.666666666666668%",
                          top: "0%",
                        }}
                      />
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
