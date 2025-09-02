const resumeTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Single Page Resume</title>
  <style>
    @page { 
      margin: 2.5cm !important; 
      size: A4;
    }
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }
    html, body {
      font-family: "Calibri", "Arial", sans-serif;
      font-size: 21pt;
      line-height: 1.0;
      margin: 0;
      padding: 0;
      color: #000;
      width: 100%;
      max-width: 100%;
      height: auto;
    }
    h1 {
      font-size: 60pt;
      font-weight: bold;
      margin: 0 0 1pt 0;
      text-align: center;
    }
    .address {
      font-size: 12.75pt;
      text-align: center;
      margin-bottom: 4pt;
      display: block;
    }
    .address div {
      display: inline;
      margin-right: 6pt;
    }
    .section {
      margin-top: 8pt;
      margin-bottom: 6pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section h2 {
      font-size: 21pt;
      font-weight: bold;
      border-bottom: 1px solid #000;
      margin-bottom: 1pt;
      padding-bottom: 0.5pt;
      text-transform: uppercase;
      page-break-after: avoid;
    }
    .entry {
      margin-bottom: 10pt;
      position: relative;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .entry-number {
      font-weight: bold;
      color: #333;
      display: inline;
      margin-right: 8pt;
      min-width: 20pt;
    }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
    .right { float: right; }
    ul {
      margin: 3pt 0 6pt 12pt;
      padding: 0;
      list-style-type: disc;
    }
    ul li {
      margin-bottom: 2pt;
      line-height: 1.2;
    }
    .tabular {
      display: table;
      width: 100%;
      margin: 1pt 0;
    }
    .tabular-row { 
      display: table-row; 
    }
    .tabular-label {
      display: table-cell;
      font-weight: bold;
      padding-right: 8pt;
      width: 80pt;
      vertical-align: top;
    }
    .tabular-content { 
      display: table-cell; 
      vertical-align: top;
    }
    a { 
      color: #0563C1; 
      text-decoration: underline; 
    }
    .project-item { 
      margin-bottom: 8pt; 
    }
    p {
      margin: 0 0 6pt 0;
      line-height: 1.2;
    }
    
    /* Prevent page breaks and ensure proper pagination */
    .section, .entry, .tabular, ul {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .section h2 {
      page-break-after: avoid;
      break-after: avoid;
    }
    
    .entry:last-child {
      page-break-after: auto;
    }
    
    /* Force single page layout */
    @media print, screen {
      @page { 
        margin: 2.5cm !important; 
        padding: 0 !important;
        border: none !important;
        size: A4;
      }
      html, body {
        font-size: 12.75pt !important;
        line-height: 0.95 !important;
        padding: 0 !important;
        margin: 0 !important;
        height: auto !important;
        overflow: visible !important;
      }
      h1 {
        font-size: 30pt !important;
        margin: 0 0 1pt 0 !important;
      }
      .address {
        font-size: 11.25pt !important;
        margin-bottom: 3pt !important;
      }
      .section {
        margin-top: 4pt !important;
        margin-bottom: 3pt !important;
      }
      .section h2 {
        font-size: 13.5pt !important;
        margin-bottom: 1pt !important;
        padding-bottom: 0pt !important;
      }
      .entry {
        margin-bottom: 3pt !important;
      }
      ul {
        margin: 2pt 0 4pt 10pt !important;
      }
      ul li {
        margin-bottom: 1pt !important;
        line-height: 1.1 !important;
      }
      .tabular {
        margin: 0.5pt 0 !important;
      }
      .tabular-label {
        padding-right: 6pt !important;
        width: 70pt !important;
      }
      .project-item {
        margin-bottom: 2pt !important;
      }
      p {
        margin: 0 0 3pt 0 !important;
        line-height: 1.1 !important;
      }
      .address div {
        margin-right: 4pt !important;
      }
    }
  </style>
</head>
<body>
  <h1>{{NAME}}</h1>
  <div class="address">
    <div>{{DESIGNATION}}</div>
    <div><b>Phone:</b> {{PHONE}}</div>
    <div><b>Email:</b> <a href="mailto:{{EMAIL}}">{{EMAIL}}</a></div>
    <div><b>LinkedIn:</b> <a href="{{LINKEDIN}}">{{LINKEDIN}}</a></div>
  </div>
  <div class="section">
    <h2>Summary</h2>
    <p>{{OBJECTIVE}}</p>
  </div>
    <br>
  <div class="section">
    <h2>Experience</h2>
    {{EXPERIENCE}}
  </div>
    <br>
  <div class="section">
    <h2>Education</h2>
    {{EDUCATION}}
  </div>
  <br>
  <div class="section">
    <h2>Skills</h2>
    {{SKILLS}}
  </div>
    <br>
  <div class="section">
    <h2>Projects</h2>
    {{PROJECTS}}
  </div>
  <br>
  <div class="section">
    <h2>Licenses & Certifications</h2>
    {{LICENCE_CERTIFICATIONS}}
  </div>
</body>
</html>
`;
module.exports = resumeTemplate;
