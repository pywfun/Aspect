import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  Navigator,
  TouchableOpacity
} from 'react-native';


import TabNavigator from 'react-native-tab-navigator';
import Seting from './seting';
var Home = require('./home');

class AwesomeProject extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedTab: 'home',};
  }

  render() {
    return (
		<TabNavigator>
		  <TabNavigator.Item
		    selected={this.state.selectedTab === 'home'}
		    title="主页"
		    onPress={() => this.setState({ selectedTab: 'home' })}>
		   	<Home {...this.props}/>
		  </TabNavigator.Item>
		  <TabNavigator.Item
		    selected={this.state.selectedTab === 'profile'}
		    title="设置"
		    onPress={() => this.setState({ selectedTab: 'profile' })}>
		    <Seting />
		  </TabNavigator.Item>
		</TabNavigator>    
    );
  }

}


AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);