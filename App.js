import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button, h1Style} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: null,
    };
  }

  getTwoNonConsecutiveDays = () => {
    const days = require('./days.json');
    //Workers
    const workers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    //assign a random worker for each day
    let functionA = (workers, days) => {
      //copy made for push mutation
      const daysCopy = {...days};
      //copy made for splice mutation
      const workersCopy = [...workers];
      //a random worker is selected, then spliced from the worker array to prevent having duplicates
      Object.keys(daysCopy).forEach((key) => {
        const random = Math.floor(Math.random() * workersCopy.length);
        daysCopy[key] = [workersCopy.splice(random, 1)[0]];
      });
      return functionB(workers, daysCopy);
    };

    //determine what workers are available for each remaining slot
    let functionB = (workers, days) => {
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
      return functionC(days, workerMap);
    };

    //assign randomly workers
    let functionC = (days, workerMap) => {
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
        if (typeof selection === 'undefined') return functionC(days, workerMap);
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

    return this.setState({nickname: JSON.stringify(functionA(workers, days))});
  };

  render() {
    const {nickname} = this.state;

    return (
      <View>
        <View>
          <Button
            title="Generate wheel of fate rota"
            type="outline"
            onPress={this.getTwoNonConsecutiveDays}></Button>

          <View>
            <Text h1Style>{nickname}</Text >
          </View>
        </View>
      </View>
    );
  }
}

export default App;
