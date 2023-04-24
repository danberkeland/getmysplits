import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatData, formatLapTime, formatTime } from "./utils";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps1, setLaps1] = useState([]);
  const [laps2, setLaps2] = useState([]);
  const intervalRef = useRef();
  const [lapData, setLapData] = useState([]);

  useEffect(() => {
    setLapData(formatData(laps1 || laps2));
  }, [laps1, laps2]);

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

  const handleLap1 = () => {
    if (isRunning) {
      setLaps1([...laps1, elapsedTime]);
    }
  };

  const handleLap2 = () => {
    if (isRunning) {
      setLaps2([...laps2, elapsedTime]);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps1([]);
    setLaps2([]);
    clearInterval(intervalRef.current);
  };

  const splitLabel1 = (
    <div className="lapBox">
      <span className="runnerName">{`Runner 1`}</span>
      <span className="lapNumber">{`Lap ${laps1.length}`}</span>
      <span className="lapTime">{`${formatLapTime(
        laps1[laps1.length - 1] - (laps1[laps1.length - 2] || 0)
      )}`}</span>
    </div>
  );

  const splitLabel2 = (
    <div className="lapBox">
      <span className="runnerName">{`Runner 2`}</span>
      <span className="lapNumber">{`Lap ${laps2.length}`}</span>
      <span className="lapTime">{`${formatLapTime(
        laps2[laps2.length - 1] - (laps2[laps2.length - 2] || 0)
      )}`}</span>
    </div>
  );

  const runners = [
    { laps: laps1, label: splitLabel1 },
    { laps: laps2, label: splitLabel2 },
  ];

  const splitLabelZero = "SPLIT";

  return (
    <div>
      <h1>Stopwatch</h1>
      <div className="runningTime" style={{ fontSize: "3em" }}>
        {formatTime(elapsedTime)}
      </div>
      <div className="twoRunners">
        {runners.map((runner) => (
          <div style={{ fontSize: "3.5em" }} key={runner.label}>
            <span className="previousSplits"></span>
            <br />
            <span
              className="lapBox"
              onClick={runner.laps === laps1 ? handleLap1 : handleLap2}
            >
              {runner.laps.length > 0 ? runner.label : splitLabelZero}
            </span>
          </div>
        ))}
      </div>
      <div>
        {isRunning ? (
          <Button
            label="Stop"
            className="p-button-lg p-button-danger"
            onClick={handleStop}
          />
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
          disabled={laps1.length === 0 && !isRunning}
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
