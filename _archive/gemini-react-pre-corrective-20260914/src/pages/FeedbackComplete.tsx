import React from "react";
import { Link } from "react-router-dom";

import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function FeedbackComplete() {
  const { currentFeedbackImage, currentFeedbackPrompt, saveRecord } = useApp();
  const navigate = useNavigate();
  return (
    <>
      <main
        className="source-frame"
        aria-label="Director / Feedback + Chat"
        style={{ width: "1512px", height: "1542.893px" }}
      >
        <div
          className="node f162"
          data-node="8013:1517"
          data-name="2.Director / Feedback + Chat"
        >
          <div className="node f113" data-node="8025:4042" data-name="sidebar">
            <div
              className="node f20"
              data-node="8025:4043"
              data-name="Navigation / Sidebar"
            >
              <Link
                className="node f3"
                data-node="I8025:4043;14:679"
                data-name="Navigation / Item"
                to="/feedback-new"
                aria-label="feedback-new"
              >
                <div
                  className="node f2"
                  data-node="I8025:4043;14:679;84:3330"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f1"
                    data-node="I8025:4043;14:679;84:3330;84:2888"
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
                data-node="I8025:4043;14:682"
                data-name="Navigation / Item"
                to="/design-studio"
                aria-label="design-studio"
              >
                <div
                  className="node f6"
                  data-node="I8025:4043;14:682;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f5"
                    data-node="I8025:4043;14:682;84:3230;84:2890"
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
                data-node="I8025:4043;14:684"
                data-name="Navigation / Item"
                to="/darkroom"
                aria-label="darkroom"
              >
                <div
                  className="node f9"
                  data-node="I8025:4043;14:684;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f8"
                    data-node="I8025:4043;14:684;84:3230;84:2890"
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
                data-node="I8025:4043;8025:3809"
                data-name="Navigation / Item"
                to="/compare-library"
                aria-label="compare-library"
              >
                <div
                  className="node f12"
                  data-node="I8025:4043;8025:3809;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f11"
                    data-node="I8025:4043;8025:3809;84:3230;84:2890"
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
                data-node="I8025:4043;14:686"
                data-name="Navigation / Item"
                to="/projects"
                aria-label="projects"
              >
                <div
                  className="node f2"
                  data-node="I8025:4043;14:686;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:4043;14:686;84:3230;84:2890"
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
                data-node="I8025:4043;14:688"
                data-name="Navigation / Item"
                to="/prompts"
                aria-label="prompts"
              >
                <div
                  className="node f17"
                  data-node="I8025:4043;14:688;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f16"
                    data-node="I8025:4043;14:688;84:3230;84:2890"
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
                data-node="I8025:4043;14:697"
                data-name="Navigation / Item"
                to="/settings-models"
                aria-label="settings-models"
              >
                <div
                  className="node f2"
                  data-node="I8025:4043;14:697;84:3230"
                  data-name="Heading / H5 16px"
                >
                  <div
                    className="node f14"
                    data-node="I8025:4043;14:697;84:3230;84:2890"
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
          <div className="node f161" data-node="8013:1520" data-name="main">
            <div
              className="node f135"
              data-node="8013:1521"
              data-name="feedback-content"
            >
              <div
                className="node f28"
                data-node="8013:1522"
                data-name="topbar"
              >
                <div
                  className="node f27"
                  data-node="I8013:1522;4010:4232"
                  data-name="UI / Model Bar"
                >
                  <div
                    className="node f23"
                    data-node="I8013:1522;4010:4232;73:1125"
                    data-name="UI / Status Badge"
                  >
                    <div
                      className="node f22"
                      data-node="I8013:1522;4010:4232;73:1125;65:8533"
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
                    data-node="I8013:1522;4010:4232;84:3738"
                    data-name="Label Alternative / Small 10px"
                  >
                    <div
                      className="node f25"
                      data-node="I8013:1522;4010:4232;84:3738;84:3445"
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
                data-node="8013:1523"
                data-name="header"
              >
                <div
                  className="node f118"
                  data-node="I8013:1523;77:4531"
                  data-name="header-title"
                >
                  <div
                    className="node f115"
                    data-node="I8013:1523;84:3771"
                    data-name="Label Alternative / Medium 11px"
                  >
                    <div
                      className="node f114"
                      data-node="I8013:1523;84:3771;84:3423"
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
                    className="node f117"
                    data-node="I8013:1523;84:2778"
                    data-name="Heading / H2 32px"
                  >
                    <div
                      className="node f116"
                      data-node="I8013:1523;84:2778;84:1662"
                      data-name="Heading/H2 /Semi-Bold/32px/37"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-7.716px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f32">ddenicola08_31_26_1803</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="node f128"
                  data-node="I8013:1523;93:8727"
                  data-name="Project / Toolbar"
                >
                  <div
                    className="node f125"
                    data-node="I8013:1523;93:8727;93:8695"
                    data-name="toolbar-actions"
                  >
                    <div
                      className="node f120"
                      data-node="I8013:1523;93:8727;93:8832"
                      data-name="Project / Toolbar Action"
                    >
                      <div
                        className="node f119"
                        data-node="I8013:1523;93:8727;93:8832;93:8633"
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
                      className="node f122"
                      data-node="I8013:1523;93:8727;93:8687"
                      data-name="Project / Toolbar Action"
                    >
                      <div
                        className="node f121"
                        data-node="I8013:1523;93:8727;93:8687;93:8678"
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
                      data-node="I8013:1523;93:8727;93:8688"
                      data-name="Project / Toolbar Action"
                    >
                      <div
                        className="node f123"
                        data-node="I8013:1523;93:8727;93:8688;93:8673"
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
                  <Link
                    className="node f127"
                    data-node="I8013:1523;93:8727;93:8696"
                    data-name="UI / Button"
                    to="/feedback-new"
                    aria-label="feedback-new"
                  >
                    <div
                      className="node f126"
                      data-node="I8013:1523;93:8727;93:8696;84:3509"
                      data-name="Label Alternative / Medium 11px"
                    >
                      <div
                        className="node f69"
                        data-node="I8013:1523;93:8727;93:8696;84:3509;84:3427"
                        data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f68">NEW FEEDBACK</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className="node f134"
                data-node="8013:1525"
                data-name="feedback-panel"
              >
                <div
                  className="node f73"
                  data-node="I8013:1525;47:583"
                  data-name="content-left"
                >
                  <div
                    className="node f46"
                    data-node="I8013:1525;74:1861"
                    data-name="Feedback / File"
                  >
                    <div
                      className="node f99"
                      data-node="I8013:1525;74:1861;74:1834"
                      data-name="image.jpg"
                    >
                      <div className="image-clip">
                        <img
                          className="source-image"
                          alt=""
                          draggable="false"
                          src={currentFeedbackImage || "assets/images/download-93-10481-0.jpeg"}
                          style={{
                            width: "98.23182711198429%",
                            height: "100%",
                            left: "0.8840864440078584%",
                            top: "0%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f50"
                    data-node="I8013:1525;47:588"
                    data-name="label"
                  >
                    <div
                      className="node f49"
                      data-node="I8013:1525;84:3893"
                      data-name="form-label"
                    >
                      <div
                        className="node f48"
                        data-node="I8013:1525;84:3893;84:3862"
                        data-name="Label/11px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f47">Source Type</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f55"
                    data-node="I8013:1525;47:590"
                    data-name="photography-input"
                  >
                    <div
                      className="node f52"
                      data-node="I8013:1525;47:590;1:5105"
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
                      data-node="I8013:1525;47:590;73:1190"
                      data-name="UI / Icon"
                    >
                      <div
                        className="node f53"
                        data-node="I8013:1525;47:590;73:1190;65:8507"
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
                    data-node="I8013:1525;88:989"
                    data-name="form-label"
                  >
                    <div
                      className="node f56"
                      data-node="I8013:1525;88:989;84:3862"
                      data-name="Label/11px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f47">Prompt</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f58"
                    data-node="I8013:1525;47:593"
                    data-name="prompt-selector"
                  >
                    <div
                      className="node f52"
                      data-node="I8013:1525;47:593;1:5105"
                      data-name="Photography"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f51">Harsh Critique</span>
                      </span>
                    </div>
                    <div
                      className="node f54"
                      data-node="I8013:1525;47:593;73:1190"
                      data-name="UI / Icon"
                    >
                      <div
                        className="node f53"
                        data-node="I8013:1525;47:593;73:1190;65:8507"
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
                    data-node="I8013:1525;47:594"
                    data-name="prompt-textarea"
                  >
                    <div
                      className="node f61"
                      data-node="I8013:1525;47:594;73:1565"
                      data-name="form-text"
                    >
                      <div
                        className="node f102"
                        data-node="I8013:1525;47:594;1:5017"
                        data-name="prompt-body"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f51">
                            Review this photograph. Respond with: 1. First
                            impression 2. What works 3. What feels weak or
                            unresolved 4. Composition / gesture / timing 5.
                            Light, colour, contrast, or tonal notes 6. Crop or
                            edit suggestion 7. Print potential 8. Possible
                            series connection 9. Three possible titles 10. Tags
                            Finish with one short human note to Diego.
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f64"
                    data-node="I8013:1525;84:3907"
                    data-name="source-note"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f63">
                        Director references this file when a Finder path is
                        available. Browser uploads are stored as a local source
                        copy so they can still be feedbacked.
                      </span>
                    </span>
                  </div>
                  <div
                    className="node f66"
                    data-node="I8013:1525;4007:2047"
                    data-name="form-label"
                  >
                    <div
                      className="node f65"
                      data-node="I8013:1525;4007:2047;84:3862"
                      data-name="Label/11px"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.793px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f47">Project Link</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="node f67"
                    data-node="I8013:1525;4007:2031"
                    data-name="prompt-selector"
                  >
                    <div
                      className="node f52"
                      data-node="I8013:1525;4007:2031;1:5105"
                      data-name="Photography"
                    >
                      <span
                        className="text-content"
                        style={{ top: "0px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f51">Street Photography</span>
                      </span>
                    </div>
                    <div
                      className="node f54"
                      data-node="I8013:1525;4007:2031;73:1190"
                      data-name="UI / Icon"
                    >
                      <div
                        className="node f53"
                        data-node="I8013:1525;4007:2031;73:1190;65:8507"
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
                    data-node="I8013:1525;47:602"
                    data-name="action-bar"
                  >
                    <div
                      className="node f71"
                      data-node="I8013:1525;73:878"
                      data-name="UI / Button"
                    >
                      <div
                        className="node f131"
                        data-node="I8013:1525;73:878;84:3509"
                        data-name="Label Alternative / Medium 11px"
                      >
                        <div
                          className="node f130"
                          data-node="I8013:1525;73:878;84:3509;84:3427"
                          data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                        >
                          <span
                            className="text-content"
                            style={{
                              top: "-5.947px",
                              width: "calc(100% + 1px)",
                            }}
                          >
                            <span className="f68">UPDATE FEEDBACK</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="node f79"
                  data-node="I8013:1525;47:605"
                  data-name="content-right"
                >
                  <div
                    className="node f78"
                    data-node="I8013:1525;47:623"
                    data-name="Form / Field"
                  >
                    <div
                      className="node f77"
                      data-node="I8013:1525;47:623;73:1572"
                      data-name="form-text"
                    >
                      <div
                        className="node f132"
                        data-node="I8013:1525;47:623;47:619"
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
                        className="node f133"
                        data-node="I8013:1525;47:623;47:620"
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
                            feel slightly uncontrolled. 4. **Composition /
                            gesture / timing:** The horizontal layout works
                            well, with the clothesline acting as a subtle
                            dividing line. The gesture is one of
                            suspension—clothes mid-dry, chair unoccupied,
                            shadows stretching across the wall. Timing feels
                            right for late afternoon; the light is directional
                            and dramatic without being harsh, capturing a
                            fleeting moment of quiet. 5. **Light, colour,
                            contrast, or tonal notes:** High-contrast natural
                            light creates strong tonal separation between sunlit
                            surfaces and deep shadows. The palette is restrained
                            (whites, grays, warm wood) but punctuated by a
                            vivid, saturated yellow that reads almost like a
                            flag. Tonal range is good, though shadow detail
                            could be slightly lifted to avoid flatness in the
                            darkest areas. 6. **Crop or edit suggestion:** A
                            slight crop to remove the lower third of the grass
                            and tighten around the porch would strengthen the
                            frame. Consider a subtle exposure adjustment to
                            recover detail in the shaded window and brick column
                            without sacrificing contrast. The AC unit could be
                            softened with a slight vignette or left as-is if
                            it’s meant to read as part of the domestic reality.
                            7. **Print potential:** Strong candidate for
                            medium-format archival prints (18x24 or 24x36). The
                            image’s quiet narrative and strong graphic elements
                            would translate well to gallery or editorial
                            contexts, especially if paired with similar works
                            exploring domestic space and absence. 8. **Possible
                            series connection:** Fits naturally into a body of
                            work examining “inhabited emptiness” or quiet
                            American domesticity. Could be paired with images of
                            empty rooms, sunlit floors, laundry lines, or
                            solitary objects in threshold spaces—works that
                            explore how absence gives shape to presence. 9.
                            **Three possible titles:** - *Yellow Thread* -
                            *Still on the Porch* - *The Waiting Line* 10.
                            **Tags:** domestic photography, still life, quiet
                            moment, shadows and light, laundry line, empty
                            chair, American house, observational photography,
                            natural light, architectural detail, absence and
                            presence. Thanks for sharing this—there’s a really
                            quiet power in how the yellow laundry and empty
                            chair hold the space together. If you’re building a
                            series around domestic stillness, this could anchor
                            it beautifully. Let me know if you want to tweak the
                            crop or explore tonal adjustments together.
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="node f156"
              data-node="8013:1526"
              data-name="prompt-section"
            >
              <div
                className="node f138"
                data-node="I8013:1526;74:1702"
                data-name="top-bar"
              >
                <div
                  className="node f137"
                  data-node="I8013:1526;84:2903"
                  data-name="H5"
                >
                  <div
                    className="node f136"
                    data-node="I8013:1526;84:2903;84:2888"
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
                data-node="I8013:1526;4002:1699"
                data-name="Prompt / Editor"
              >
                <div
                  className="node f154"
                  data-node="I8013:1526;4002:1699;4002:1567"
                  data-name="prompt-textarea-group"
                >
                  <div
                    className="node f142"
                    data-node="I8013:1526;4002:1699;4002:1568"
                    data-name="prompt-text-row"
                  >
                    <div
                      className="node f141"
                      data-node="I8013:1526;4002:1699;4002:1569"
                      data-name="prompt-text"
                    >
                      <div
                        className="node f140"
                        data-node="I8013:1526;4002:1699;4002:1569;88:1108"
                        data-name="Body/14px"
                      >
                        <span
                          className="text-content"
                          style={{ top: "0px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f139">
                            Lets discuss the photo in more detail.
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="node f153"
                    data-node="I8013:1526;4002:1699;4002:1571"
                    data-name="prompt-metadata-bar"
                  >
                    <div
                      className="node f144"
                      data-node="I8013:1526;4002:1699;4002:1572"
                      data-name="add-files"
                    >
                      <div
                        className="node f143"
                        data-node="I8013:1526;4002:1699;4002:1572;65:8500"
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
                      data-node="I8013:1526;4002:1699;4002:1574"
                      data-name="Prompt / Model Selector"
                    >
                      <div
                        className="node f147"
                        data-node="I8013:1526;4002:1699;4002:1574;4002:1900"
                        data-name="Label Alternative / Small 10px"
                      >
                        <div
                          className="node f146"
                          data-node="I8013:1526;4002:1699;4002:1574;4002:1900;84:3449"
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
                        data-node="I8013:1526;4002:1699;4002:1574;73:1550"
                        data-name="UI / Icon"
                      >
                        <div
                          className="node f53"
                          data-node="I8013:1526;4002:1699;4002:1574;73:1550;65:8507"
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
                      data-node="I8013:1526;4002:1699;4002:1694"
                      data-name="enter-button"
                    >
                      <div
                        className="node f151"
                        data-node="I8013:1526;4002:1699;4002:1694;73:1199"
                        data-name="UI / Icon"
                      >
                        <div
                          className="node f150"
                          data-node="I8013:1526;4002:1699;4002:1694;73:1199;65:8518"
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
              className="node f160"
              data-node="8013:1527"
              data-name="save-button"
            >
              <div
                className="node f159"
                data-node="8013:1528"
                data-name="UI / Button"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  saveRecord({
                    id: crypto.randomUUID(),
                    type: 'feedback',
                    title: 'New Feedback',
                    date: new Date().toLocaleDateString(),
                    sourceImage: currentFeedbackImage || 'assets/images/download-93-10481-0.jpeg',
                    prompt: currentFeedbackPrompt || 'Default Prompt',
                    model: 'gemma-4',
                    result: 'Feedback result...'
                  });
                  navigate('/darkroom');
                }}
              >
                <div
                  className="node f158"
                  data-node="I8013:1528;84:3509"
                  data-name="Label Alternative / Medium 11px"
                >
                  <div
                    className="node f157"
                    data-node="I8013:1528;84:3509;84:3427"
                    data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                  >
                    <span
                      className="text-content"
                      style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f68">SAVE FEEDBACK</span>
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
