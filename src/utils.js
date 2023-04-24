
  export const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  export const formatLapTime = (lapTimeInMs) => {
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

  
  export const formatData = (laps) => {
    const data = [];

    for (let i = 0; i < laps.length; i++) {
      const lapTime = laps[i];
      const lapDiff = lapTime - (laps[i - 1] || 0);
      const time800 = i < 1 ? null : laps[i] - (laps[i - 2] || 0);
      const time1600 = i < 3 ? null : laps[i] - (laps[i - 4] || 0);

      data.push({
        lap: i + 1,
        lapTime: formatLapTime(lapDiff),
        cumulativeLapTime: time800 ? formatLapTime(time800) : "-",
        lap3Diff: time1600 ? formatLapTime(time1600) : "-",
      });
    }

    return data
  };

