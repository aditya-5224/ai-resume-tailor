import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';

/**
 * Converts HTML content to DOCX elements
 * @param {string} htmlContent - The HTML content to convert
 * @returns {Array} - Array of DOCX elements
 */
export function htmlToDocxElements(htmlContent) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  return parseHtmlNode(tempDiv);
}

/**
 * Parses an HTML node and converts it to DOCX elements
 * @param {Node} node - The HTML node to parse
 * @returns {Array} - Array of DOCX elements
 */
function parseHtmlNode(node) {
  const elements = [];
  
  // Handle text nodes
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    if (text) {
      return [new TextRun(text)];
    }
    return [];
  }
  
  // Handle element nodes
  if (node.nodeType === Node.ELEMENT_NODE) {
    // Get inline styling information
    const computedStyle = window.getComputedStyle(node);
    const isBold = computedStyle.fontWeight >= 600;
    const isItalic = computedStyle.fontStyle === 'italic';
    const isUnderlined = computedStyle.textDecoration.includes('underline');
    const fontSize = parseInt(computedStyle.fontSize);
    
    // Handle different element types
    switch (node.tagName.toLowerCase()) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const level = parseInt(node.tagName.charAt(1));
        const children = [];
        for (const child of node.childNodes) {
          children.push(...parseHtmlNode(child));
        }
        elements.push(new Paragraph({
          text: node.textContent,
          heading: Object.values(HeadingLevel)[level - 1],
          bold: true,
        }));
        break;
      }
      
      case 'p': {
        const children = [];
        for (const child of node.childNodes) {
          children.push(...parseHtmlNode(child));
        }
        elements.push(new Paragraph({
          children: children.length > 0 ? children : [new TextRun('')],
          alignment: computedStyle.textAlign === 'center' ? AlignmentType.CENTER : 
                    computedStyle.textAlign === 'right' ? AlignmentType.RIGHT : 
                    AlignmentType.LEFT
        }));
        break;
      }
      
      case 'strong':
      case 'b': {
        const children = [];
        for (const child of node.childNodes) {
          const childElements = parseHtmlNode(child);
          for (const element of childElements) {
            if (element instanceof TextRun) {
              children.push(new TextRun({
                text: element.text,
                bold: true,
                size: element.size,
                italic: element.italic,
                underline: element.underline,
              }));
            } else {
              children.push(element);
            }
          }
        }
        elements.push(...children);
        break;
      }
      
      case 'em':
      case 'i': {
        const children = [];
        for (const child of node.childNodes) {
          const childElements = parseHtmlNode(child);
          for (const element of childElements) {
            if (element instanceof TextRun) {
              children.push(new TextRun({
                text: element.text,
                bold: element.bold,
                size: element.size,
                italic: true,
                underline: element.underline,
              }));
            } else {
              children.push(element);
            }
          }
        }
        elements.push(...children);
        break;
      }
      
      case 'u': {
        const children = [];
        for (const child of node.childNodes) {
          const childElements = parseHtmlNode(child);
          for (const element of childElements) {
            if (element instanceof TextRun) {
              children.push(new TextRun({
                text: element.text,
                bold: element.bold,
                size: element.size,
                italic: element.italic,
                underline: true,
              }));
            } else {
              children.push(element);
            }
          }
        }
        elements.push(...children);
        break;
      }
      
      case 'br': {
        elements.push(new TextRun({ text: "", break: 1 }));
        break;
      }
      
      case 'ul':
      case 'ol': {
        for (const child of node.childNodes) {
          if (child.tagName && child.tagName.toLowerCase() === 'li') {
            const bullet = node.tagName.toLowerCase() === 'ul' ? '• ' : 
              `${Array.from(node.children).indexOf(child) + 1}. `;
            
            const listItemChildren = [];
            for (const liChild of child.childNodes) {
              listItemChildren.push(...parseHtmlNode(liChild));
            }
            
            if (listItemChildren.length > 0) {
              elements.push(new Paragraph({
                children: [
                  new TextRun(bullet),
                  ...listItemChildren
                ],
                indent: { left: 720 }, // 0.5 inch indent
              }));
            }
          }
        }
        break;
      }
      
      case 'a': {
        elements.push(new TextRun({
          text: node.textContent,
          style: { ...isBold && { bold: true }, ...isItalic && { italic: true } },
          color: '0000FF',
          underline: true,
        }));
        break;
      }
      
      case 'span':
      case 'div':
      default: {
        // Process children for default case
        for (const child of node.childNodes) {
          const childElements = parseHtmlNode(child);
          elements.push(...childElements);
        }
      }
    }
  }
  
  return elements;
}

/**
 * Creates a DOCX document from HTML content
 * @param {string} htmlContent - The HTML content to convert
 * @param {string} title - The document title
 * @returns {Document} - DOCX Document
 */
export function createDocxFromHtml(htmlContent, originalResume) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const paragraphs = [];
  for (const child of tempDiv.childNodes) {
    const elements = parseHtmlNode(child);
    
    if (elements.length > 0) {
      // If we have a collection of TextRuns, wrap them in a paragraph
      if (elements[0] instanceof TextRun) {
        paragraphs.push(new Paragraph({ children: elements }));
      } else {
        // Otherwise add the elements directly (they're already Paragraphs)
        paragraphs.push(...elements);
      }
    }
  }
  
  return new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.length > 0 ? paragraphs : [new Paragraph("Resume content")]
      }
    ]
  });
}
