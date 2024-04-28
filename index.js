"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./main.css");
const pdf_1 = require("./pdf");
const pdfjsLib = __importStar(require("pdfjs-dist"));
const pdfjsWorkerEntry = require('pdfjs-dist/build/pdf.worker.entry.js');
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerEntry;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const load = async () => {
    // le pdf est en base64 car le site des impôts n'accepte pas les requêtes cors
    const pdfDoc = await pdfjsLib.getDocument(pdf_1.pdf).promise;
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    var renderContext = {
        canvasContext: ctx,
        viewport: viewport,
    };
    canvas.height = renderContext.viewport.height;
    canvas.width = renderContext.viewport.width;
    await page.render(renderContext).promise;
    function getMousePos(e) {
        var rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    canvas.addEventListener('click', function (e) {
        const pos = getMousePos(e);
        /// check x and y against the grid
        const [x, y] = viewport.convertToPdfPoint(pos.x, pos.y);
        const currPos = [parseInt(x, 10), parseInt(y, 10)];
        document.getElementById('coord').textContent = `${currPos[0]}, ${currPos[1]}`;
    }, false);
};
load();
