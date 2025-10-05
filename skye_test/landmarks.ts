function testLandmarkTags(element: Document) {
    const main = element.querySelector("main")
    
    if (main) {
        const headingSelectors = 'h1,h2,h3,h4,h5,h6';
        const headings = Array.from(main.querySelectorAll(headingSelectors)).map((h, i) => ({
            node: h,
            tag: h.tagName.toLowerCase(),
            level: parseInt(h.tagName.slice(1), 10),
            text: h.textContent.trim(),
            index: i
        }));
        const anyH1 = headings.find(h => h.level === 1);

        if (anyH1) {
            
        } else {
            return null;
        }

    } else {
        return null;
    }
}

/**
 * Checks main element for:
 *  - contains a child H1
 *  - no headings appear before that H1 inside main
 *  - heading hierarchy is not skipped (e.g., h1 -> h3 without h2) except when a new sectioning element (section/article/nav/aside) starts
 *  - prevents consecutive h1 siblings unless each is inside its own sectioning element (section/article)
 *
 * Returns: {
 *   ok: boolean,
 *   errors: string[],
 *   details: { headings: Array<{ tag, text, node, index, sectionIndex, pathLevel }> }
 * }
 */
function auditMainHeadings() {
  const errors = [];
  const main = document.querySelector('main');
  if (!main) {
    return { ok: false, errors: ['No <main> element found.'], details: null };
  }

  // Helper: is sectioning root that resets heading nesting rules
  const isSectioning = (el) => {
    if (!el) return false;
    const name = el.nodeName.toLowerCase();
    return ['section', 'article', 'nav', 'aside'].includes(name);
  };

  // Collect all heading elements inside main in document order
  const headingSelectors = 'h1,h2,h3,h4,h5,h6';
  const headings = Array.from(main.querySelectorAll(headingSelectors)).map((h, i) => ({
    node: h,
    tag: h.tagName.toLowerCase(),
    level: parseInt(h.tagName.slice(1), 10),
    text: h.textContent.trim(),
    index: i
  }));

  // Must have at least one h1 child (descendant). Also ensure there's an h1 that is a child (immediate child?) 
  // Your spec said "main has a child h1" — interpret as "main contains an h1 descendant" and also check if at least one h1 is a direct child.
  const anyH1 = headings.find(h => h.level === 1);
  if (!anyH1) {
    errors.push('No <h1> found inside <main>.');
    return { ok: false, errors, details: { headings } };
  }

  // Check for direct child h1 presence
  const directChildH1 = Array.from(main.children).some(c => c.tagName && c.tagName.toLowerCase() === 'h1');
  if (!directChildH1) {
    errors.push('No <h1> as a direct child of <main>. (Found an <h1> descendant, but not a direct child.)');
  }

  // Ensure there are no headings before the first h1 within main (i.e., any heading appearing earlier in DOM order than the first h1)
  const firstH1Index = headings.findIndex(h => h.level === 1);
  if (firstH1Index > 0) {
    // headings exist before first h1
    const before = headings.slice(0, firstH1Index).map(h => `<${h.tag}>: "${h.text}"`).join(', ');
    errors.push(`Headings found before the first <h1> inside <main>: ${before}`);
  }

  // Check hierarchy rules
  // We'll treat sectioning elements as reset points. Track current expected level stack.
  // For each heading in order, determine whether it is allowed relative to previous heading and sectioning.
  // Also flag consecutive h1 siblings not inside their own section/article.
  const sectioningTags = ['section', 'article', 'nav', 'aside'];
  // Build a list of headings with their nearest ancestor sectioning element index
  const sections = []; // list of ancestor sectioning roots encountered (for mapping)
  // We'll traverse DOM inside main in order and assign sectionIndex to each node based on nearest ancestor section/article/nav/aside under main
  function findNearestSectionIndex(node) {
    let cur = node.parentElement;
    while (cur && cur !== main) {
      if (sectioningTags.includes(cur.tagName.toLowerCase())) {
        // find index in sections array (by node) or add
        let idx = sections.findIndex(s => s.node === cur);
        if (idx === -1) {
          idx = sections.push({ node: cur }) - 1;
        }
        return idx;
      }
      cur = cur.parentElement;
    }
    return -1; // not inside a sectioning element under main
  }

  const headingData = headings.map(h => {
    const sectionIndex = findNearestSectionIndex(h.node);
    return Object.assign({}, h, { sectionIndex });
  });

  // Check rules by iterating headings
  for (let i = 0; i < headingData.length; i++) {
    const cur = headingData[i];
    const prev = headingData[i - 1];

    // Rule: consecutive h1 siblings are not allowed unless each is enclosed in its own section/article
    if (cur.level === 1 && prev && prev.level === 1) {
      // allowed only if their sectionIndex differs and both are != -1 (i.e., each inside its own section/article)
      const okConsecutiveH1 = (cur.sectionIndex !== -1 && prev.sectionIndex !== -1 && cur.sectionIndex !== prev.sectionIndex);
      if (!okConsecutiveH1) {
        errors.push(`Consecutive <h1> elements without separate section/article at positions ${prev.index} and ${cur.index}.`);
      }
    }

    if (!prev) continue;

    // If a new sectioning element started between prev and cur, hierarchy may reset. To detect this reliably,
    // check if sectionIndex changed.
    const sectionReset = cur.sectionIndex !== prev.sectionIndex;

    if (!sectionReset) {
      // Ensure we don't skip levels: cur.level should be <= prev.level + 1 OR cur.level <= prev.level (closing to sibling)
      // Allowed patterns within same section:
      // - same level (h2 -> h2)
      // - one deeper (h2 -> h3)
      // - shallower to any previous level (h3 -> h2 or h3 -> h1) is OK as long as not skipping when going deeper.
      if (cur.level > prev.level + 1) {
        errors.push(`Heading level jump from <${prev.tag}> to <${cur.tag}> at indices ${prev.index} -> ${cur.index} skips a level.`);
      }
    } else {
      // section reset: it's OK for cur to start with any level, but still flag if it's an h1 sibling rule handled earlier
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    details: { headings: headingData.map(h => ({ tag: h.tag, text: h.text, index: h.index, level: h.level, sectionIndex: h.sectionIndex })) }
  };
}
