import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function CompareLibraryDetail() {
  const { records } = useApp();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const record = records.find(r => r.id === id);
  const images = record?.sourceImages || [];

  return (
    <>
      <main
        className="source-frame"
        aria-label="Compare / Saved Comparison Result"
        style={{ width: "1512px", height: "2660.444px" }}
      >
        <div
          className="node f372"
          data-node="8021:2789"
          data-name="03.Director / Compare / Result"
        >
          <div className="node f338" data-node="8025:4162" data-name="sidebar">
            <div
              className="node f20"
              data-node="8025:4163"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f3"
                data-node="I8025:4163;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f2"
                  data-node="I8025:4163;14:679;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f1"
                    data-node="I8025:4163;14:679;84:3330;84:2888"
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
                data-node="I8025:4163;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I8025:4163;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I8025:4163;14:682;84:3230;84:2890"
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
                data-node="I8025:4163;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I8025:4163;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I8025:4163;14:684;84:3230;84:2890"
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
                data-node="I8025:4163;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I8025:4163;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I8025:4163;8025:3809;84:3230;84:2890"
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
                data-node="I8025:4163;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f2"
                  data-node="I8025:4163;14:686;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:4163;14:686;84:3230;84:2890"
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
                data-node="I8025:4163;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I8025:4163;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I8025:4163;14:688;84:3230;84:2890"
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
                data-node="I8025:4163;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I8025:4163;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:4163;14:697;84:3230;84:2890"
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
          <div className="node f371" data-node="8021:2792" data-name="main">
            <div
              className="node f368"
              data-node="8021:2793"
              data-name="feedback-content"
            >
              <div
                className="node f28"
                data-node="8021:2794"
                data-name="topbar"
              >
                <div
                  className="node f27"
                  data-node="I8021:2794;4010:4232"
                  data-name="UI / Model Bar"
                >
                  <div
                    className="node f23"
                    data-node="I8021:2794;4010:4232;73:1125"
                    data-name="UI / Status Badge"
                  >
                    <div
                      className="node f22"
                      data-node="I8021:2794;4010:4232;73:1125;65:8533"
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
                    data-node="I8021:2794;4010:4232;84:3738"
                    data-name="Label Alternative / Small 10px"
                  >
                    <div
                      className="node f25"
                      data-node="I8021:2794;4010:4232;84:3738;84:3445"
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
                className="node f129"
                data-node="8021:2795"
                data-name="header"
              >
                <div
                  className="node f118"
                  data-node="I8021:2795;77:4531"
                  data-name="header-title"
                >
                  <div
                    className="node f115"
                    data-node="I8021:2795;84:3771"
                    data-name="Label Alternative / Medium 11px"
                  >
                    <div
                      className="node f114"
                      data-node="I8021:2795;84:3771;84:3423"
                      data-name="LABEL-ALT/MD/Regular/11px/19"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f29">
                          DIRECTOR / DARKROOM / COMPARE
                        </span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f117"
                    data-node="I8021:2795;84:2778"
                    data-name="Heading / H2 32px"
                  >
                    <div
                      className="node f116"
                      data-node="I8021:2795;84:2778;84:1662"
                      data-name="Heading/H2 /Semi-Bold/32px/37"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f32">Image Decision 34</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="node f128"
                  data-node="I8021:2795;93:8727"
                  data-name="Project / Toolbar"
                >
                  <Link
                    className="node f341"
                    data-node="I8021:2795;93:8727;93:8696"
                    data-name="UI / Button"
                    to="/compare-new"
                    aria-label="compare-new"
                  >
                    <div
                      className="node f340"
                      data-node="I8021:2795;93:8727;93:8696;84:3509"
                      data-name="Label Alternative / Medium 11px"
                    >
                      <div
                        className="node f339"
                        data-node="I8021:2795;93:8727;93:8696;84:3509;84:3427"
                        data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f68">ASK FOR NEW FEEDBACK</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className="node f367"
                data-node="8021:2796"
                data-name="feedback-panel"
              >
                <div
                  className="node f345"
                  data-node="I8021:2796;4015:3405"
                  data-name="file-box"
                >
                  <div
                    className="node f344"
                    data-node="I8021:2796;4015:3406"
                    data-name="Feedback / File"
                  >
                    <div
                      className="node f342"
                      data-node="I8021:2796;4015:3406;74:1830"
                      data-name="image.jpg"
                    ></div>
                    <div
                      className="node f343"
                      data-node="I8021:2796;4015:3406;74:1853"
                      data-name="image.jpg"
                    ></div>
                  </div>
                </div>
                <div
                  className="node f366"
                  data-node="I8021:2796;4015:3407"
                  data-name="feedback"
                >
                  <div
                    className="node f365"
                    data-node="I8021:2796;4015:3483"
                    data-name="feedback-meta"
                  >
                    <div
                      className="node f353"
                      data-node="I8021:2796;4015:3682"
                      data-name="Recommendations"
                    >
                      <div
                        className="node f350"
                        data-node="I8021:2796;4015:3683"
                        data-name="UI / Section Title"
                      >
                        <div
                          className="node f347"
                          data-node="I8021:2796;4015:3683;4013:2570"
                          data-name="form-label"
                        >
                          <div
                            className="node f346"
                            data-node="I8021:2796;4015:3683;4013:2570;84:3407"
                            data-name="LABEL-ALT/LG/Bold/13px/21"
                          >
                            <span
                              className="text-content"
                              style={{
                                top: "-6.551px",
                                width: "calc(100% + 1px)",
                              }}
                            >
                              <span className="f176">
                                Director Recommendations
                              </span>
                            </span>
                          </div>
                        </div>
                        <div
                          className="node f349"
                          data-node="I8021:2796;4015:3683;4013:2571"
                          data-name="UI / Divider / Horizontal"
                        >
                          <div
                            className="node f348"
                            data-node="I8021:2796;4015:3683;4013:2571;81:4903"
                            data-name="Line 1"
                          ></div>
                        </div>
                      </div>
                      <div
                        className="node f351"
                        data-node="I8021:2796;4015:3757"
                        data-name="reply"
                      >
                        <div
                          className="node f304"
                          data-node="I8021:2796;4015:3757;73:1572"
                          data-name="form-text"
                        >
                          <div
                            className="node f132"
                            data-node="I8021:2796;4015:3757;47:619"
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
                            data-node="I8021:2796;4015:3757;47:620"
                            data-name="output text"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f59">
                                1. **First impression:** A quiet, sun-drenched
                                snapshot of domestic stillness. The bright
                                yellow laundry immediately draws the eye, while
                                the empty wooden chair and long shadows evoke a
                                sense of absence and pause. It feels observed
                                rather than staged, with a gentle, contemplative
                                mood. 2. **What works:** The strong color
                                contrast of the yellow garments against the
                                white siding creates an immediate visual anchor.
                                The interplay of light and shadow adds texture
                                and depth, especially on the brick column and
                                concrete porch. The empty chair introduces a
                                subtle narrative of waiting or absence without
                                being heavy-handed. 3. **What feels weak or
                                unresolved:** The left-side windows are dark and
                                visually heavy, pulling focus away from the
                                central subjects. The AC unit feels slightly
                                intrusive and breaks the clean lines of the
                                composition. The foreground grass is a bit
                                overgrown and distracts from the porch area,
                                making the base of the frame feel slightly
                                uncontrolled. 10. **Tags:** domestic
                                photography, still life, quiet moment, shadows
                                and light, laundry line, empty chair, American
                                house, observational photography, natural light,
                                architectural detail, absence and presence.
                                Thanks for sharing this—there’s a really quiet
                                power in how the yellow laundry and empty chair
                                hold the space together. If you’re building a
                                series around domestic stillness, this could
                                anchor it beautifully. Let me know if you want
                                to tweak the crop or explore tonal adjustments
                                together.
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f352"
                        data-node="I8021:2796;4015:3684"
                        data-name="Compare / Recommendation"
                      >
                        {images.map((img: string, i: number) => (
                          <div
                            key={i}
                            className="node f319"
                            data-node="I8021:2796;4015:3684;4015:2625"
                            data-name="Compare / Results"
                          >
                            <div
                              className="node f318"
                              data-node="I8021:2796;4015:3684;4015:2625;4015:2572"
                              data-name={i === 0 ? "compare-card-active" : "compare-card-disabled"}
                            >
                              {i === 0 && (
                                <div
                                  className="node f310"
                                  data-node="I8021:2796;4015:3684;4015:2625;4015:2572;4015:2530"
                                  data-name="Label Alternative / Small 10px"
                                >
                                  <div
                                    className="node f309"
                                    data-node="I8021:2796;4015:3684;4015:2625;4015:2572;4015:2530;84:3449"
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
                                data-node="I8021:2796;4015:3684;4015:2625;4015:2572;4015:2531"
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
                                data-node="I8021:2796;4015:3684;4015:2625;4015:2572;4015:2589"
                                data-name="title-caption"
                              >
                                <div
                                  className="node f314"
                                  data-node="I8021:2796;4015:3684;4015:2625;4015:2572;4015:2532"
                                  data-name="Label Alternative / Extra Large 15px"
                                >
                                  <div
                                    className="node f313"
                                    data-node="I8021:2796;4015:3684;4015:2625;4015:2572;4015:2532;84:3389"
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
                                  data-node="I8021:2796;4015:3684;4015:2625;4015:2572;4015:2533"
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
                    <div
                      className="node f356"
                      data-node="I8021:2796;4015:3484"
                      data-name="metadata-primary"
                    >
                      <div
                        className="node f354"
                        data-node="I8021:2796;4015:3485"
                        data-name="meta-box"
                      >
                        <div
                          className="node f181"
                          data-node="I8021:2796;4015:3486"
                          data-name="UI / Section Title"
                        >
                          <div
                            className="node f178"
                            data-node="I8021:2796;4015:3486;4013:2570"
                            data-name="form-label"
                          >
                            <div
                              className="node f177"
                              data-node="I8021:2796;4015:3486;4013:2570;84:3407"
                              data-name="LABEL-ALT/LG/Bold/13px/21"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.551px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f176">DATE CREATED</span>
                              </span>
                            </div>
                          </div>
                          <div
                            className="node f196"
                            data-node="I8021:2796;4015:3486;4013:2571"
                            data-name="UI / Divider / Horizontal"
                          >
                            <div
                              className="node f179"
                              data-node="I8021:2796;4015:3486;4013:2571;81:4903"
                              data-name="Line 1"
                            ></div>
                          </div>
                        </div>
                        <div
                          className="node f187"
                          data-node="I8021:2796;4015:3487"
                          data-name="date-created"
                        >
                          <div
                            className="node f183"
                            data-node="I8021:2796;4015:3488"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f182"
                              data-node="I8021:2796;4015:3488;4008:2592"
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
                            className="node f186"
                            data-node="I8021:2796;4015:3489"
                            data-name="Body / Extra Small 12px"
                          >
                            <div
                              className="node f185"
                              data-node="I8021:2796;4015:3489;88:1185"
                              data-name="Body/12px"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-5.456px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f184">06 Sept 2026</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f355"
                        data-node="I8021:2796;4015:3490"
                        data-name="meta-box"
                      >
                        <div
                          className="node f181"
                          data-node="I8021:2796;4015:3491"
                          data-name="UI / Section Title"
                        >
                          <div
                            className="node f190"
                            data-node="I8021:2796;4015:3491;4013:2570"
                            data-name="form-label"
                          >
                            <div
                              className="node f189"
                              data-node="I8021:2796;4015:3491;4013:2570;84:3407"
                              data-name="LABEL-ALT/LG/Bold/13px/21"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.551px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f176">SOURCE TYPE</span>
                              </span>
                            </div>
                          </div>
                          <div
                            className="node f196"
                            data-node="I8021:2796;4015:3491;4013:2571"
                            data-name="UI / Divider / Horizontal"
                          >
                            <div
                              className="node f179"
                              data-node="I8021:2796;4015:3491;4013:2571;81:4903"
                              data-name="Line 1"
                            ></div>
                          </div>
                        </div>
                        <div
                          className="node f194"
                          data-node="I8021:2796;4015:3492"
                          data-name="UI / Category Badge"
                        >
                          <div
                            className="node f193"
                            data-node="I8021:2796;4015:3492;4009:3503"
                            data-name="Label Alternative / Extra Small 9.6px"
                          >
                            <div
                              className="node f192"
                              data-node="I8021:2796;4015:3492;4009:3503;84:3471"
                              data-name="LABEL-ALT/XS/Semi-Bold/9.6px/12"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-2.448px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f191">PHOTOGRAPHY</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="node f359"
                      data-node="I8021:2796;4015:3500"
                      data-name="meta-box"
                    >
                      <div
                        className="node f350"
                        data-node="I8021:2796;4015:3501"
                        data-name="UI / Section Title"
                      >
                        <div
                          className="node f190"
                          data-node="I8021:2796;4015:3501;4013:2570"
                          data-name="form-label"
                        >
                          <div
                            className="node f189"
                            data-node="I8021:2796;4015:3501;4013:2570;84:3407"
                            data-name="LABEL-ALT/LG/Bold/13px/21"
                          >
                            <span
                              className="text-content"
                              style={{
                                top: "-6.551px",
                                width: "calc(100% + 1px)",
                              }}
                            >
                              <span className="f176">PROMPT USED</span>
                            </span>
                          </div>
                        </div>
                        <div
                          className="node f349"
                          data-node="I8021:2796;4015:3501;4013:2571"
                          data-name="UI / Divider / Horizontal"
                        >
                          <div
                            className="node f348"
                            data-node="I8021:2796;4015:3501;4013:2571;81:4903"
                            data-name="Line 1"
                          ></div>
                        </div>
                      </div>
                      <div
                        className="node f358"
                        data-node="I8021:2796;4015:3502"
                        data-name="form-label"
                      >
                        <div
                          className="node f357"
                          data-node="I8021:2796;4015:3502;88:1163"
                          data-name="Body/13px"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f51">
                              {record?.prompt || "Review this photograph.  Respond with: 1. First impression 2. What works 3. What feels weak or unresolved 4. Composition / gesture / timing 5. Light, colour, contrast, or tonal notes 6. Crop or edit suggestion 7. Print potential 8. Possible series connection 9. Three possible titles 10. Tags  Finish with one short human note to Diego."}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="node f364"
                      data-node="I8021:2796;4015:3493"
                      data-name="metadata-secondary"
                    >
                      <div
                        className="node f355"
                        data-node="I8021:2796;4015:3490"
                        data-name="meta-box"
                      >
                        <div
                          className="node f181"
                          data-node="I8021:2796;4015:3491"
                          data-name="UI / Section Title"
                        >
                          <div
                            className="node f190"
                            data-node="I8021:2796;4015:3491;4013:2570"
                            data-name="form-label"
                          >
                            <div
                              className="node f189"
                              data-node="I8021:2796;4015:3491;4013:2570;84:3407"
                              data-name="LABEL-ALT/LG/Bold/13px/21"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.551px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f188">Model used</span>
                              </span>
                            </div>
                          </div>
                          <div
                            className="node f191"
                            data-node="I8021:2796;4015:3491;4013:2572"
                            data-name="Label / Medium 12px"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f51">{record?.model || "gpt-4o-mini"}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f356"
                        data-node="I8021:2796;4015:3492"
                        data-name="meta-box"
                      >
                        <div
                          className="node f181"
                          data-node="I8021:2796;4015:3493"
                          data-name="UI / Section Title"
                        >
                          <div
                            className="node f190"
                            data-node="I8021:2796;4015:3493;4013:2570"
                            data-name="form-label"
                          >
                            <div
                              className="node f189"
                              data-node="I8021:2796;4015:3493;4013:2570;84:3407"
                              data-name="LABEL-ALT/LG/Bold/13px/21"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.551px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f188">Project link</span>
                              </span>
                            </div>
                          </div>
                          <div
                            className="node f196"
                            data-node="I8021:2796;4015:3493;4013:2571"
                            data-name="UI / Divider / Horizontal"
                          >
                            <div
                              className="node f179"
                              data-node="I8021:2796;4015:3493;4013:2571;81:4903"
                              data-name="Line 1"
                            ></div>
                          </div>
                        </div>
                        <div
                          className="node f191"
                          data-node="I8021:2796;4015:3493;4013:2572"
                          data-name="Label / Medium 12px"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f180">Fashion Edit</span>
                          </span>
                        </div>
                      </div>
                      <div
                        className="node f362"
                        data-node="I8021:2796;4015:3494"
                        data-name="meta-box"
                      >
                        <div
                          className="node f181"
                          data-node="I8021:2796;4015:3495"
                          data-name="UI / Section Title"
                        >
                          <div
                            className="node f190"
                            data-node="I8021:2796;4015:3495;4013:2570"
                            data-name="form-label"
                          >
                            <div
                              className="node f189"
                              data-node="I8021:2796;4015:3495;4013:2570;84:3407"
                              data-name="LABEL-ALT/LG/Bold/13px/21"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.551px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f188">Prompt applied</span>
                              </span>
                            </div>
                          </div>
                          <div
                            className="node f196"
                            data-node="I8021:2796;4015:3495;4013:2571"
                            data-name="UI / Divider / Horizontal"
                          >
                            <div
                              className="node f179"
                              data-node="I8021:2796;4015:3495;4013:2571;81:4903"
                              data-name="Line 1"
                            ></div>
                          </div>
                        </div>
                        <div
                          className="node f203"
                          data-node="I8021:2796;4015:3496"
                          data-name="form-label"
                        >
                          <div
                            className="node f202"
                            data-node="I8021:2796;4015:3496;88:1163"
                            data-name="Body/13px"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f51">GEMMA-4</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="node f363"
                        data-node="I8021:2796;4015:3497"
                        data-name="meta-box"
                      >
                        <div
                          className="node f181"
                          data-node="I8021:2796;4015:3498"
                          data-name="UI / Section Title"
                        >
                          <div
                            className="node f206"
                            data-node="I8021:2796;4015:3498;4013:2570"
                            data-name="form-label"
                          >
                            <div
                              className="node f205"
                              data-node="I8021:2796;4015:3498;4013:2570;84:3407"
                              data-name="LABEL-ALT/LG/Bold/13px/21"
                            >
                              <span
                                className="text-content"
                                style={{
                                  top: "-6.551px",
                                  width: "calc(100% + 1px)",
                                }}
                              >
                                <span className="f176">PROJECT</span>
                              </span>
                            </div>
                          </div>
                          <div
                            className="node f196"
                            data-node="I8021:2796;4015:3498;4013:2571"
                            data-name="UI / Divider / Horizontal"
                          >
                            <div
                              className="node f179"
                              data-node="I8021:2796;4015:3498;4013:2571;81:4903"
                              data-name="Line 1"
                            ></div>
                          </div>
                        </div>
                        <div
                          className="node f362"
                          data-node="I8021:2796;4015:3499"
                          data-name="prompt-selector"
                        >
                          <div
                            className="node f52"
                            data-node="I8021:2796;4015:3499;1:5105"
                            data-name="Photography"
                          >
                            <span
                              className="text-content"
                              style={{ top: "0px", width: "calc(100% + 1px)" }}
                            >
                              <span className="f51">Street photography</span>
                            </span>
                          </div>
                          <div
                            className="node f361"
                            data-node="I8021:2796;4015:3499;73:1190"
                            data-name="UI / Icon"
                          >
                            <div
                              className="node f53"
                              data-node="I8021:2796;4015:3499;73:1190;65:8507"
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
                  </div>
                </div>
              </div>
            </div>
            <div
              className="node f369"
              data-node="8021:2797"
              data-name="prompt-section"
            >
              <div
                className="node f138"
                data-node="I8021:2797;74:1702"
                data-name="top-bar"
              >
                <div
                  className="node f137"
                  data-node="I8021:2797;84:2903"
                  data-name="H5"
                >
                  <div
                    className="node f136"
                    data-node="I8021:2797;84:2903;84:2888"
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
                className="node f222"
                data-node="I8021:2797;4002:1699"
                data-name="Prompt / Editor"
              >
                <div
                  className="node f221"
                  data-node="I8021:2797;4002:1699;4002:1567"
                  data-name="prompt-textarea-group"
                >
                  <div
                    className="node f219"
                    data-node="I8021:2797;4002:1699;4002:1568"
                    data-name="prompt-text-row"
                  >
                    <div
                      className="node f218"
                      data-node="I8021:2797;4002:1699;4002:1569"
                      data-name="prompt-text"
                    >
                      <div
                        className="node f217"
                        data-node="I8021:2797;4002:1699;4002:1569;88:1108"
                        data-name="Body/14px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f139">
                            Review this photograph as a creative director and
                            photography editor. Cover: first impression; what
                            works; what feels weak or unresolved; composition,
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f220"
                    data-node="I8021:2797;4002:1699;4002:1571"
                    data-name="prompt-metadata-bar"
                  >
                    <div
                      className="node f144"
                      data-node="I8021:2797;4002:1699;4002:1572"
                      data-name="add-files"
                    >
                      <div
                        className="node f143"
                        data-node="I8021:2797;4002:1699;4002:1572;65:8500"
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
                      className="node f149"
                      data-node="I8021:2797;4002:1699;4002:1574"
                      data-name="Prompt / Model Selector"
                    >
                      <div
                        className="node f147"
                        data-node="I8021:2797;4002:1699;4002:1574;4002:1900"
                        data-name="Label Alternative / Small 10px"
                      >
                        <div
                          className="node f146"
                          data-node="I8021:2797;4002:1699;4002:1574;4002:1900;84:3449"
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
                        className="node f148"
                        data-node="I8021:2797;4002:1699;4002:1574;73:1550"
                        data-name="UI / Icon"
                      >
                        <div
                          className="node f53"
                          data-node="I8021:2797;4002:1699;4002:1574;73:1550;65:8507"
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
                      data-node="I8021:2797;4002:1699;4002:1694"
                      data-name="enter-button"
                    >
                      <div
                        className="node f151"
                        data-node="I8021:2797;4002:1699;4002:1694;73:1199"
                        data-name="UI / Icon"
                      >
                        <div
                          className="node f150"
                          data-node="I8021:2797;4002:1699;4002:1694;73:1199;65:8518"
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
              className="node f370"
              data-node="8021:2798"
              data-name="save-button"
            >
              <div
                className="node f159"
                data-node="8021:2799"
                data-name="UI / Button"
              >
                <div
                  className="node f224"
                  data-node="I8021:2799;84:3509"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f130"
                    data-node="I8021:2799;84:3509;84:3427"
                    data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f68">UPDATE FEEDBACK</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

      </main>
    </>
  );
}
