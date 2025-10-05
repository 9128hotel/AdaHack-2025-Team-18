# 🔍 Oops, There's a Problem - Accessibility Checker

A comprehensive Chrome extension that automatically detects and highlights accessibility issues on any webpage. Help make the web more accessible for everyone!

## ✨ Features

This extension checks for the following accessibility issues:

- **📹 Missing Video Captions** - Detects videos without subtitles or captions
- **🏷️ Form Label Issues** - Finds form inputs, selects, and textareas without proper labels
- **🖼️ Missing Alt Text** - Identifies images without alt attributes or with insufficient alt text (< 15 characters)
- **⌨️ Keyboard Accessibility** - Checks if interactive elements are reachable via Tab key
- **🎨 Color Contrast** - Detects poor color contrast between text and backgrounds (WCAG AA compliance)

## 🚀 Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the extension folder

### Or
Simply install the .crx file as an extension into chrome

### Required Files

```
your-extension/
├── manifest.json
├── background.js
├── main.js
├── popup.html
├── popup.js
├── logo.png (at least 128x128px)
└── checkers/
    ├── highlighter.js
    ├── contrast.js
    ├── captions.js
    ├── form_control.js
    ├── imageAlts.js
    └── focusable.js
```

## 📖 Usage

### Automatic Check
The extension automatically runs when you load any webpage. Issues will be highlighted with red outlines.

### Manual Check
1. Click the extension icon in your Chrome toolbar
2. Click "Run Accessibility Check" button
3. Accessibility issues will be highlighted on the page with red outlines
4. Hover near highlighted elements to see detailed issue tooltips

### Understanding Results

- **Red Outlines** - Elements with accessibility issues
- **Tooltips** - Click or hover to see specific issues for each element
- **Badge Count** - The extension icon shows the number of issues found

## 🛠️ How It Works

### Detection Process

1. **Page Scan** - Scans all visible elements on the page
2. **Multi-Check Analysis** - Runs 5 different accessibility checkers on each element
3. **Visual Feedback** - Highlights problematic elements with red outlines and informative tooltips
4. **Badge Update** - Updates extension badge with total issue count

### Individual Checkers

#### Video Captions Checker (`captions.js`)
- Scans for `<video>` elements
- Checks for `<track>` elements with `kind="captions"` or `kind="subtitles"`
- Verifies textTracks API for dynamic captions

#### Form Label Checker (`form_control.js`)
- Finds `<input>`, `<select>`, `<textarea>`, and `<button>` elements
- Validates proper labeling through:
  - `<label for="id">` association
  - Wrapping `<label>` elements
  - `aria-label` attribute
  - `aria-labelledby` reference
- Warns about fieldsets without legends

#### Image Alt Text Checker (`imageAlts.js`)
- Scans all `<img>` elements
- Flags images without `alt` attribute
- Flags images with alt text shorter than 15 characters (non-decorative)
- Empty `alt=""` is acceptable for decorative images

#### Keyboard Accessibility Checker (`focusable.js`)
- Identifies interactive elements (links, buttons, form controls)
- Checks for negative `tabindex` values
- Ensures keyboard navigation is possible

#### Color Contrast Checker (`contrast.js`)
- Calculates contrast ratio between text and background colors
- Follows WCAG AA standards:
  - 4.5:1 for normal text
  - 3:1 for large text (18px+ or 14px+ bold)
- Uses relative luminance calculation per WCAG guidelines

### Highlighting System (`highlighter.js`)

All checkers use a shared highlighting utility that:
- Adds red outlines to problematic elements
- Creates informative tooltips with issue details
- Provides close buttons to dismiss individual highlights
- Prevents duplicate highlighting
- Positions tooltips intelligently (above/below based on space)

## 🎯 Accessibility Standards

This extension helps websites comply with:
- **WCAG 2.1** (Web Content Accessibility Guidelines)
- **Section 508** (US Federal accessibility requirements)
- **ADA** (Americans with Disabilities Act) digital accessibility standards

## ⚙️ Configuration

### Manifest Configuration

The extension uses **Manifest V3** with the following permissions:
- `activeTab` - Access to the current tab
- `scripting` - Inject content scripts
- `<all_urls>` - Check any website

### Content Script Loading Order

Scripts load in this specific order (defined in `manifest.json`):
1. `highlighter.js` - Shared highlighting utility
2. `contrast.js` - Contrast checker
3. `captions.js` - Video caption checker
4. `form_control.js` - Form label checker
5. `imageAlts.js` - Image alt text checker
6. `focusable.js` - Keyboard accessibility checker
7. `main.js` - Orchestrator that runs all checks

## 🔧 Development

### Adding New Checkers

1. Create a new file in `checkers/` directory (e.g., `checkers/myCheck.js`)
2. Write your checker function:
```javascript
function checkMyFeature(element) {
    // Check logic here
    return true; // true = no issues, false = has issues
}
```
3. Add to `manifest.json` content_scripts array:
```json
"js": [
    "checkers/highlighter.js",
    "checkers/myCheck.js",  // Add here
    "main.js"
]
```
4. Update `main.js` to call your checker:
```javascript
if (typeof checkMyFeature === 'function' && !checkMyFeature(element)) {
    issues.push("My Feature Issue");
}
```

### File Structure Explained

- **manifest.json** - Extension configuration
- **background.js** - Service worker for badge updates
- **main.js** - Content script orchestrator
- **popup.html/js** - Extension popup interface
- **checkers/** - Individual accessibility checker modules
  - **highlighter.js** - Shared highlighting utility
  - **contrast.js** - Color contrast analysis
  - **captions.js** - Video caption detection
  - **form_control.js** - Form label validation
  - **imageAlts.js** - Image alt text verification
  - **focusable.js** - Keyboard accessibility check

## 🐛 Troubleshooting

### Extension not working?
1. Refresh the page after installing the extension
2. Check `chrome://extensions/` for any error messages
3. Reload the extension: Click the reload icon on the extension card
4. Open DevTools Console (F12) to see detailed error messages

### "Content script not loaded" error?
- Refresh the webpage after installing/updating the extension
- Some pages (like chrome:// URLs) don't allow extensions

### No issues highlighted?
- Great! The page might be fully accessible
- Check the extension badge for issue count
- Open DevTools Console to see detailed logs

### Permission errors?
- Make sure all files are in the correct directory structure
- Verify `manifest.json` has correct file paths

## 📝 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple websites
5. Submit a pull request

### Ideas for Contributions

- Add more accessibility checkers (heading hierarchy, ARIA roles, etc.)
- Improve contrast calculation accuracy
- Add export functionality for reports
- Create automated testing suite
- Add support for custom accessibility rules
- Internationalization (i18n) support

## 🙏 Acknowledgments

Built with accessibility in mind, following:
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)

## 📧 Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Open DevTools Console for detailed error messages
3. Review the extension's files to ensure proper installation

---

**Made with ❤️ to make the web accessible for everyone**









# AdaHack-2025-Team-18
## Oops, there's a problem!
Oops, there's a problem! is a tool for developers preparing to launch a website! It checks any website and highlights parts which do not match accessibility standards, such as videos without captions, input fields with no labels, and areas which cannot be reached by tabbing!
## How to use


## Path
Version 2 aims to bring better detection, suggested fixes, and a wider range of customisable standards to the system
Version 3 aims to bring Firefox support and addition to online extension stores