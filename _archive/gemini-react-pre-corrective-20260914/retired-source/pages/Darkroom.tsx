import React from "react";
import { Link } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function Darkroom() {
  const { records } = useApp();
  const items = records.filter(r => r.type === 'feedback');
  return (
    <>
      <main
        className="source-frame"
        aria-label="Darkroom / Library"
        style={{ width: "1512px", height: "2069.924px" }}
      >
        <div
          className="node f449"
          data-node="93:10790"
          data-name="1. Darkroom / Library"
        >
          <div className="node f380" data-node="93:10791" data-name="sidebar">
            <div
              className="node f379"
              data-node="93:10792"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f375"
                data-node="I93:10792;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f374"
                  data-node="I93:10792;14:679;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f373"
                    data-node="I93:10792;14:679;84:3230;84:2890"
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
                data-node="I93:10792;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I93:10792;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I93:10792;14:682;84:3230;84:2890"
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
                className="node f378"
                data-node="I93:10792;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f377"
                  data-node="I93:10792;14:684;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f376"
                    data-node="I93:10792;14:684;84:3330;84:2888"
                    data-name="Heading/H5/Bold/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f0">Darkroom</span>
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                className="node f13"
                data-node="I93:10792;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I93:10792;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I93:10792;8025:3809;84:3230;84:2890"
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
                data-node="I93:10792;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f2"
                  data-node="I93:10792;14:686;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I93:10792;14:686;84:3230;84:2890"
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
                data-node="I93:10792;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I93:10792;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I93:10792;14:688;84:3230;84:2890"
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
                data-node="I93:10792;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I93:10792;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I93:10792;14:697;84:3230;84:2890"
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
          <div className="node f448" data-node="93:10793" data-name="main">
            <div className="node f381" data-node="93:10794" data-name="topbar">
              <div
                className="node f27"
                data-node="I93:10794;4010:4232"
                data-name="UI / Model Bar"
              >
                <div
                  className="node f23"
                  data-node="I93:10794;4010:4232;73:1125"
                  data-name="UI / Status Badge"
                >
                  <div
                    className="node f22"
                    data-node="I93:10794;4010:4232;73:1125;65:8533"
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
                  data-node="I93:10794;4010:4232;84:3738"
                  data-name="Label Alternative / Small 10px"
                >
                  <div
                    className="node f25"
                    data-node="I93:10794;4010:4232;84:3738;84:3445"
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
            <div className="node f384" data-node="93:10795" data-name=" header">
              <div
                className="node f118"
                data-node="I93:10795;77:4531"
                data-name="header-title"
              >
                <div
                  className="node f115"
                  data-node="I93:10795;84:3771"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f114"
                    data-node="I93:10795;84:3771;84:3423"
                    data-name="LABEL-ALT/MD/Regular/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f29">DIRECTOR / DARKROOM</span>
                    </span>
                  </div>
                </div>
                <div
                  className="node f117"
                  data-node="I93:10795;84:2778"
                  data-name="Heading / H2 32px"
                >
                  <div
                    className="node f116"
                    data-node="I93:10795;84:2778;84:1662"
                    data-name="Heading/H2 /Semi-Bold/32px/37"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f32">Darkroom Feedback</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f128"
                data-node="I93:10795;93:8727"
                data-name="Project / Toolbar"
              >
                <Link
                  className="node f127"
                  data-node="I93:10795;93:8727;93:8696"
                  data-name="UI / Button"
                  to="/feedback-new"
                  aria-label="feedback-new"
                >
                  <div
                    className="node f383"
                    data-node="I93:10795;93:8727;93:8696;84:3509"
                    data-name="Label Alternative / Medium 11px"
                  >
                    <div
                      className="node f382"
                      data-node="I93:10795;93:8727;93:8696;84:3509;84:3427"
                      data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f68">ADD NEW FEEDBACK</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div
              className="node f385"
              data-node="93:10796"
              data-name="Body / Extra Small 12px"
            >
              <div
                className="node f36"
                data-node="I93:10796;88:1185"
                data-name="Body/12px"
              >
                <span
                  className="text-content"
                  style={{ top: "-5.456px", width: "calc(100% + 1px)" }}
                >
                  <span className="f35">
                    Saved photography feedback and comparisons.
                  </span>
                </span>
              </div>
            </div>
            <div
              className="node f447"
              data-node="93:10797"
              data-name="project-data"
            >
              <div
                className="node f446"
                data-node="93:10808"
                data-name="feedback-list"
              >
                {items.map((item, index) => (
<Link key={item.id || index}
                  className="node f403"
                  data-node="4010:5467"
                  data-name="UI / File Thumb"
                  to={`/darkroom-detail`}
                  aria-label="darkroom-quick"
                >
                  <div
                    className="node f386"
                    data-node="I4010:5467;93:8205"
                    data-name="UI / Image"
                  >
                    <div className="image-clip">
                      <img
                        className="source-image"
                        alt=""
                        draggable="false"
                        src="assets/images/download-93-10140-0.jpeg"
                        style={{
                          width: "102.88065843621399%",
                          height: "112.35955056179775%",
                          left: "0.205761316872428%",
                          top: "-6.292134831460674%",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="node f389"
                    data-node="I4010:5467;93:8207"
                    data-name="Label / Medium 13px"
                  >
                    <div
                      className="node f388"
                      data-node="I4010:5467;93:8207;84:3844"
                      data-name="Label/13px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f387">{item.title}</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f397"
                    data-node="I4010:5467;4009:3939"
                    data-name="badges"
                  >
                    <div
                      className="node f392"
                      data-node="I4010:5467;4009:3510"
                      data-name="UI / Category Badge"
                    >
                      <div
                        className="node f391"
                        data-node="I4010:5467;4009:3510;4009:3503"
                        data-name="Label Alternative / Extra Small 9.6px"
                      >
                        <div
                          className="node f390"
                          data-node="I4010:5467;4009:3510;4009:3503;84:3471"
                          data-name="LABEL-ALT/XS/Semi-Bold/9.6px/12"
                        >
                          <span
                            className="text-content"
                            style={{
                              top: "-2.448px",
                              width: "calc(100% + 1px)",
                            }}
                          >
                            <span className="f191">FOTO</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="node f396"
                      data-node="I4010:5467;4009:3784"
                      data-name="UI / Category Badge"
                    >
                      <div
                        className="node f395"
                        data-node="I4010:5467;4009:3784;4010:4315"
                        data-name="Label Alternative / Extra Small 9.6px"
                      >
                        <div
                          className="node f394"
                          data-node="I4010:5467;4009:3784;4010:4315;84:3471"
                          data-name="LABEL-ALT/XS/Semi-Bold/9.6px/12"
                        >
                          <span
                            className="text-content"
                            style={{
                              top: "-2.448px",
                              width: "calc(100% + 1px)",
                            }}
                          >
                            <span className="f393">FEEDBACK</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f402"
                    data-node="I4010:5467;4008:2981"
                    data-name="date-created"
                  >
                    <div
                      className="node f398"
                      data-node="I4010:5467;4008:2982"
                      data-name="UI / Icon"
                    >
                      <div
                        className="node f182"
                        data-node="I4010:5467;4008:2982;4008:2592"
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
                      className="node f401"
                      data-node="I4010:5467;4008:2983"
                      data-name="Body / Tiny"
                    >
                      <div
                        className="node f400"
                        data-node="I4010:5467;4008:2983;91:3019"
                        data-name="Body/9.6px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-6.265px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f399">{item.date}</span>
                        </span>
                      </div>
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
