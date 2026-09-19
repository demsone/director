import React from "react";
import { Link } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function SettingsAppearance() {
  const { theme, accent, updateSettings } = useApp();
  return (
    <>
      <main
        className="source-frame"
        aria-label="Settings / Appearance"
        style={{ width: "1512px", height: "1321px" }}
      >
        <div
          className="node f95"
          data-node="4016:4128"
          data-name="Settings / Appearance"
        >
          <div className="node f21" data-node="4016:4129" data-name="sidebar">
            <div
              className="node f20"
              data-node="4016:4130"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f814"
                data-node="I4016:4130;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f374"
                  data-node="I4016:4130;14:679;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f373"
                    data-node="I4016:4130;14:679;84:3230;84:2890"
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
                data-node="I4016:4130;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I4016:4130;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I4016:4130;14:682;84:3230;84:2890"
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
                data-node="I4016:4130;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I4016:4130;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I4016:4130;14:684;84:3230;84:2890"
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
                data-node="I4016:4130;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I4016:4130;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I4016:4130;8025:3809;84:3230;84:2890"
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
                data-node="I4016:4130;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f2"
                  data-node="I4016:4130;14:686;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I4016:4130;14:686;84:3230;84:2890"
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
                data-node="I4016:4130;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I4016:4130;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I4016:4130;14:688;84:3230;84:2890"
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
                className="node f815"
                data-node="I4016:4130;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f17"
                  data-node="I4016:4130;14:697;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f494"
                    data-node="I4016:4130;14:697;84:3330;84:2888"
                    data-name="Heading/H5/Bold/16px/21"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f0">Settings</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="node f94" data-node="4016:4131" data-name="main">
            <div
              className="node f381"
              data-node="4016:4132"
              data-name="UI / Top Bar"
            >
              <div
                className="node f27"
                data-node="I4016:4132;4010:4232"
                data-name="UI / Model Bar"
              >
                <div
                  className="node f23"
                  data-node="I4016:4132;4010:4232;73:1125"
                  data-name="UI / Status Badge"
                >
                  <div
                    className="node f22"
                    data-node="I4016:4132;4010:4232;73:1125;65:8533"
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
                  data-node="I4016:4132;4010:4232;84:3738"
                  data-name="Label Alternative / Small 10px"
                >
                  <div
                    className="node f25"
                    data-node="I4016:4132;4010:4232;84:3738;84:3445"
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
              className="node f816"
              data-node="4016:4133"
              data-name="UI / Header"
            >
              <div
                className="node f31"
                data-node="I4016:4133;84:3761"
                data-name="Label Alternative / Medium 11px"
              >
                <div
                  className="node f30"
                  data-node="I4016:4133;84:3761;84:3423"
                  data-name="LABEL-ALT/MD/Regular/11px/19"
                >
                  <span
                    className="text-content"
                    style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                  >
                    <span className="f29">DIRECTOR / SETTINGS</span>
                  </span>
                </div>
              </div>
              <div
                className="node f38"
                data-node="I4016:4133;4002:1245"
                data-name="header-body"
              >
                <div
                  className="node f34"
                  data-node="I4016:4133;84:2728"
                  data-name="Heading / H2 32px"
                >
                  <div
                    className="node f33"
                    data-node="I4016:4133;84:2728;84:1662"
                    data-name="Heading/H2 /Semi-Bold/32px/37"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f32">Settings</span>
                    </span>
                  </div>
                </div>
                <div
                  className="node f37"
                  data-node="I4016:4133;4002:1161"
                  data-name="Body / Extra Small 12px"
                >
                  <div
                    className="node f36"
                    data-node="I4016:4133;4002:1161;88:1185"
                    data-name="Body/12px"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.456px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f35">
                        Local model, storage, appearance, shortcuts, and app
                        information.
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="node f894"
              data-node="4016:4134"
              data-name="settings"
            >
              <div
                className="node f869"
                data-node="4016:4135"
                data-name="Navigation / Sidebar / Alternative"
              >
                <div
                  className="node f820"
                  data-node="I4016:4135;4016:3944"
                  data-name="Navigation / Item"
                >
                  <div
                    className="node f819"
                    data-node="I4016:4135;4016:3944;4013:4203"
                    data-name="Label / Medium 13px"
                  >
                    <Link
                      className="node f818"
                      data-node="I4016:4135;4016:3944;4013:4203;84:3846"
                      data-name="Label / 13px"
                      to="/settings-models"
                      aria-label="settings-models"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f817">Model</span>
                      </span>
                    </Link>
                  </div>
                </div>
                <div
                  className="node f865"
                  data-node="I4016:4135;4016:3948"
                  data-name="Navigation / Item"
                >
                  <div
                    className="node f864"
                    data-node="I4016:4135;4016:3948;4013:4203"
                    data-name="Label / Medium 13px"
                  >
                    <Link
                      className="node f863"
                      data-node="I4016:4135;4016:3948;4013:4203;84:3846"
                      data-name="Label / 13px"
                      to="/settings-personalisation"
                      aria-label="settings-personalisation"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f817">Personalisation</span>
                      </span>
                    </Link>
                  </div>
                </div>
                <div
                  className="node f868"
                  data-node="I4016:4135;4016:3947"
                  data-name="Navigation / Item"
                >
                  <div
                    className="node f867"
                    data-node="I4016:4135;4016:3947;4013:4215"
                    data-name="Label / Medium 13px"
                  >
                    <Link
                      className="node f866"
                      data-node="I4016:4135;4016:3947;4013:4215;84:3848"
                      data-name="Label/13px"
                      to="/settings-appearance"
                      aria-label="settings-appearance"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f821">Appearance</span>
                      </span>
                    </Link>
                  </div>
                </div>
                <Link
                  className="node f830"
                  data-node="I4016:4135;4016:3945"
                  data-name="Navigation / Item"
                  to="/prompts"
                  aria-label="prompts"
                >
                  <div
                    className="node f829"
                    data-node="I4016:4135;4016:3945;4013:4203"
                    data-name="Label / Medium 13px"
                  >
                    <div
                      className="node f828"
                      data-node="I4016:4135;4016:3945;4013:4203;84:3846"
                      data-name="Label / 13px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f817">Prompts</span>
                      </span>
                    </div>
                  </div>
                </Link>
                <div
                  className="node f833"
                  data-node="I4016:4135;4016:3946"
                  data-name="Navigation / Item"
                >
                  <div
                    className="node f832"
                    data-node="I4016:4135;4016:3946;4013:4203"
                    data-name="Label / Medium 13px"
                  >
                    <div
                      className="node f831"
                      data-node="I4016:4135;4016:3946;4013:4203;84:3846"
                      data-name="Label / 13px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f817">Storage</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="node f836"
                  data-node="I4016:4135;4016:3949"
                  data-name="Navigation / Item"
                >
                  <div
                    className="node f835"
                    data-node="I4016:4135;4016:3949;4013:4203"
                    data-name="Label / Medium 13px"
                  >
                    <div
                      className="node f834"
                      data-node="I4016:4135;4016:3949;4013:4203;84:3846"
                      data-name="Label / 13px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f817">Keyboard</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="node f893"
                data-node="4016:4155"
                data-name="appearance-box"
              >
                <div
                  className="node f871"
                  data-node="4016:4156"
                  data-name="section-header"
                >
                  <div
                    className="node f839"
                    data-node="4016:4157"
                    data-name="Heading / H4 20px"
                  >
                    <Link
                      className="node f838"
                      data-node="I4016:4157;84:1714"
                      data-name="H4/20px"
                      to="/settings-appearance"
                      aria-label="settings-appearance"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f497">Appearance</span>
                      </span>
                    </Link>
                  </div>
                  <div
                    className="node f870"
                    data-node="4016:4158"
                    data-name="Body / Extra Small 12px"
                  >
                    <div
                      className="node f36"
                      data-node="I4016:4158;88:1185"
                      data-name="Body/12px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.456px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f35">Choose the look you want</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="node f892"
                  data-node="4016:4159"
                  data-name="settings-list"
                >
                  <div
                    className="node f876"
                    data-node="4016:4160"
                    data-name="Settings / Details"
                  >
                    <div
                      className="node f874"
                      data-node="I4016:4160;4013:4407"
                      data-name="title-caption"
                    >
                      <div
                        className="node f841"
                        data-node="I4016:4160;4013:4398"
                        data-name="Label / Medium 13px"
                      >
                        <div
                          className="node f840"
                          data-node="I4016:4160;4013:4398;84:3844"
                          data-name="Label/13px"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f387">Theme</span>
                          </span>
                        </div>
                      </div>
                      <div
                        className="node f873"
                        data-node="I4016:4160;4013:4403"
                        data-name="Body / Extra Small 12px"
                      >
                        <div
                          className="node f872"
                          data-node="I4016:4160;4013:4403;88:1187"
                          data-name="Body/12px"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f842">
                              The approved Director theme.
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="node f875"
                      data-node="I4016:4160;4013:4358"
                      data-name="Form / Field"
                    >
                      <div
                        className="node f846"
                        data-node="I4016:4160;4013:4358;1:5105"
                        data-name="Photography"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <input
                            className="f251"
                            style={{ background: "transparent", border: "none", color: "inherit", outline: "none", padding: 0, width: "100%" }}
                            value={theme}
                            onChange={(e) => updateSettings('theme', e.target.value)}
                          />
                        </span>
                      </div>
                      <div
                        className="node f847"
                        data-node="I4016:4160;4013:4358;73:1190"
                        data-name="UI / Icon"
                      >
                        <div
                          className="node f53"
                          data-node="I4016:4160;4013:4358;73:1190;65:8507"
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
                    className="node f891"
                    data-node="4016:4161"
                    data-name="Settings / Details"
                  >
                    <div
                      className="node f878"
                      data-node="4016:4162"
                      data-name="title-caption"
                    >
                      <div
                        className="node f841"
                        data-node="4016:4163"
                        data-name="Label / Medium 13px"
                      >
                        <div
                          className="node f840"
                          data-node="I4016:4163;84:3844"
                          data-name="Label/13px"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f387">Accent</span>
                          </span>
                        </div>
                      </div>
                      <div
                        className="node f877"
                        data-node="4016:4164"
                        data-name="Body / Extra Small 12px"
                      >
                        <div
                          className="node f872"
                          data-node="I4016:4164;88:1187"
                          data-name="Body/12px"
                        >
                          <span
                            className="text-content"
                            style={{ top: "0px", width: "calc(100% + 1px)" }}
                          >
                            <span className="f842">Choose a colour</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="node f890"
                      data-node="4016:4165"
                      data-name="accent-colors"
                    >
                      <div
                        className="node f880"
                        data-node="4016:4166"
                        data-name="UI / Icon"
                        onClick={() => updateSettings('accent', 'color1')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className="node f879"
                          data-node="I4016:4166;4014:4579"
                          data-name="circle"
                        ></div>
                      </div>
                      <div
                        className="node f882"
                        data-node="4016:4167"
                        data-name="UI / Icon"
                        onClick={() => updateSettings('accent', 'color2')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className="node f881"
                          data-node="I4016:4167;4014:4579"
                          data-name="circle"
                        ></div>
                      </div>
                      <div
                        className="node f884"
                        data-node="4016:4168"
                        data-name="UI / Icon"
                        onClick={() => updateSettings('accent', 'color3')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className="node f883"
                          data-node="I4016:4168;4014:4579"
                          data-name="circle"
                        ></div>
                      </div>
                      <div
                        className="node f886"
                        data-node="4016:4169"
                        data-name="UI / Icon"
                        onClick={() => updateSettings('accent', 'color4')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className="node f885"
                          data-node="I4016:4169;4014:4579"
                          data-name="circle"
                        ></div>
                      </div>
                      <div
                        className="node f888"
                        data-node="4016:4170"
                        data-name="UI / Icon"
                        onClick={() => updateSettings('accent', 'color5')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className="node f887"
                          data-node="I4016:4170;4014:4579"
                          data-name="circle"
                        ></div>
                      </div>
                      <div
                        className="node f452"
                        data-node="4016:4171"
                        data-name="UI / Icon"
                        onClick={() => updateSettings('accent', 'color6')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className="node f889"
                          data-node="I4016:4171;4014:4579"
                          data-name="circle"
                        ></div>
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
