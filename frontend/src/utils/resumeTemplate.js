

const resumeTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Single Page Resume</title>
  <style>
    @page { margin: 0.2in !important; }
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }
    html, body {
      font-family: "Calibri", "Arial", sans-serif;
      font-size: 10pt;
      line-height: 1.1;
      margin: 0;
      padding: 0.2in;
      color: #000;
      width: 100%;
      max-width: 100%;
      height: auto;
    }
    h1 {
      font-size: 14pt;
      font-weight: bold;
      margin: 0 0 3pt 0;
      text-align: center;
    }
    .address {
      font-size: 9pt;
      text-align: center;
      margin-bottom: 8pt;
      display: block;
    }
    .address div {
      display: inline;
      margin-right: 10pt;
    }
    .section {
      margin-top: 6pt;
      margin-bottom: 4pt;
    }
    .section h2 {
      font-size: 11pt;
      font-weight: bold;
      border-bottom: 1px solid #000;
      margin-bottom: 3pt;
      padding-bottom: 1pt;
      text-transform: uppercase;
    }
    .entry {
      margin-bottom: 4pt;
    }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
    .right { float: right; }
    ul {
      margin: 0 0 4pt 18pt;
      padding: 0;
      list-style-type: disc;
    }
    ul li {
      margin-bottom: 1pt;
      line-height: 1.1;
    }
    .tabular {
      display: table;
      width: 100%;
      margin: 2pt 0;
    }
    .tabular-row { 
      display: table-row; 
    }
    .tabular-label {
      display: table-cell;
      font-weight: bold;
      padding-right: 15pt;
      width: 120pt;
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
      margin-bottom: 3pt; 
    }
    p {
      margin: 0 0 4pt 0;
      line-height: 1.1;
    }
    
    /* Prevent page breaks */
    .section, .entry, .tabular, ul {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    /* Force single page layout */
    @media print, screen {
      html, body {
        font-size: 9.5pt !important;
        line-height: 1.05 !important;
        padding: 0.15in !important;
        margin: 0 !important;
        height: auto !important;
        overflow: visible !important;
      }
      h1 {
        font-size: 12pt !important;
        margin: 0 0 2pt 0 !important;
      }
      .address {
        font-size: 8.5pt !important;
        margin-bottom: 6pt !important;
      }
      .section {
        margin-top: 4pt !important;
        margin-bottom: 2pt !important;
      }
      .section h2 {
        font-size: 10pt !important;
        margin-bottom: 2pt !important;
        padding-bottom: 0.5pt !important;
      }
      .entry {
        margin-bottom: 2pt !important;
      }
      ul {
        margin: 0 0 2pt 12pt !important;
      }
      ul li {
        margin-bottom: 0.5pt !important;
        line-height: 1.05 !important;
      }
      .tabular {
        margin: 1pt 0 !important;
      }
      .tabular-label {
        padding-right: 10pt !important;
        width: 100pt !important;
      }
      .project-item {
        margin-bottom: 1.5pt !important;
      }
      p {
        margin: 0 0 2pt 0 !important;
        line-height: 1.05 !important;
      }
      .address div {
        margin-right: 8pt !important;
      }
    }
  </style>
</head>
<body>
  <h1>Firstname Lastname</h1>
  <div class="address">
    <div>+1(123) 456-7890</div>
    <div>San Francisco, CA</div>
    <div><a href="mailto:contact@faangpath.com">contact@faangpath.com</a></div>
    <div><a href="https://linkedin.com/company/faangpath">linkedin.com/company/faangpath</a></div>
    <div><a href="https://www.faangpath.com">www.faangpath.com</a></div>
  </div>

  <div class="section">
    <h2>Objective</h2>
    <p>Software Engineer with 2+ years of experience in XXX, seeking full-time XXX roles.</p>
  </div>

  <div class="section">
    <h2>Education</h2>
    <div class="entry">
      <div><span class="bold">Master of Computer Science</span>, Stanford University <span class="right">Expected 2020</span></div>
      <div>Relevant Coursework: A, B, C, and D.</div>
    </div>
    <div class="entry">
      <div><span class="bold">Bachelor of Computer Science</span>, Stanford University <span class="right">2014 - 2017</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Skills</h2>
    <div class="tabular">
      <div class="tabular-row">
        <div class="tabular-label">Technical Skills:</div>
        <div class="tabular-content">A, B, C, D</div>
      </div>
      <div class="tabular-row">
        <div class="tabular-label">Soft Skills:</div>
        <div class="tabular-content">A, B, C, D</div>
      </div>
      <div class="tabular-row">
        <div class="tabular-label">XYZ:</div>
        <div class="tabular-content">A, B, C, D</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Experience</h2>
    <div class="entry">
      <div><span class="bold">Role Name</span> <span class="right">Jan 2017 - Jan 2019</span></div>
      <div><span class="italic">Company Name, San Francisco, CA</span></div>
      <ul>
        <li>Achieved X% growth for XYZ using A, B, and C skills.</li>
        <li>Led XYZ which led to X% of improvement in ABC</li>
        <li>Developed XYZ that did A, B, and C using X, Y, and Z.</li>
      </ul>
    </div>
    <div class="entry">
      <div><span class="bold">Role Name</span> <span class="right">Jan 2017 - Jan 2019</span></div>
      <div><span class="italic">Company Name, San Francisco, CA</span></div>
      <ul>
        <li>Achieved X% growth for XYZ using A, B, and C skills.</li>
        <li>Led XYZ which led to X% of improvement in ABC</li>
        <li>Developed XYZ that did A, B, and C using X, Y, and Z.</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <h2>Projects</h2>
    <ul>
      <li><span class="bold">Hiring Search Tool.</span> Built a tool to search for Hiring Managers and Recruiters using ReactJS, NodeJS, Firebase and boolean queries. <a href="https://hiring-search.careerflow.ai/">(Try it here)</a></li>
      <li><span class="bold">Short Project Title.</span> Built a project that had quantified success using A, B, and C. It also won an award.</li>
      <li><span class="bold">Short Project Title.</span> Built a project that had quantified success using A, B, and C. It also won an award.</li>
    </ul>
  </div>

  <div class="section">
    <h2>Extra-Curricular Activities</h2>
    <ul>
      <li>Write <a href="https://www.faangpath.com/blog/">blog posts</a> and social content (<a href="https://www.tiktok.com/@faangpath">TikTok</a>, <a href="https://www.instagram.com/faangpath/?hl=en">Instagram</a>) seen by 20K+ job seekers/week.</li>
      <li>Sample bullet point.</li>
    </ul>
  </div>

  <div class="section">
    <h2>Leadership</h2>
    <ul>
      <li>Admin for <a href="https://discord.com/invite/WWbjEaZ">FAANGPath Discord</a> (6K+ job seekers). Managed events, discussions, and community support.</li>
    </ul>
  </div>
</body>
</html>

`;

export default resumeTemplate;
