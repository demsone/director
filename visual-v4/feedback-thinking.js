// Keeps the approved generating state bound to the submitted Feedback session.
(() => {
  try {
    const draft = JSON.parse(sessionStorage.getItem('director.v4.feedback.draft') || 'null');
    if (!draft?.source?.name) return;
    const title = document.querySelector('.f32');
    if (title) title.textContent = draft.source.name;
    const image = document.querySelector('.source-image');
    if (image && draft.source.preview) image.src = draft.source.preview;
  } catch { /* The approved fixture remains visible if no current session exists. */ }
})();
