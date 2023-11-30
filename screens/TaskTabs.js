// tasktabs component with initialParams

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CurrentTasks from './CurrentTasks';
import CompletedTasks from './CompletedTasks';

const Tab = createMaterialTopTabNavigator();

const TaskTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Current Tasks"
        component={CurrentTasks}
        initialParams={{ initialTab: 'Current Tasks' }}
      />
      <Tab.Screen name="Completed Tasks" component={CompletedTasks} />
    </Tab.Navigator>
  );
};

export default TaskTabs;
