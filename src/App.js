import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    timer: null,
    startTime: null,
    currentTime: null,
    stopTime: null,
    stoppedTimeOffset: 0,
    stoppedTimeOffsetForLap: 0,
    lastLapTime: null,
    displayTime: '00:00.00',
    isStarted: false,
    isStopped: false,
    laps: [],
  }

  startAndStopHandler = () => {
      if(!this.state.isStarted) {
        this.setState({
          startTime: Date.now(),
          lastLapTime: Date.now(),
          timer: setInterval(() => {
            let elapsedTime = this.state.currentTime - this.state.startTime
            this.setState({
              currentTime: Date.now(),
              displayTime: this.formatTime((elapsedTime / 1000).toFixed(2))
            })
            this.refreshLapTimes()
          }, 10),
          isStarted: true,
          laps: [{
            time: 0,
            display: this.state.displayTime,
            isFastest: false,
            isSlowest: false
          }]
        })
      }else if(this.state.isStarted && !this.state.isStopped){
        clearInterval(this.state.timer)
        this.setState({
          stopTime: Date.now(),
          isStopped: true
        })
      }else if(this.state.isStarted && this.state.isStopped){ //resume
        this.setState({
          stoppedTimeOffset: this.state.stoppedTimeOffset + Date.now() - this.state.stopTime,
          stoppedTimeOffsetForLap: this.state.stoppedTimeOffsetForLap + Date.now() - this.state.stopTime,
          timer: setInterval(() => {
            let elapsedTime = this.state.currentTime - this.state.startTime - this.state.stoppedTimeOffset
            this.setState({
              currentTime: Date.now(),
              displayTime: this.formatTime((elapsedTime / 1000).toFixed(2))
            })
            this.refreshLapTimes()
          }, 10),
          isStopped: false
        })
      } else {
        clearInterval(this.state.timer)
        this.setState({
          isStarted: false
        })
      }
  }

  resetAndLapHandler = () => {
    if (this.state.isStarted && this.state.isStopped) {
      this.setState({
        timer: null,
        startTime: null,
        currentTime: null,
        stopTime: null,
        stoppedTimeOffset: 0,
        stoppedTimeOffsetForLap: 0,
        lastLapTime: null,
        displayTime: '00:00.00',
        isStarted: false,
        isStopped: false,
        laps: [],
      })
    }
    else if(this.state.isStarted && !this.state.isStopped)
    {
      let elapsedTime = this.state.currentTime - this.state.lastLapTime - this.state.stoppedTimeOffsetForLap
      let lapTime = (elapsedTime/1000).toFixed(2)
      let newLaps = [...this.state.laps]
      newLaps.push({
        time: parseFloat(lapTime),
        display: this.formatTime(lapTime)
      })

      this.setState({
        laps: newLaps,
        lastLapTime: this.state.currentTime,
        stoppedTimeOffsetForLap: 0
      })
    }
  }

  refreshLapTimes = () => {
    let lapsClone = [...this.state.laps]
    let elapsedTime = this.state.currentTime - this.state.lastLapTime - this.state.stoppedTimeOffsetForLap

    let lapTime = (elapsedTime / 1000).toFixed(2)

    lapsClone[this.state.laps.length - 1] = {
      time: parseFloat(lapTime),
      display: this.formatTime(lapTime),
      isFastest: false,
      isSlowest: false
    }

    this.setState({
      laps: lapsClone
    })
  }

  lapsRecords = () => {
      let lapsClone = [...this.state.laps]
      if(lapsClone.length > 2){
        lapsClone = lapsClone.map((onelap) => {
          return {
            ...onelap,
            isFastest: false,
            isSlowest: false
          }
        })

        let fastestIndex = 0
        let slowestIndex = 0

        for(let i = 0; i < lapsClone.length-1; i++) {
          if(lapsClone[i].time < lapsClone[fastestIndex].time){
            fastestIndex = i
          }

          if(lapsClone[i].time > lapsClone[slowestIndex].time){
            slowestIndex = i
          }
        }
        lapsClone[fastestIndex].isFastest = true
        lapsClone[slowestIndex].isSlowest = true
      }
      return lapsClone.reverse()
  }


  formatTime = (seconds) => {
    let date = new Date(null);
    date.setSeconds(seconds);
    let result = date.toISOString().substr(14, 5);
    return `${result}.${(seconds + '').split('.')[1]}`
  }

  render() {
    return (
      <div id="App">
        <div id="stopwatch">
          {this.state.displayTime}
        </div>
        <div id="stopwatch-controls">
          <button id="reset-and-lap" onClick={this.resetAndLapHandler}>{(this.state.isStarted && !this.state.isStopped) ? 'Lap': 'Reset'}</button>
          <button id="start-and-stop" onClick={this.startAndStopHandler}>{ (this.state.isStarted && !this.state.isStopped) ? 'Stop': 'Start'}</button>
          <span id="brand">Stopwatch</span>
        </div>
        <ul id="stopwatch-records">
          {
              this.lapsRecords().map((lap, index) => {
              return (
                <li className={`${lap.isFastest? 'green': ''} ${lap.isSlowest? 'red': ''}`}>
                  <span>Lap { this.state.laps.length-index }</span>
                  <span>{lap.display}</span>
                </li>
              )
            })
          }

        </ul>
      </div>
    )
  }
}

export default App;