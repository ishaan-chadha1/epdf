import './main.css';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
const fileInputElement = document.getElementById('fileInput') as HTMLInputElement;

let loadedPdf: pdfjsLib.PDFDocumentProxy | null = null;
interface PdfPoint {
  x: number;
  y: number;
}

fileInputElement.addEventListener('change', (event) => {
  const files = fileInputElement.files;
  if (files && files[0] && files[0].type === 'application/pdf') {
    handleFileUpload(files[0]);
  } else {
    alert('Please upload a PDF file.');
  }
}, false);

async function handleFileUpload(file: File) {
  const fileReader = new FileReader();

  fileReader.onload = async (event) => {
    const arrayBuffer = event.target?.result;
    if (arrayBuffer instanceof ArrayBuffer) {
      const typedArray = new Uint8Array(arrayBuffer);

      loadedPdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      renderPage(1); // Renders the first page
    }
  };

  fileReader.readAsArrayBuffer(file);
}

async function renderPage(pageNumber: number) {
  if (!loadedPdf) {
    console.error('PDF is not loaded');
    return;
  }

  const page = await loadedPdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.5 });

  canvasElement.height = viewport.height;
  canvasElement.width = viewport.width;

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport
  };

  await page.render(renderContext).promise;
}

// Helper function to get mouse position relative to the canvas
function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// Event listener for mouse click to display PDF coordinates
canvasElement.addEventListener('click', (evt) => {
  if (!loadedPdf) {
    alert('No PDF loaded');
    return;
  }

  const scale = 1.5; // The scale at which the PDF is being displayed
  const pageNumber = 1; // Assuming you're working with the first page

  loadedPdf.getPage(pageNumber).then((page) => {
    const viewport = page.getViewport({ scale: scale });
    const rect = canvasElement.getBoundingClientRect();
    
    // Convert click coordinates to canvas coordinates
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    
    // Convert canvas coordinates to viewport (PDF) coordinates
    const viewportPoint = viewport.convertToViewportPoint(x, y);

    // viewportPoint is an array [pdfX, pdfY], not an object
    const pdfX = viewportPoint[0];
    const pdfY = viewportPoint[1];

    // Update displayed coordinates
    const coordElement = document.getElementById('coord');
    if (coordElement) {
      coordElement.textContent = `X: ${pdfX.toFixed(2)}, Y: ${pdfY.toFixed(2)}`;
    }
  });
}, false);