// Import from the internal path to skip pdf-parse's startup test,
// which triggers pdfjs-dist's browser-only canvas/DOMMatrix requirement.
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const extractTextFromPDF = async (buffer) => {
  const data = await pdfParse(buffer);

  const cleanText = data.text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanText) throw new Error("PDF appears to be empty or image-only");

  return cleanText;
};

export default extractTextFromPDF;
