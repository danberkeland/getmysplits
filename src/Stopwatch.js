import React, { useState, useRef, useEffect } from "react";

import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const [lastLapTime, setLastLapTime] = useState(0);
  const [lastElapsedTime, setLastElapsedTime] = useState(0);
  const intervalRef = useRef();
  const [lapData, setLapData] = useState([]);

  useEffect(() => {
    formatData()
  },[laps])

  const formatData = () => {
    const data = [];

    for (let i = 0; i < laps.length; i++) {
      const lapTime = laps[i];
      const lapDiff = lapTime - (laps[i - 1] || 0);
      const time800 = i < 1 ? null : laps[i] - (laps[i-2] || 0);
      const time1600 = i < 3 ? null : laps[i] - (laps[i - 4] || 0);

      data.push({
        lap: i + 1,
        lapTime: formatLapTime(lapDiff),
        cumulativeLapTime: time800 ? formatLapTime(time800): '-',
        lap3Diff: time1600 ? formatLapTime(time1600) : '-'
      });
    }

    setLapData(data);
  }


  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 10);
      }, 10);
    }
  };

  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
    }
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, elapsedTime]);
      
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    clearInterval(intervalRef.current);
  };

  const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const formatLapTime = (lapTimeInMs) => {
    if (lapTimeInMs >= 100000) {
      const minutes = Math.floor(lapTimeInMs / 60000);
      const seconds = Math.floor((lapTimeInMs % 60000) / 1000);
      return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
    } else {
      const seconds = Math.floor(lapTimeInMs / 1000);
      const milliseconds = Math.floor((lapTimeInMs % 1000) / 10);
      //return `${seconds.toString()}.${milliseconds.toString().padStart(2, "0")}`;
      return `${seconds.toString()}`;
    }
  };

  const splitLabel = (
    <div className="lapBox">
      <span className="lapNumber">{`Lap ${laps.length}`}</span>
      <span className="lapTime">{`${formatLapTime(
        Number(laps[laps.length - 1]) - Number(laps[laps.length - 2] || 0)
      )}`}</span>
      {/*<span className="lapTime">{`+${formatLapTime(laps[laps.length-1] - laps[laps.length-2] || 0)}`}</span>*/}
    </div>
  );

  const splitLabelZero = "SPLIT"

  

  return (
    <div>
      <h1>Stopwatch</h1>
      <div className="runningTime" style={{ fontSize: "3em" }}>{formatTime(elapsedTime)}</div>

      <div style={{ fontSize: "3.5em" }}>
        <span className="previousSplits"></span>
        <br />
        {
          <span className="lapBox" onClick={handleLap}>
            {laps.length > 0 ? splitLabel : splitLabelZero}
          </span>
        }
      </div>
      

      <div>
        {isRunning ? (
          <>
            <Button
              label="Stop"
              className="p-button-lg p-button-danger"
              onClick={handleStop}
            />
           
          </>
        ) : (
          <Button
            label="Start"
            className="p-button-lg p-button-success"
            onClick={handleStart}
          />
        )}
        <Button
          label="Reset"
          className="p-button-secondary"
          onClick={handleReset}
          disabled={laps.length === 0 && !isRunning}
        />
      </div>
      <DataTable value={lapData}>
      <Column field="lap" header="Lap" />
      <Column field="lapTime" header="400" />
      <Column field="cumulativeLapTime" header="800" />
      <Column field="lap3Diff" header="1600" />
    </DataTable>
    </div>
  );
}

export default Stopwatch;
