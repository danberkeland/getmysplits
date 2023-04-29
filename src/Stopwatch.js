import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { TabMenu } from "primereact/tabmenu";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const formatTime = (timeInMs, startTime) => {
  const elapsedTime = startTime ? timeInMs - startTime : timeInMs;
  const date = new Date(elapsedTime);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "UTC",
    minute: "numeric",
    second: "numeric",
    fractionalSecondDigits: 2,
  });
};

const formatLapTime = (timeInMs, startTime) => {
  const elapsedTime = startTime ? timeInMs - startTime : timeInMs;
  const date = new Date(elapsedTime);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "UTC",
    minute: "numeric",
    second: "numeric"
    
  });
};

const formatData = (laps, startTime) => {
  const data = [];

  for (let i = 0; i < laps.length; i++) {
    const lapTime = laps[i];
    const lapDiff = lapTime - (laps[i - 1] || 0);
    const time800 = i < 1 ? null : laps[i] - (laps[i - 2] || 0);
    const time1600 = i < 3 ? null : laps[i] - (laps[i - 4] || 0);

    data.push({
      lap: i + 1,
      lapTime: i===0 ? formatLapTime(lapDiff, startTime) : formatLapTime(lapDiff),
      cumulativeLapTime: time800 ? formatLapTime(time800, startTime) : "-",
      lap3Diff: time1600 ? formatLapTime(time1600) : "-",
    });
  }

  return data
};


function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps1, setLaps1] = useState([]);
  const [laps2, setLaps2] = useState([]);
  const [laps3, setLaps3] = useState([]);
  const [laps4, setLaps4] = useState([]);
  const [names, setNames] = useState([
    "Runner 1",
    "Runner 2",
    "Runner 3",
    "Runner 4",
  ]);
  const [clicked, setClicked] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [editSplit, setEditSplit] = useState(null);
  const [rowDataToEdit, setRowDataToEdit] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const showDialog2 = () => {
    setVisible2(true);
  };

  const hideDialog2 = () => {
    setVisible2(false);
  };

  const intervalRef = useRef();
  const [lapData, setLapData] = useState();

  const items = [
    { label: names[0] },
    { label: names[1] },
    { label: names[2] },
    { label: names[3] },
  ];

  useEffect(() => {
    console.log("lapData", lapData);
  }, [lapData]);

  useEffect(() => {
    console.log("laps1", laps1);
  }, [laps1]);

  useEffect(() => {
    console.log('startTime', startTime)
  }, [laps1])



  useEffect(() => {
    setLapData(formatData(laps1, startTime));
  }, [laps1]);

  useEffect(() => {
    setLapData(formatData(laps2, startTime));
  }, [laps2]);

  useEffect(() => {
    setLapData(formatData(laps3, startTime));
  }, [laps3]);

  useEffect(() => {
    setLapData(formatData(laps4, startTime));
  }, [laps4]);

  useEffect(() => {
    if (activeIndex === 0) {
      setLapData(formatData(laps1));
    }
    if (activeIndex === 1) {
      setLapData(formatData(laps2));
    }
    if (activeIndex === 2) {
      setLapData(formatData(laps3));
    }
    if (activeIndex === 3) {
      setLapData(formatData(laps4));
    }
  }, [activeIndex]);

  useEffect(() => {
    if (editSplit) {
      let lapsToEdit;
      let SetLapsToEdit;
      if (activeIndex === 0) {
        lapsToEdit = laps1;
        SetLapsToEdit = setLaps1;
      }
      if (activeIndex === 1) {
        lapsToEdit = laps2;
        SetLapsToEdit = setLaps2;
      }
      if (activeIndex === 2) {
        lapsToEdit = laps3;
        SetLapsToEdit = setLaps3;
      }
      if (activeIndex === 3) {
        lapsToEdit = laps4;
        SetLapsToEdit = setLaps4;
      }

      let newNum =
        Number(lapsToEdit[rowDataToEdit.lap - 1]) -
        Number(
          Math.floor(
            (lapsToEdit[rowDataToEdit.lap - 1] -
              (lapsToEdit[rowDataToEdit.lap - 2] || 0)) *
              0.001
          ) * 1000
        ) +
        Number(editSplit * 1000);

      lapsToEdit.splice(rowDataToEdit.lap - 1, 1, newNum);
      setLapData(formatData(lapsToEdit));
    }
  }, [editSplit]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setStartTime(Date.now()); // set start time to current time
      setElapsedTime(0);
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        setElapsedTime(now - startTime); // calculate elapsed time
      }, 10);
    }
  };

  const handleStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      setStartTime(null);
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
    confirmDialog({
      message: "All splits will be deleted.  Are you sure?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => resetTimer(),
    });
  };

  const resetTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      setStartTime(null);
    }
    setIsRunning(false);
    setElapsedTime(0);
    setLaps1([]);
    setLaps2([]);
    setLaps3([]);
    setLaps4([]);
    setStartTime(null); // reset start time
  };
  

  const splitLabel1 = (
    <div className={clicked === 1 ? `lapBox lapBox1` : `lapBox`}>
      <span className="lapNumber">
        {isRunning ? `Lap ${laps1.length}` : `Final`}
      </span>
      <span className="runnerName">{names[0]}</span>
      <span className={isRunning ? "lapTime" : "stopped"}>
        {isRunning
          ? `${formatLapTime(laps1.length>1 ? 
              laps1[laps1.length - 1] - (laps1[laps1.length - 2] || 0) : laps1[laps1.length - 1] - startTime
            )}`
          : `${formatLapTime(laps1[laps1.length - 1])}`}
      </span>
    </div>
  );

  const splitLabel2 = (
    <div className={clicked === 2 ? `lapBox lapBox1` : `lapBox`}>
      <span className="lapNumber">
        {isRunning ? `Lap ${laps2.length}` : `Final`}
      </span>
      <span className="runnerName">{names[1]}</span>
      <span className={isRunning ? "lapTime" : "stopped"}>
        {isRunning
          ? `${formatLapTime(laps2.length>1 ? 
              laps2[laps2.length - 1] - (laps2[laps2.length - 2] || 0) : laps2[laps2.length - 1] - startTime
            )}`
          : `${formatLapTime(laps2[laps2.length - 1])}`}
      </span>
    </div>
  );

  const splitLabel3 = (
    <div className={clicked === 3 ? `lapBox lapBox1` : `lapBox`}>
      <span className="lapNumber">
        {isRunning ? `Lap ${laps3.length}` : `Final`}
      </span>
      <span className="runnerName">{names[2]}</span>
      <span className={isRunning ? "lapTime" : "stopped"}>
        {isRunning
          ? `${formatLapTime(laps3.length>1 ? 
              laps3[laps3.length - 1] - (laps3[laps3.length - 2] || 0) : laps3[laps3.length - 1] - startTime
            )}`
          : `${formatLapTime(laps3[laps3.length - 1])}`}
      </span>
    </div>
  );

  const splitLabel4 = (
    <div className={clicked === 4 ? `lapBox lapBox1` : `lapBox`}>
      <span className="lapNumber">
        {isRunning ? `Lap ${laps4.length}` : `Final`}
      </span>
      <span className="runnerName">{names[3]}</span>
      <span className={isRunning ? "lapTime" : "stopped"}>
        {isRunning
          ? `${formatLapTime(laps4.length>1 ? 
              laps4[laps4.length - 1] - (laps4[laps4.length - 2] || 0) : laps4[laps4.length - 1] - startTime
            )}`
          : `${formatLapTime(laps4[laps4.length - 1])}`}
      </span>
    </div>
  );

  const runners = [
    { laps: laps1, label: splitLabel1, ct: 1, key: "r1", name: names[0] },
    { laps: laps2, label: splitLabel2, ct: 2, key: "r2", name: names[1] },
    { laps: laps3, label: splitLabel3, ct: 3, key: "r3", name: names[2] },
    { laps: laps4, label: splitLabel4, ct: 4, key: "r4", name: names[3] },
  ];

  const handleClick = (ct) => {
    console.log("ct", ct);
    handleLap(ct);
    setClicked(ct);
    setActiveIndex(ct - 1);
    setTimeout(() => {
      setClicked(0);
    }, 1000);
  };

  const handleName = () => {
    setVisible(true);
  };

  const handleNames = (e, index) => {
    // create a copy of the original array
    const newArray = [...names];
    // insert the new element at the specified index
    newArray.splice(index, 1);
    newArray.splice(index, 0, e);
    // update the state with the new array
    setNames(newArray);
  };

  const deleteTemplate = (rowData, index) => {
    
    return (
      <div className="p-d-flex p-jc-center">
        <Button
          size="small"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => handleDelete(activeIndex + 1, index.rowIndex)}
        />

        <Button
          size="small"
          icon="pi pi-arrow-up"
          className="p-button-primary"
          onClick={() => handleAdd(activeIndex + 1, index.rowIndex)}
        />
      </div>
    );
  };

  const handleDelete = (runner, rowIndex) => {
    confirmDialog({
      message: "You are deleting this accidental split.  Continue?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteLap(runner, rowIndex),
    });
  };

  const deleteLap = (runner, rowIndex) => {
    if (runner === 1) {
      const updatedLaps = [...laps1];
      updatedLaps.splice(rowIndex, 1);
      setLaps1(updatedLaps);
    }
    if (runner === 2) {
      const updatedLaps = [...laps2];
      updatedLaps.splice(rowIndex, 1);
      setLaps2(updatedLaps);
    }
    if (runner === 3) {
      const updatedLaps = [...laps3];
      updatedLaps.splice(rowIndex, 1);
      setLaps3(updatedLaps);
    }
    if (runner === 4) {
      const updatedLaps = [...laps4];
      updatedLaps.splice(rowIndex, 1);
      setLaps4(updatedLaps);
    }
  };

  const lapTimeBody = (rowData, index) => {
    
    if (Number(rowData.lapTime) < 55) {
      return (
        <span
          style={{ backgroundColor: "#ffcccc" }}
          onClick={() => handleLapTimeChange(activeIndex + 1, rowData)}
        >
          {rowData.lapTime}
        </span>
      );
    } else {
      return (
        <span onClick={() => handleLapTimeChange(activeIndex + 1, rowData)}>
          {rowData.lapTime}
        </span>
      );
    }
  };

  const handleLapTimeChange = (runner, data) => {
    setRowDataToEdit(data);
    setEditSplit(data.lapTime);
    setVisible2(true);
  };

  const handleAdd = (runner, rowIndex) => {
    confirmDialog({
      message: "Did you miss a split and want to add one above now?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => AddLap(runner, rowIndex),
    });
  };

  const AddLap = (runner, rowIndex) => {
    console.log("Adding a new line");
    console.log("runner", runner);
    console.log("rowIndex", rowIndex);

    let lapsArray;
    let setLapsArray;
    switch (runner) {
      case 1:
        lapsArray = laps1;
        setLapsArray = setLaps1;
        break;
      case 2:
        lapsArray = laps2;
        setLapsArray = setLaps2;
        break;
      case 3:
        lapsArray = laps3;
        setLapsArray = setLaps3;
        break;
      case 4:
        lapsArray = laps4;
        setLapsArray = setLaps4;
        break;
      default:
        lapsArray = [];
        setLapsArray = () => {};
    }
    if (lapsArray.length > 0) {
      const thisValue = lapsArray[rowIndex];
      const nextValue = lapsArray[rowIndex - 1] || 0;
      const valueToAdd = (thisValue + nextValue) / 2;
      console.log("valueToAdd", valueToAdd);
      let newLapsArray = [...lapsArray];
      newLapsArray.splice(rowIndex, 0, valueToAdd);
      //newLapsArray = newLapsArray.splice(runner, 0, valueToAdd);
      console.log("newLapsArray", newLapsArray);
      setLapsArray(newLapsArray);
    } else {
      setLapsArray([...lapsArray]);
    }
  };

  const handleEditSplit = (e) => {
    console.log("Editting Split");
    console.log("e values", e.target.value);
  };

  return (
    <div>
      <ConfirmDialog />
      <Dialog
        visible={visible}
        onHide={hideDialog}
        header="Enter Runner Names"
        footer={
          <div>
            <Button label="Close" onClick={hideDialog} />
          </div>
        }
      >
        <div className="nameGroup">
          <div>
            <InputText
              className="p-inputtext-lg"
              value={names[0]}
              onChange={(e) => handleNames(e.target.value, 0)}
            />
          </div>
          <div>
            <InputText
              className="p-inputtext-lg"
              value={names[1]}
              onChange={(e) => handleNames(e.target.value, 1)}
            />
          </div>
          <div>
            <InputText
              className="p-inputtext-lg"
              value={names[2]}
              onChange={(e) => handleNames(e.target.value, 2)}
            />
          </div>

          <div>
            <InputText
              className="p-inputtext-lg"
              value={names[3]}
              onChange={(e) => handleNames(e.target.value, 3)}
            />
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={visible2}
        onHide={hideDialog2}
        header="Edit Lap Split"
        footer={
          <div>
            <Button label="OK" onClick={hideDialog2} />
          </div>
        }
      >
        <div>
          <InputText
            className="p-inputtext-lg"
            value={editSplit}
            onChange={(e) => setEditSplit(e.target.value)}
          />
        </div>
      </Dialog>
      <h1>Get My Splits</h1>
      <div className="runningTime" style={{ fontSize: "3em" }}>
        {formatTime(elapsedTime, startTime)}
      </div>
      <div className="fourRunners">
        {runners.map((runner) => (
          <div style={{ fontSize: "3.5em" }} key={runner.key}>
            <span className="previousSplits"></span>

            <span
              key={runner.key}
              className={
                clicked === runner.ct ? `lapBox lapBox${runner.ct}` : `lapBox`
              }
              onClick={() => handleClick(runner.ct)}
            >
              {runner.laps.length > 0 ? runner.label : runner.name}
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
          
        />
        <Button
          label="Names"
          className="p-button-primary"
          onClick={handleName}
        />
      </div>
      <TabMenu
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      />
      <DataTable value={lapData}>
        <Column field="lap" header="Lap" />
        <Column header="400" body={lapTimeBody} />
        <Column field="cumulativeLapTime" header="800" />
        <Column field="lap3Diff" header="1600" />
        <Column body={deleteTemplate} />
      </DataTable>
    </div>
  );
}

export default Stopwatch;
