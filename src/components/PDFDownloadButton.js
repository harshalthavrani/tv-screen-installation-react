import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFDownloadButton = ({ projectInfo, screenModel }) => {
  const downloadPDF = async () => {
    if (!screenModel||!projectInfo.title || !projectInfo.designer || !projectInfo.department) {
      alert("Please fill out the project info and select a screen model to download the PDF.");
      return;
    }
    const doc = new jsPDF();

    // Add Project Information
    doc.setFontSize(16);
    doc.text("Project Information", 10, 10);
    doc.setFontSize(12);
    doc.text(`Title: ${projectInfo.title}`, 10, 20);
    doc.text(`Designer: ${projectInfo.designer}`, 10, 30);
    doc.text(`Department: ${projectInfo.department}`, 10, 40);
    doc.text(`Date: ${projectInfo.date}`, 10, 50);

    // Add Space
    doc.setFontSize(16);
    doc.text("Installation Details", 10, 70);

    // Capture the canvas
    const canvasElement = document.getElementById('tvCanvas');
    if (canvasElement) {
      const canvasImage = await html2canvas(canvasElement);
      const canvasDataURL = canvasImage.toDataURL('image/png');
      const imgWidth = 180;
      const imgHeight = (canvasElement.height / canvasElement.width) * imgWidth;
      doc.addImage(canvasDataURL, 'PNG', 10, 80, imgWidth, imgHeight);
    }

    // Capture the info section
    const infoSection = document.querySelector('.info-section');
    if (infoSection) {
      const infoImage = await html2canvas(infoSection);
      const infoDataURL = infoImage.toDataURL('image/png');
      const imgWidth = 180;
      const imgHeight = (infoSection.offsetHeight / infoSection.offsetWidth) * imgWidth;
      doc.addPage();
      doc.addImage(infoDataURL, 'PNG', 10, 10, imgWidth, imgHeight);
    }

    // Save the PDF
    doc.save('installation_diagram.pdf');
  };

  return (
    <button onClick={downloadPDF}>Download PDF</button>
  );
};

export default PDFDownloadButton;
