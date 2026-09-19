import React from "react";
import { Link } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function CompareLibrary() {
  const { records, deleteRecord } = useApp();
  const compareRecords = records.filter(r => r.type === 'compare');

  return (
    <>
      <main
        className="source-frame"
        aria-label="Compare / Library"
        style={{ width: "1512px", height: "734.75px" }}
      >
        <div
          className="node f493"
          data-node="8025:4252"
          data-name="1. Compare / Library"
        >
          <div className="node f473" data-node="8025:5063" data-name="sidebar">
            <div
              className="node f379"
              data-node="8025:5064"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f375"
                data-node="I8025:5064;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f374"
                  data-node="I8025:5064;14:679;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f373"
                    data-node="I8025:5064;14:679;84:3230;84:2890"
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
                data-node="I8025:5064;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I8025:5064;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I8025:5064;14:682;84:3230;84:2890"
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
                data-node="I8025:5064;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I8025:5064;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I8025:5064;14:684;84:3230;84:2890"
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
                data-node="I8025:5064;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I8025:5064;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I8025:5064;8025:3809;84:3230;84:2890"
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
                data-node="I8025:5064;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f2"
                  data-node="I8025:5064;14:686;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:5064;14:686;84:3230;84:2890"
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
                data-node="I8025:5064;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I8025:5064;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I8025:5064;14:688;84:3230;84:2890"
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
                data-node="I8025:5064;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I8025:5064;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:5064;14:697;84:3230;84:2890"
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
          <div className="node f492" data-node="8025:4255" data-name="main">
            <div className="node f381" data-node="8025:4256" data-name="topbar">
              <div
                className="node f27"
                data-node="I8025:4256;4010:4232"
                data-name="UI / Model Bar"
              >
                <div
                  className="node f23"
                  data-node="I8025:4256;4010:4232;73:1125"
                  data-name="UI / Status Badge"
                >
                  <div
                    className="node f22"
                    data-node="I8025:4256;4010:4232;73:1125;65:8533"
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
                  data-node="I8025:4256;4010:4232;84:3738"
                  data-name="Label Alternative / Small 10px"
                >
                  <div
                    className="node f25"
                    data-node="I8025:4256;4010:4232;84:3738;84:3445"
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
              data-node="8025:4257"
              data-name=" header"
            >
              <div
                className="node f118"
                data-node="I8025:4257;77:4531"
                data-name="header-title"
              >
                <div
                  className="node f115"
                  data-node="I8025:4257;84:3771"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f114"
                    data-node="I8025:4257;84:3771;84:3423"
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
                  data-node="I8025:4257;84:2778"
                  data-name="Heading / H2 32px"
                >
                  <div
                    className="node f116"
                    data-node="I8025:4257;84:2778;84:1662"
                    data-name="Heading/H2 /Semi-Bold/32px/37"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f32">Compare Library</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f128"
                data-node="I8025:4257;93:8727"
                data-name="Project / Toolbar"
              >
                <Link
                  className="node f127"
                  data-node="I8025:4257;93:8727;93:8696"
                  data-name="UI / Button"
                  to="/compare-new"
                  aria-label="compare-new"
                >
                  <div
                    className="node f475"
                    data-node="I8025:4257;93:8727;93:8696;84:3509"
                    data-name="Label Alternative / Medium 11px"
                  >
                    <div
                      className="node f474"
                      data-node="I8025:4257;93:8727;93:8696;84:3509;84:3427"
                      data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f68">ADD NEW</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div
              className="node f385"
              data-node="8025:4258"
              data-name="Body / Extra Small 12px"
            >
              <div
                className="node f36"
                data-node="I8025:4258;88:1185"
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
              className="node f491"
              data-node="8025:4259"
              data-name="project-data"
            >
              {compareRecords.map(r => (
                <div
                  key={r.id}
                  className="node f484"
                  data-node="8025:5380"
                  data-name="UI / List Item"
                >
                  <div
                    className="node f478"
                    data-node="I8025:5380;93:9107"
                    data-name="Label / Large 13px"
                  >
                    <Link
                      className="node f477"
                      data-node="I8025:5380;93:9107;84:3842"
                      data-name="Label/13px"
                      to={`/compare-library-detail?id=${r.id}`}
                      aria-label="compare-library-detail"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f476">
                          {r.title || r.prompt || 'Untitled Compare'}
                        </span>
                      </span>
                    </Link>
                  </div>
                  <div
                    className="node f483"
                    data-node="I8025:5380;93:9114"
                    data-name="toolbar"
                  >
                    <div
                      className="node f480"
                      data-node="I8025:5380;93:9110"
                      data-name="UI / Icon"
                    >
                      <div
                        className="node f479"
                        data-node="I8025:5380;93:9110;72:518"
                        data-name="pencil"
                      >
                        <img
                          className="icon"
                          src="assets/icons/pencil.svg"
                          alt=""
                          draggable="false"
                        />
                      </div>
                    </div>
                    <div
                      className="node f482"
                      data-node="I8025:5380;93:9104"
                      data-name="UI / Icon"
                      style={{ cursor: 'pointer' }}
                      onClick={() => deleteRecord(r.id)}
                    >
                      <div
                        className="node f481"
                        data-node="I8025:5380;93:9104;66:518"
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
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
