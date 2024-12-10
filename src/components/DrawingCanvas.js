import React, { useState, useEffect } from 'react';

const DrawingCanvas = ({ selectedScreen, orientation, floorDistance, receptacleBox, installationType, nicheDepth, nicheGap, dimensions }) => {
  const [scale, setScale] = useState(1); // State to handle zoom level

  useEffect(() => {
    // Reset zoom level when the selected screen changes
    setScale(1);
  }, [selectedScreen]);

  // Parse width and height to numbers only if selectedScreen is defined
  const actualScreenWidth = selectedScreen ? parseFloat(selectedScreen.Width) : null;
  const actualScreenHeight = selectedScreen ? parseFloat(selectedScreen.Height) : null;

  // Set default dimensions for simple TV diagram if screen is selected
  const screenWidth = 500;
  const screenHeight = 300;

  // Adjust dimensions based on orientation
  const adjustedWidth = orientation === 'Horizontal' ? screenWidth * scale : screenHeight * scale;
  const adjustedHeight = orientation === 'Horizontal' ? screenHeight * scale : screenWidth * scale;


  // Determine the gap (default or user-adjusted)
  const gap = selectedScreen
    ? selectedScreen.Diagonal <= 55
      ? nicheGap || 1.5 // Default: 1.5" for screens <= 55"
      : nicheGap || 2 // Default: 2" for screens > 55"
    : 0;


  useEffect(() => {
    const canvas = document.getElementById('tvCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedScreen && dimensions) {
      const { actualScreenWidth, actualScreenHeight, adjustedNicheWidth, adjustedNicheHeight } = dimensions;
    }

    // Draw only if a screen model is selected
    if (selectedScreen) {
      // Draw the TV rectangle
      const rectX = (canvas.width - adjustedWidth) / 2;
      const rectY = (canvas.height - adjustedHeight) / 2;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 4;
      ctx.strokeRect(rectX, rectY, adjustedWidth, adjustedHeight);

      if (installationType === 'Niche') {
        const nicheGap = selectedScreen.ScreenSize
          > 55 ? 2 : 1.5;
        const adjustedNicheHeight = actualScreenHeight + (nicheGap + nicheDepth);
        const adjustedNicheWidth = actualScreenWidth + (nicheGap + nicheDepth);
        // Draw the niche rectangle
        const nicheWidth = adjustedWidth + (gap * 2 + 40) * scale; // Add additional padding (10 units)
        const nicheHeight = adjustedHeight + (gap * 2 + 40) * scale; // Add additional padding (10 units)
        const nicheX = rectX - (gap + 20) * scale; // Shift further outward (5 units)
        const nicheY = rectY - (gap + 20) * scale; // Shift further outward (5 units)

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.setLineDash([]); // Dashed line for niche
        ctx.strokeRect(nicheX, nicheY, nicheWidth, nicheHeight);
        // Niche dimension labels
        ctx.font = '14px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`${adjustedNicheWidth.toFixed(2)}"`, nicheX + nicheWidth / 2 - 40, nicheY - 10);
        ctx.fillText(`${adjustedNicheHeight.toFixed(2)}"`, nicheX - 30, nicheY - 40 + nicheHeight / 2);
      }

      // Draw recessed rectangle (smaller than TV rectangle)
      const recessedPadding = 20; // Padding to shrink the recessed rectangle
      const recessedWidth = adjustedWidth - recessedPadding * 2;
      const recessedHeight = adjustedHeight - recessedPadding * 2;
      const recessedX = rectX + recessedPadding;
      const recessedY = rectY + recessedPadding;

      ctx.strokeStyle = 'gray';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]); // Dashed line for recessed rectangle
      ctx.strokeRect(recessedX, recessedY, recessedWidth, recessedHeight);

      // Reset dashed lines for subsequent drawings
      ctx.setLineDash([]);

      // Draw height line with arrows and label
      ctx.beginPath();
      ctx.moveTo(rectX + adjustedWidth + 15, rectY); // Start at top edge
      ctx.lineTo(rectX + adjustedWidth + 15, rectY + adjustedHeight); // End at bottom edge
      ctx.strokeStyle = 'black';
      ctx.setLineDash([]);
      ctx.stroke();

      // Draw arrows for height line
      ctx.beginPath();
      ctx.moveTo(rectX + adjustedWidth + 10, rectY); // Top arrow
      ctx.lineTo(rectX + adjustedWidth + 20, rectY);
      ctx.lineTo(rectX + adjustedWidth + 15, rectY - 5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(rectX + adjustedWidth + 10, rectY + adjustedHeight); // Bottom arrow
      ctx.lineTo(rectX + adjustedWidth + 20, rectY + adjustedHeight);
      ctx.lineTo(rectX + adjustedWidth + 15, rectY + adjustedHeight + 5);
      ctx.closePath();
      ctx.fill();

      // Draw height label
      ctx.font = '14px Arial';
      ctx.fillText(`${actualScreenHeight.toFixed(2)}"`, rectX + adjustedWidth + 50, rectY - 5 + adjustedHeight / 2);

      // Draw width line with arrows and label
      ctx.beginPath();
      ctx.moveTo(rectX, rectY + adjustedHeight + 15); // Start at left edge
      ctx.lineTo(rectX + adjustedWidth, rectY + adjustedHeight + 15); // End at right edge
      ctx.strokeStyle = 'black';
      ctx.setLineDash([]);
      ctx.stroke();

      // Draw arrows for width line
      ctx.beginPath();
      ctx.moveTo(rectX, rectY + adjustedHeight + 10); // Left arrow
      ctx.lineTo(rectX, rectY + adjustedHeight + 20);
      ctx.lineTo(rectX - 5, rectY + adjustedHeight + 15);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(rectX + adjustedWidth, rectY + adjustedHeight + 10); // Right arrow
      ctx.lineTo(rectX + adjustedWidth, rectY + adjustedHeight + 20);
      ctx.lineTo(rectX + adjustedWidth + 5, rectY + adjustedHeight + 15);
      ctx.closePath();
      ctx.fill();

      // Draw width label
      ctx.font = '14px Arial';
      ctx.fillText(`${actualScreenWidth.toFixed(2)}"`, rectX - 5 + adjustedWidth / 2 - 20, rectY + adjustedHeight + 35);



      const maxFloorDistance = Math.min(floorDistance, 150); // Cap the floor distance at 150
      const floorLineY = Math.min(rectY + adjustedHeight + maxFloorDistance * scale, canvas.height - 10);

      // Draw the floor line
      ctx.beginPath();
      ctx.moveTo(0, floorLineY);
      ctx.lineTo(canvas.width, floorLineY);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '16px Arial';
      ctx.fillText(`Floor Line `, canvas.width / 2 - 320, floorLineY - 10);

      // Draw centerline of display horizontally (extended by 30%)
      ctx.beginPath();
      ctx.moveTo(rectX - adjustedWidth * 0.15, rectY + adjustedHeight / 2);
      ctx.lineTo(rectX + adjustedWidth * 1.15, rectY + adjustedHeight / 2);
      ctx.strokeStyle = 'black';
      ctx.setLineDash([5, 5]);
      ctx.stroke();

      // Draw centerline of display vertically (extended by 30%)
      ctx.beginPath();
      ctx.moveTo(rectX + adjustedWidth / 2, rectY - adjustedHeight * 0.15);
      ctx.lineTo(rectX + adjustedWidth / 2, rectY + adjustedHeight * 1.15);
      ctx.strokeStyle = 'black';
      ctx.setLineDash([5, 5]);
      ctx.stroke();

      // Draw labels for centerlines
      ctx.setLineDash([]);
      ctx.font = '16px Arial';
      ctx.fillText('Centerline of Display', rectX + adjustedWidth / 2 + 10, rectY - 50);

      // Draw intended screen position point
      ctx.beginPath();
      ctx.arc(rectX + adjustedWidth / 2, rectY + adjustedHeight / 2, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'black';
      ctx.fill();

      // Draw label for intended screen position point
      ctx.beginPath();
      ctx.moveTo(rectX + adjustedWidth / 2, rectY + adjustedHeight / 2);
      ctx.lineTo(rectX + adjustedWidth + 50, rectY - 50);
      ctx.strokeStyle = 'black';
      ctx.setLineDash([]);
      ctx.stroke();

      ctx.font = '12px Arial';
      ctx.fillText('Intended Screen Position', rectX + 28 + adjustedWidth + 55, rectY - 55);

      // Draw floor distance line from intended screen position point to floor line
      const floorDistanceY = floorLineY - floorDistance;
      ctx.beginPath();
      ctx.moveTo(rectX - 30, rectY + adjustedHeight / 2);
      ctx.lineTo(rectX - 30, floorLineY);
      ctx.strokeStyle = 'black';
      ctx.setLineDash([]);
      ctx.stroke();

      // Draw floor distance label
      ctx.font = '16px Arial';
      ctx.fillText(`${floorDistance}"`, rectX - 70, (rectY + adjustedHeight / 2 + floorLineY) / 2);

      // Draw receptacle box (static size with labeled dimensions)
      const receptacleX = rectX + adjustedWidth / 2 - 50 / 2;
      const receptacleY = rectY + adjustedHeight + 30 - 150;
      const receptacleWidth = 65;
      const receptacleHeight = 60;
      const receptacleDepth = receptacleBox.depth || 0;

      // Draw the main receptacle box
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(receptacleX, receptacleY, receptacleWidth, receptacleHeight);
      ctx.stroke();

      if (`${receptacleBox.depth}` > 0) {
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(receptacleX - receptacleDepth, receptacleY - receptacleDepth, receptacleWidth + receptacleDepth * 2, receptacleHeight + receptacleDepth * 2);
        ctx.stroke();
      }

      // Draw recessed box point in the center of the receptacle box
      ctx.beginPath();
      ctx.arc(
        receptacleX + receptacleWidth / 2, // Center of the receptacle box (X coordinate)
        receptacleY + receptacleHeight / 2, // Center of the receptacle box (Y coordinate)
        5, // Radius of the dot
        0,
        2 * Math.PI
      );
      ctx.fillStyle = 'black';
      ctx.fill();

      // Draw label for recessed box point
      ctx.beginPath();
      ctx.moveTo(receptacleX + receptacleWidth / 2, receptacleY + receptacleHeight / 2);
      ctx.lineTo(rectX + adjustedWidth + 50, rectY - 100); // Adjust line endpoint to move above intended screen label
      ctx.strokeStyle = 'black';
      ctx.setLineDash([]);
      ctx.stroke();

      ctx.font = '12px Arial';
      ctx.fillText('Install Recessed Receptacle Box', rectX + adjustedWidth + 55, rectY - 105);
    }
    else {
      // Display message if no screen model is selected
      ctx.font = '20px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText('Please select a model to get started', canvas.width / 2, canvas.height / 2);
    }
  }, [selectedScreen, orientation, scale, floorDistance, receptacleBox, installationType, nicheGap, nicheDepth, dimensions]);

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.1, 5)); // Limit zoom to a maximum of 5x
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale * 0.9, 0.5)); // Limit zoom to a minimum of 0.5x
  };

  return (
    <div className="drawing-canvas" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <canvas id="tvCanvas" width={800} height={600} style={{ border: '1px solid #ccc' }}></canvas>
      <div className="zoom-controls" style={{ marginTop: '10px' }}>
        <button onClick={handleZoomIn} style={{ marginRight: '10px', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>Zoom In</button>
        <button onClick={handleZoomOut} style={{ padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>Zoom Out</button>
      </div>
    </div>
  );
};

export default DrawingCanvas;