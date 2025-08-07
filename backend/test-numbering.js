// Test script to understand the numbering issue
const sampleEducation = `<div class="entry">
  <div class="bold">Master of Computer Applications <span class="right">Expected 2024</span></div>
  <div class="italic">Chandigarh University, Location</div>
  <div>GPA: (if available)</div>
</div><div class="entry">
  <div class="bold">Bachelor of Computer Applications</div>
  <div class="italic">Maharana Pratap Group of Institutions, Location</div>
  <div>GPA: (if available)</div>
</div>`;

console.log('Original HTML:');
console.log(sampleEducation);
console.log('\n=== SPLIT ANALYSIS ===');

const entries = sampleEducation.split('<div class="entry">');
console.log('Number of entries:', entries.length);
entries.forEach((entry, i) => {
  console.log(`\nEntry ${i}:`);
  console.log(`"${entry}"`);
});

console.log('\n=== NUMBERING TEST ===');

function addNumberingToSection(html, sectionName) {
    if (!html) return '';
    
    // Split by entry divs and add numbering
    const entries = html.split('<div class="entry">');
    if (entries.length <= 1) return html; // No entries to number
    
    let numberedHtml = entries[0]; // Keep any initial content
    
    for (let i = 1; i < entries.length; i++) {
        // Find the first bold element and add the number inline
        let entryContent = entries[i];
        console.log(`\nProcessing entry ${i}:`);
        console.log(`Before: "${entryContent.substring(0, 100)}..."`);
        
        if (entryContent.includes('<div class="bold">')) {
            console.log('Found bold div, replacing...');
            entryContent = entryContent.replace(
                '<div class="bold">',
                `<div class="bold">${i}. `
            );
        } else {
            console.log('No bold div found, adding at beginning');
            entryContent = `${i}. ` + entryContent;
        }
        console.log(`After: "${entryContent.substring(0, 100)}..."`);
        numberedHtml += `<div class="entry">` + entryContent;
    }
    
    return numberedHtml;
}

const result = addNumberingToSection(sampleEducation, 'education');
console.log('\n=== FINAL RESULT ===');
console.log(result);
