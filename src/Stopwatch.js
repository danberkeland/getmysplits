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
  const [laps3, setLaps3] = useState([]);
  const [laps4, setLaps4] = useState([]);
  const [clicked, setClicked] = useState(0)
  
  const intervalRef = useRef();
  const [lapData, setLapData] = useState();

  useEffect(() => {
    console.log("lapData", lapData);
  }, [lapData]);

  useEffect(() => {
    setLapData(formatData(laps1));
  }, [laps1]);

  useEffect(() => {
    setLapData(formatData(laps2));
  }, [laps2]);

  useEffect(() => {
    setLapData(formatData(laps3));
  }, [laps3]);

  useEffect(() => {
    setLapData(formatData(laps4));
  }, [laps4]);

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

  const handleLap = (runner) => {
    if (isRunning) {
      if (runner === 1) {
        setLaps1([...laps1, elapsedTime]);
      }
      if (runner === 2) {
        setLaps2([...laps2, elapsedTime]);
      }
      if (runner === 3) {
        setLaps3([...laps3, elapsedTime]);
      }
      if (runner === 4) {
        setLaps4([...laps4, elapsedTime]);
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps1([]);
    setLaps2([]);
    setLaps3([]);
    setLaps4([]);
    clearInterval(intervalRef.current);
  };

  const splitLabel1 = (
    <div className={clicked===1 ? `lapBox lapBox1` : `lapBox`}>
      <span className="runnerName">{`Runner 1`}</span>
      <span className="lapNumber">{`Lap ${laps1.length}`}</span>
      <span className="lapTime">{`${formatLapTime(
        laps1[laps1.length - 1] - (laps1[laps1.length - 2] || 0)
      )}`}</span>
    </div>
  );

  const splitLabel2 = (
    <div className={clicked===2 ? `lapBox lapBox1` : `lapBox`}>
      <span className="runnerName">{`Runner 2`}</span>
      <span className="lapNumber">{`Lap ${laps2.length}`}</span>
      <span className="lapTime">{`${formatLapTime(
        laps2[laps2.length - 1] - (laps2[laps2.length - 2] || 0)
      )}`}</span>
    </div>
  );

  const splitLabel3 = (
    <div className={clicked===3 ? `lapBox lapBox1` : `lapBox`}>
      <span className="runnerName">{`Runner 3`}</span>
      <span className="lapNumber">{`Lap ${laps3.length}`}</span>
      <span className="lapTime">{`${formatLapTime(
        laps3[laps3.length - 1] - (laps3[laps3.length - 2] || 0)
      )}`}</span>
    </div>
  );

  const splitLabel4 = (
    <div className={clicked===4 ? `lapBox lapBox1` : `lapBox`}>
      <span className="runnerName">{`Runner 4`}</span>
      <span className="lapNumber">{`Lap ${laps4.length}`}</span>
      <span className="lapTime">{`${formatLapTime(
        laps4[laps4.length - 1] - (laps4[laps4.length - 2] || 0)
      )}`}</span>
    </div>
  );

  const runners = [
    { laps: laps1, label: splitLabel1, ct: 1, key: "r1" },
    { laps: laps2, label: splitLabel2, ct: 2, key: "r2" },
    { laps: laps3, label: splitLabel3, ct: 3, key: "r3" },
    { laps: laps4, label: splitLabel4, ct: 4, key: "r4" },
  ];

  const splitLabelZero = "SPLIT";

  const handleClick = (ct) => {
    console.log("ct", ct);
    handleLap(ct);
    setClicked(ct);
    setTimeout(() => {
      setClicked(0);
    }, 1000);
  };

  return (
    <div>
      <h1>Get My Splits</h1>
      <div className="runningTime" style={{ fontSize: "3em" }}>
        {formatTime(elapsedTime)}
      </div>
      <div className="fourRunners">
        {runners.map((runner) => (
          <div style={{ fontSize: "3.5em" }} key={runner.key}>
            <span className="previousSplits"></span>

            <span key={runner.key} className={clicked===runner.ct ? `lapBox lapBox${runner.ct}` : `lapBox`} onClick={() => handleClick(runner.ct)}>
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
