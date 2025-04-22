function drawPattern() {
    const bustInput = parseFloat(document.getElementById("bust").value);
    const unit = document.getElementById("units").value;
    const svg = document.getElementById("pattern");
    svg.innerHTML = ""; // clear pattern
  
    const bust = unit === "in" ? bustInput * 2.54 : bustInput;
  
    const bodiceWidth = bust / 4 + 2; // cm
    const bodiceHeight = 40; // cm
  
    // Set the SVG size dynamically to fit the pattern
    const margin = 2; // cm margin
    const totalWidth = bodiceWidth + margin * 2;
    const totalHeight = bodiceHeight + margin * 2;
  
    svg.setAttribute("width", totalWidth + "cm");
    svg.setAttribute("height", totalHeight + "cm");
    svg.setAttribute("viewBox", `0 0 ${totalWidth} ${totalHeight}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", margin);
    rect.setAttribute("y", margin);
    rect.setAttribute("width", bodiceWidth);
    rect.setAttribute("height", bodiceHeight);
    rect.setAttribute("stroke", "black");
    rect.setAttribute("fill", "none");
  
    svg.appendChild(rect);
  }
function exportAsSVG() {
    const svg = document.getElementById("pattern");
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
  
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "pattern.svg";
    link.click();
  
    URL.revokeObjectURL(url); // clean up
  }
function exportAsPDF() {
    const { jsPDF } = window.jspdf;
    const svg = document.getElementById("pattern");
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
  
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    const img = new Image();
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
  
    img.onload = function () {
      const CM_TO_PT = 28.35; // 1 cm = 28.35 pt
      const widthCM = 21;
      const heightCM = 29.7;
  
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [widthCM * CM_TO_PT, heightCM * CM_TO_PT],
      });
  
      // Scale image to fit full page at 72 DPI (standard for jsPDF)
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
  
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        widthCM * CM_TO_PT,
        heightCM * CM_TO_PT
      );
      pdf.save("pattern.pdf");
  
      URL.revokeObjectURL(url);
    };
  
    img.src = url;
  }
  
