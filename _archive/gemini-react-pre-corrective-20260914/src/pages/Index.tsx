import React from "react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <>
      <h1>Director v4 — Visual review</h1>
      <p>
        Review index, outside the product interface. All supplied product states
        and explicit clones are available below. Screens keep their Figma
        dimensions; narrower windows scroll. Navigation and transient field
        editing are available for review. Generation, saves, deletes and
        connection tests are inactive; nothing is persisted. Model status, text,
        images and repeated cards are visual fixtures.
      </p>
      <p>
        27 views · 25 Build Contracts · 520 exact source tokens.{" "}
        <a href="source/BUILD-CONTRACTS.md">Read contracts</a> ·{" "}
        <a href="SOURCE-NOTES.md">Source and reuse notes</a>
      </p>
      <h2>Director</h2>
      <ul>
        <li>
          <Link to="/feedback-new">Director / New Feedback</Link>{" "}
          <small>1512 × 1321</small>
        </li>
        <li>
          <Link to="/feedback-thinking">Director / Feedback — generating</Link>{" "}
          <small>1512 × 1341</small>
        </li>
        <li>
          <Link to="/feedback-complete">Director / Feedback + Chat</Link>{" "}
          <small>1512 × 1542.893</small>
        </li>
        <li>
          <Link to="/feedback-detail">Director / Saved Feedback Detail</Link>{" "}
          <small>1512 × 1849.714</small>
        </li>
      </ul>
      <h2>Director Compare</h2>
      <ul>
        <li>
          <Link to="/compare-new">Director / New Compare</Link>{" "}
          <small>1512 × 1110.429</small>
        </li>
        <li>
          <Link to="/compare-thinking">Director / Compare — generating</Link>{" "}
          <small>1512 × 1090</small>
        </li>
        <li>
          <Link to="/compare-complete">Director / Comparison + Chat</Link>{" "}
          <small>1512 × 2087.941</small>
        </li>
        <li>
          <Link to="/compare-detail">Director / Saved Comparison Result</Link>{" "}
          <small>1512 × 2660.444</small>
        </li>
      </ul>
      <h2>Darkroom</h2>
      <ul>
        <li>
          <Link to="/darkroom">Darkroom / Library</Link>{" "}
          <small>1512 × 2069.924</small>
        </li>
        <li>
          <Link to="/darkroom-quick">Darkroom / Quick View</Link>{" "}
          <small>1512 × 1644</small>
        </li>
        <li>
          <Link to="/darkroom-detail">Darkroom / Feedback Detail</Link>{" "}
          <small>1512 × 1849.714 · shared pattern</small>
        </li>
      </ul>
      <h2>Compare Library</h2>
      <ul>
        <li>
          <Link to="/compare-library">Compare / Library</Link>{" "}
          <small>1512 × 734.75</small>
        </li>
        <li>
          <Link to="/compare-library-detail">
            Compare / Saved Comparison Result
          </Link>{" "}
          <small>1512 × 2660.444 · shared pattern</small>
        </li>
      </ul>
      <h2>Projects</h2>
      <ul>
        <li>
          <Link to="/projects">Projects / Library</Link>{" "}
          <small>1512 × 989.75</small>
        </li>
        <li>
          <Link to="/project-overview">Projects / Detail / Overview</Link>{" "}
          <small>1512 × 1644</small>
        </li>
        <li>
          <Link to="/project-feedback">Projects / Detail / Feedback</Link>{" "}
          <small>1512 × 1644</small>
        </li>
        <li>
          <Link to="/project-quick">Projects / Quick View</Link>{" "}
          <small>1512 × 1644 · shared pattern</small>
        </li>
        <li>
          <Link to="/project-settings">Project / Settings</Link>{" "}
          <small>1512 × 2000</small>
        </li>
      </ul>
      <h2>Design Studio</h2>
      <ul>
        <li>
          <Link to="/design-studio">Design Studio / Library</Link>{" "}
          <small>1512 × 2069.924 · shared pattern</small>
        </li>
        <li>
          <Link to="/design-studio-quick">Design Studio / Quick View</Link>{" "}
          <small>1512 × 1644 · shared pattern</small>
        </li>
        <li>
          <Link to="/design-studio-detail">
            Design Studio / Feedback Detail
          </Link>{" "}
          <small>1512 × 1849.714 · shared pattern</small>
        </li>
      </ul>
      <h2>Prompts</h2>
      <ul>
        <li>
          <Link to="/prompts">Prompts / Library</Link>{" "}
          <small>1512 × 1086.714</small>
        </li>
        <li>
          <Link to="/prompt-edit">Prompts / Edit</Link>{" "}
          <small>1512 × 1644</small>
        </li>
      </ul>
      <h2>Settings</h2>
      <ul>
        <li>
          <Link to="/settings-personalisation">Settings / Personalisation</Link>{" "}
          <small>1512 × 1321</small>
        </li>
        <li>
          <Link to="/settings-appearance">Settings / Appearance</Link>{" "}
          <small>1512 × 1321</small>
        </li>
        <li>
          <Link to="/settings-models">Settings / Models</Link>{" "}
          <small>1512 × 1321</small>
        </li>
      </ul>
      <h2>Component reference</h2>
      <ul>
        <li>
          <Link to="/prompt-editor-reference">
            Prompt editor / All controls
          </Link>{" "}
          <small>776 × 464.5</small>
        </li>
      </ul>
    </>
  );
}
