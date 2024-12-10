import React, { useState, useEffect } from 'react';
import './App.css';
import DrawingCanvas from './components/DrawingCanvas';
import ToggleButtonGroup from './components/ToggleButtonGroup';
import DropdownMenus from './components/DropdownMenus';
import ProjectInformationForm from './components/ProjectInformationForm';
import PDFDownloadButton from './components/PDFDownloadButton';
import * as XLSX from 'xlsx';

function App() {
  const [screenOptions, setScreenOptions] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [mountOptions, setMountOptions] = useState([]);
  const [mediaPlayerOptions, setMediaPlayerOptions] = useState([]);
  const [receptacleBox, setReceptacleBox] = useState([]);
  const [receptacleBoxOptions, setReceptacleBoxOptions] = useState([]);
  const [orientation, setOrientation] = useState('Horizontal');
  const [installationType, setInstallationType] = useState('Flat Wall');
  const [floorDistance, setFloorDistance] = useState(50);
  const [nicheDepth, setNicheDepth] = useState(0.5); // Default depth variance
  const [nicheGap, setNicheGap] = useState(1.5); // Default to 1.5 inches
  const [projectInfo, setProjectInfo] = useState({
    title: '',
    designer: '',
    department: '',
    date: new Date().toLocaleDateString(),
  }
  );

  const calculateDimensions = () => {
    if (!selectedScreen) {
      return {
        actualScreenWidth: 0,
        actualScreenHeight: 0,
        adjustedNicheWidth: 0,
        adjustedNicheHeight: 0,
        rheight: 0,
        rwidth: 0,
        rdepth: 0,
      };
    }

    const actualScreenWidth = parseFloat(selectedScreen.Width);
    const actualScreenHeight = parseFloat(selectedScreen.Height);
    const gap = selectedScreen.Diagonal <= 55 ? nicheGap || 1.5 : nicheGap || 2;
    const adjustedNicheWidth = actualScreenWidth + (nicheGap + nicheDepth);
    const adjustedNicheHeight = actualScreenHeight + (nicheGap + nicheDepth);
    const rheight = receptacleBox ? parseFloat(receptacleBox.Height) || 0 : 0;
    const rwidth = receptacleBox ? parseFloat(receptacleBox.Width) || 0 : 0;
    const rdepth = receptacleBox ? parseFloat(receptacleBox.Depth) || 0 : 0;

    return {
      actualScreenWidth,
      actualScreenHeight,
      adjustedNicheWidth,
      adjustedNicheHeight,
      rheight,
      rwidth,
      rdepth,
    };
  };

  const dimensions = calculateDimensions();


  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.PUBLIC_URL}/PDF Builder .xlsx`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      const screenData = XLSX.utils.sheet_to_json(workbook.Sheets['Screen MFR']);
      const mountData = XLSX.utils.sheet_to_json(workbook.Sheets['Mounts']);
      const mediaPlayerData = XLSX.utils.sheet_to_json(workbook.Sheets['Media Player MFR']);
      const receptacleBoxData = XLSX.utils.sheet_to_json(workbook.Sheets['Receptacle Box']);

      setScreenOptions(screenData);
      setMountOptions(mountData);
      setMediaPlayerOptions(mediaPlayerData);
      setReceptacleBoxOptions(receptacleBoxData);


    }

    fetchData();
  }, []);

  const handleScreenChange = (screen) => setSelectedScreen(screen);
  const handleMountTypeChange = (mountType) => console.log('Selected Mount Type:', mountType);
  const handleMediaPlayerChange = (mediaPlayer) => console.log('Selected Media Player:', mediaPlayer);
  const handleReceptacleBoxChange = (receptacleBoxIndex) => {
    setReceptacleBox(receptacleBoxOptions[receptacleBoxIndex]);
  };
  const calculateNicheDepth = () => {
    if (!selectedScreen || !mountOptions || !mediaPlayerOptions) return 0;

    const screenDepth = parseFloat(selectedScreen.Depth) || 0;
    const mountDepth = parseFloat(mountOptions.Depth) || 0;
    const mediaPlayerDepth = parseFloat(mediaPlayerOptions.Depth) || 0;

    return screenDepth + Math.max(mountDepth, mediaPlayerDepth) + nicheDepth;
  };
  const calcNicheDepth = calculateNicheDepth();

  return (
    <div className="App">
      <h3 className="text-center my-4">LED Screen Installation Tool</h3>
      <div className="app-layout">
        <div className="canvas-section">
          <DrawingCanvas
            selectedScreen={selectedScreen}
            orientation={orientation}
            floorDistance={floorDistance}
            receptacleBox={receptacleBox}
            nicheDepth={nicheDepth}
            nicheGap={nicheGap}
            installationType={installationType}
            dimensions={dimensions}
          />
        </div>
        <div className="info-section">
          {dimensions && (
            <>
              {installationType === 'Niche' && (
                <div className="info-box">
                  <h3>Niche Dimensions:</h3>
                  <div>
                    <label>Height:</label> <span>{dimensions.adjustedNicheHeight.toFixed(2)}"</span>
                  </div>
                  <div>
                    <label>Width:</label> <span>{dimensions.adjustedNicheWidth.toFixed(2)}"</span>
                  </div>
                  <div>
                    <label>Depth:</label> <span>{calcNicheDepth}"</span>
                  </div>
                </div>
              )}
              <div className="info-box">
                <h3>Screen Dimensions:</h3>
                <div>
                  <label>Height:</label> <span>{dimensions.actualScreenHeight}"</span>
                </div>
                <div>
                  <label>Width:</label> <span>{dimensions.actualScreenWidth}"</span>
                </div>
                <div>
                  <label>Floor Line:</label> <span>{floorDistance}"</span>
                </div>
              </div>
              {dimensions.rheight!=0 &&(<div className="info-box">
                  <h3>Notes:</h3>
                  <p>Install recessed receptacle box with:</p>
                  <ul>
                    <li>2x Terminated Power Outlets</li>
                    <li>1x Terminated Data CAT5 Ethernet Outlet</li>
                  </ul>
                  <div>
                    <label>Height:</label> <span>{dimensions.rheight}"</span>
                  </div>
                  <div>
                    <label>Width:</label> <span>{dimensions.rwidth}"</span>
                  </div>
                  <div>
                    <label>Depth:</label> <span>{dimensions.rdepth}"</span>
                  </div>
                </div>)}
                
            </>
          )}
        </div>
        <div className="configuration-section">
          <DropdownMenus
            screenOptions={screenOptions}
            mountOptions={mountOptions}
            mediaPlayerOptions={mediaPlayerOptions}
            receptacleBoxOptions={receptacleBoxOptions}
            onScreenChange={handleScreenChange}
            setMountType={handleMountTypeChange}
            setMediaPlayer={handleMediaPlayerChange}
            setReceptacleBox={(index) => handleReceptacleBoxChange(index)}
            orientation={orientation}
            setOrientation={setOrientation}
            installationType={installationType}
            setInstallationType={setInstallationType}
            floorDistance={floorDistance}
            setFloorDistance={setFloorDistance}
            nicheDepth={nicheDepth}
            setNicheDepth={setNicheDepth}
            nicheGap={nicheGap}
          />
          <ProjectInformationForm projectInfo={projectInfo} setProjectInfo={setProjectInfo} />
          <PDFDownloadButton
            projectInfo={projectInfo}
            screenModel={selectedScreen}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
