import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

class App extends Component {
  getTwoNonConsecutiveDays = () => {
    const days = {
      Day1: [],
      Day2: [],
      Day3: [],
      Day4: [],
      Day5: [],
      Day6: [],
      Day7: [],
      Day8: [],
      Day9: [],
      Day10: [],
    };
    //mock values
    const workers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    //assign a worker to each day at random;
    let partA = (workers, days) => {
      //copy mady for push mutation
      const daysCopy = {...days};
      //copy made for splice mutation
      const workersCopy = [...workers];
      //a worker is selected at random, then spliced from the worker array to prevent being selected again
      Object.keys(daysCopy).forEach((key) => {
        const random = Math.floor(Math.random() * workersCopy.length);
        daysCopy[key] = [workersCopy.splice(random, 1)[0]];
      });
      return partB(workers, daysCopy);
    };

    //determine what workers are available for each remaining slot
    let partB = (workers, days) => {
      //create an object map of available workers
      const workerMap = {};
      //for each day check who the current, previous, and next day's worker is, then add all others to object map
      Object.keys(days).forEach((key, index) => {
        const current = days[key][0];
        const prev = days[Object.keys(days)[index - 1]]
          ? days[Object.keys(days)[index - 1]][0]
          : null;
        const next = days[Object.keys(days)[index + 1]]
          ? days[Object.keys(days)[index + 1]][0]
          : null;
        const allowed = workers.filter(
          (worker) => [current, prev, next].indexOf(worker) < 0,
        );
        workerMap[key] = allowed;
      });
      //pass daysCopy and workerMap to final part
      return partC(days, workerMap);
    };

    //randomly assign remaining workers
    let partC = (days, workerMap) => {
      //create copy for push mutation
      const daysCopy = {...days};
      //create copy for delete mutation
      let mapCopy = {...workerMap};
      //while there remains available workers
      while (Object.keys(mapCopy).length) {
        //store keys for days with available workers
        const keys = Object.keys(mapCopy);
        //create object map for length of available workers per day
        const lengths = {};
        Object.keys(mapCopy).forEach((key) => {
          lengths[key] = mapCopy[key].length;
        });
        //find the day with the least amount of options as this guarantees less chance of failure
        const shortestVal = Object.values(lengths).sort((a, b) => a - b)[0];
        const shortestKey = keys.find((key) => lengths[key] === shortestVal);

        //randomly select an available option for the shortest day
        const options = mapCopy[shortestKey];
        const random = Math.floor(Math.random() * options.length);
        const selection = options[random];

        //if the assignment fails, it will recursively call itself; this occurs about 2% of the time
        if (typeof selection === 'undefined') return partC(days, workerMap);
        //otherwise push the selection as the second worker for the day
        daysCopy[shortestKey] = [...daysCopy[shortestKey], selection];
        //remove that worker as an available option for all other days
        keys.forEach((key) => {
          mapCopy[key] = mapCopy[key].filter((worker) => worker !== selection);
        });
        //delete the resolved day from the availability map
        delete mapCopy[shortestKey];
      }

      //return days with assigned workers
      return daysCopy;
    };

  return( <Text>{JSON.stringify(partA(workers, days))}</Text> );
  };

  render() {
    return (
      <View>
        <View>
    <TouchableOpacity onPress={this.getTwoNonConsecutiveDays}><Text>BUTTON</Text></TouchableOpacity>
          <View><Text>{this.getTwoNonConsecutiveDays()}</Text></View>
       <View>{this.getTwoNonConsecutiveDays}</View>
        </View>
      </View>
    );
  }
}

export default App;
