import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

export default function PromptEdit() {
  const { prompts, savePrompt, updatePrompt } = useApp();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("New Prompt");
  const [body, setBody] = useState("");
  
  useEffect(() => {
    if (id) {
      const p = prompts.find(x => x.id === id);
      if (p) {
        setTitle(p.title);
        setBody(p.body);
      }
    }
  }, [id, prompts]);
  
  const handleSave = () => {
    if (id) {
      updatePrompt(id, { title, body });
    } else {
      savePrompt({ id: uuidv4(), title, body, isArchived: false });
    }
    navigate('/prompts');
  };

  return (
    <>
      <main
        className="source-frame"
        aria-label="Prompts / Edit"
        style={{ width: "1512px", height: "1644px" }}
      >
        <div
          className="node f472"
          data-node="4013:3610"
          data-name="Prompts / Edit"
        >
          <div
            className="node f450"
            data-node="4013:3611"
            data-name="preview-image"
          ></div>
          <div
            className="node f451"
            data-node="4013:3612"
            data-name="model-background"
          ></div>
          <div
            className="node f813"
            data-node="4013:3639"
            data-name="Quick View / Drawer"
          >
            <div
              className="node f780"
              data-node="4013:3641"
              data-name="side-drawer-header"
            >
              <div
                className="node f779"
                data-node="4013:3736"
                data-name="form-label"
              >
                <div
                  className="node f778"
                  data-node="I4013:3736;84:1694"
                  data-name="Heading/H3/Medium/26px/30"
                >
                  <span
                    className="text-content"
                    style={{ top: "0px", width: "calc(100% + 1px)" }}
                  >
                    <span className="f777">Edit Prompt</span>
                  </span>
                </div>
              </div>
            </div>
            <div
              className="node f811"
              data-node="4013:3646"
              data-name="prompt-settings"
            >
              <div
                className="node f782"
                data-node="4013:3647"
                data-name="form-label"
              >
                <div
                  className="node f781"
                  data-node="I4013:3647;88:916"
                  data-name="Label / 16px"
                >
                  <span
                    className="text-content"
                    style={{ top: "0px", width: "calc(100% + 1px)" }}
                  >
                    <span className="f458">Name</span>
                  </span>
                </div>
              </div>
              <div
                className="node f785"
                data-node="4013:3648"
                data-name="Form / Field"
              >
                <div
                  className="node f784"
                  data-node="I4013:3648;1:5012"
                  data-name="field"
                >
                  <div
                    className="node f783"
                    data-node="I4013:3648;1:5013"
                    data-name="Photography"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <input
                        className="f251"
                        style={{ background: "transparent", border: "none", color: "inherit", outline: "none", padding: 0, width: "100%" }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f787"
                data-node="4013:3696"
                data-name="form-label"
              >
                <div
                  className="node f786"
                  data-node="I4013:3696;88:916"
                  data-name="Label / 16px"
                >
                  <span
                    className="text-content"
                    style={{ top: "0px", width: "calc(100% + 1px)" }}
                  >
                    <span className="f458">Category</span>
                  </span>
                </div>
              </div>
              <div
                className="node f788"
                data-node="4013:3693"
                data-name="Form / Field"
              >
                <div
                  className="node f784"
                  data-node="I4013:3693;1:5012"
                  data-name="field"
                >
                  <div
                    className="node f783"
                    data-node="I4013:3693;1:5013"
                    data-name="Photography"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f251">Photography</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f790"
                data-node="4013:3698"
                data-name="form-label"
              >
                <div
                  className="node f789"
                  data-node="I4013:3698;88:916"
                  data-name="Label / 16px"
                >
                  <span
                    className="text-content"
                    style={{ top: "0px", width: "calc(100% + 1px)" }}
                  >
                    <span className="f458">Use Type</span>
                  </span>
                </div>
              </div>
              <div
                className="node f791"
                data-node="4013:3699"
                data-name="Form / Field"
              >
                <div
                  className="node f784"
                  data-node="I4013:3699;1:5012"
                  data-name="field"
                >
                  <div
                    className="node f783"
                    data-node="I4013:3699;1:5013"
                    data-name="Photography"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f251">Feedback</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f793"
                data-node="4013:3703"
                data-name="form-label"
              >
                <div
                  className="node f792"
                  data-node="I4013:3703;88:916"
                  data-name="Label / 16px"
                >
                  <span
                    className="text-content"
                    style={{ top: "0px", width: "calc(100% + 1px)" }}
                  >
                    <span className="f458">Description</span>
                  </span>
                </div>
              </div>
              <div
                className="node f794"
                data-node="4013:3704"
                data-name="Form / Field"
              >
                <div
                  className="node f784"
                  data-node="I4013:3704;1:5012"
                  data-name="field"
                >
                  <div
                    className="node f783"
                    data-node="I4013:3704;1:5013"
                    data-name="Photography"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f251">
                        A complete creative-direction read of one photograph.
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f796"
                data-node="4013:3684"
                data-name="form-label"
              >
                <div
                  className="node f795"
                  data-node="I4013:3684;88:916"
                  data-name="Label / 16px"
                >
                  <span
                    className="text-content"
                    style={{ top: "0px", width: "calc(100% + 1px)" }}
                  >
                    <span className="f458">Prompt </span>
                  </span>
                </div>
              </div>
              <div
                className="node f797"
                data-node="4013:3680"
                data-name="Form / Field"
              >
                <div
                  className="node f462"
                  data-node="I4013:3680;73:1572"
                  data-name="form-text"
                >
                  <div
                    className="node f461"
                    data-node="I4013:3680;47:620"
                    data-name="output text"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <textarea
                        className="f59"
                        style={{ background: "transparent", border: "none", color: "inherit", outline: "none", padding: 0, width: "100%", height: "200px", resize: "none", fontFamily: "inherit" }}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f799"
                data-node="4013:3708"
                data-name="form-label"
              >
                <div
                  className="node f798"
                  data-node="I4013:3708;88:916"
                  data-name="Label / 16px"
                >
                  <span
                    className="text-content"
                    style={{ top: "0px", width: "calc(100% + 1px)" }}
                  >
                    <span className="f458">System Note (optional)</span>
                  </span>
                </div>
              </div>
              <div
                className="node f802"
                data-node="4013:3709"
                data-name="Form / Field"
              >
                <div
                  className="node f801"
                  data-node="I4013:3709;73:1572"
                  data-name="form-text"
                >
                  <div
                    className="node f800"
                    data-node="I4013:3709;47:620"
                    data-name="output text"
                  >
                    <span
                      className="text-content"
                      style={{ top: "0px", width: "calc(100% + 1px)" }}
                    >
                      <span className="f59"></span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="node f810"
                data-node="4013:3728"
                data-name="tool-box"
              >
                <div
                  className="node f806"
                  data-node="4013:3735"
                  data-name="buttons"
                >
                  <Link
                    className="node f675"
                    data-node="4013:3721"
                    data-name="UI / Button"
                    to="/prompts"
                    aria-label="prompts"
                  >
                    <div
                      className="node f674"
                      data-node="I4013:3721;84:3644"
                      data-name="Label Alternative / Medium 11px"
                    >
                      <div
                        className="node f673"
                        data-node="I4013:3721;84:3644;84:3427"
                        data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f68">CANCEL</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div
                    className="node f805"
                    data-node="4013:3725"
                    data-name="UI / Button"
                    onClick={handleSave}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="node f804"
                      data-node="I4013:3725;84:3509"
                      data-name="Label Alternative / Medium 11px"
                    >
                      <div
                        className="node f803"
                        data-node="I4013:3725;84:3509;84:3427"
                        data-name="LABEL-ALT/MD/Semi-Bold/11px/19"
                      >
                        <span
                          className="text-content"
                          style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                        >
                          <span className="f68">SAVE PROMPT</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="node f809"
                  data-node="4013:3714"
                  data-name="Label"
                >
                  <div
                    className="node f709"
                    data-node="4013:4076"
                    data-name="UI / Icon"
                  >
                    <div
                      className="node f708"
                      data-node="I4013:4076;4013:3740"
                      data-name="Input"
                    ></div>
                  </div>
                  <div
                    className="node f808"
                    data-node="4013:3731"
                    data-name="form-label"
                  >
                    <div
                      className="node f807"
                      data-node="I4013:3731;84:3423"
                      data-name="LABEL-ALT/MD/Regular/11px/19"
                    >
                      <span
                        className="text-content"
                        style={{ top: "-5.947px", width: "calc(100% + 1px)" }}
                      >
                        <span className="f710">ARCHIVE</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="node f812" data-node="4013:3640" data-name="close">
              <Link
                className="node f452"
                data-node="I4013:3640;35:1187"
                data-name="button-close"
                to="/prompts"
                aria-label="prompts"
              >
                <img
                  className="icon"
                  src="assets/icons/button-close.svg"
                  alt=""
                  draggable="false"
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
