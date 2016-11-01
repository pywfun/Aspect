import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    DeviceEventEmitter,
} from 'react-native'

import CheckBox from 'react-native-check-box'

var needAspectName = ["Merc","Venu","Jupi","Satu","Uran","Nept","Plut","Sun","Mars"];
var needAspect = ["CJN","SQR","TRI","OPP","SXT"];
var keys = [
  {
 
    "name": "Merc",
    "checked": true
  },
  {
   
    "name": "Venu",
    "checked": true
  },
  {
   
    "name": "Jupi",
    "checked": true
  },
  {
    
    "name": "Satu",
    "checked": true
  },
  {
  
    "name": "Uran",
    "checked": true
  },
  {
   
    "name": "Nept",
    "checked": true
  },
  {
   
    "name": "Plut",
    "checked": true
  },
  {
   
    "name": "Sun",
    "checked": true
  },
  {
   
    "name": "Mars",
    "checked": true
  }
];

var keys2 = [
  {
 	"asp":true,
    "name": "CJN",
    "checked": true
  },
  {
   "asp":true,
    "name": "SQR",
    "checked": true
  },
  {
   "asp":true,
    "name": "TRI",
    "checked": true
  },
  {
    "asp":true,
    "name": "OPP",
    "checked": true
  },
  {
  	"asp":true,
    "name": "SXT",
    "checked": true
  }
];

var keys3 =[
  {
    "show":true,
    "name":"是否当天的全部显示",
    "checked":false
  }
];


export default class Seting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
            dataArray2:[]
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.setState({
            dataArray: keys,
            dataArray2:keys2
        })
    }
    remove(ArrayName,date){
    	var index = ArrayName.indexOf(date);
    	if(index>-1)
    		 ArrayName.splice(index,1);

    	return ArrayName
    }
    onClick(data) {
        data.checked = !data.checked;
        let msg=data.checked? 'you checked ':'you unchecked '
//        this.toast.show(msg+data.name);
        console.log('Response = ', msg+data.name);
      //  console.log('Response = ', data);
        if(data.asp)
        {
      			 if(!data.checked)
      	        {
      		        let a = this.remove(needAspect,data.name);
      		        needAspect = a;
      		       
      	    	}
      	    	else{
      	    		needAspect.push(data.name);
      	    	}

  	    	// console.log('Response = ', needAspect);
  	    	 DeviceEventEmitter.emit('sendNeedAspect',needAspect);
        }
        else if(data.show)
        {
            DeviceEventEmitter.emit('sendNeedShowAll',data.checked);
        }
        else
        {
	        if(!data.checked)
	        {
		        let a = this.remove(needAspectName,data.name);
		        needAspectName = a;
		       
	    	}
	    	else{
	    		needAspectName.push(data.name);
	    	}

	    	// console.log('Response = ', needAspectName);
	    	 DeviceEventEmitter.emit('sendNeedAspectName',needAspectName);
	    }
    }

    renderView(dataArray) {
        if (!dataArray || dataArray.length === 0)return;
        var len = dataArray.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i])}
                        {this.renderCheckBox(dataArray[i + 1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(dataArray[len - 2]) : null}
                    {this.renderCheckBox(dataArray[len - 1])}
                </View>
            </View>
        )
        return views;

    }

    renderCheckBox(data) {
        var leftText = data.name;
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={()=>this.onClick(data)}
                isChecked={data.checked}
                leftText={leftText}
            />);
    }

    render() {
        return (
            <View style={styles.container}>
            	<View style={styles.container}>
	            	<Text>行星</Text>
	                <ScrollView>
	                    {this.renderView(this.state.dataArray)}
	                </ScrollView>
                </View>
                <View style={styles.container}>
	            	<Text>相位</Text>
	                <ScrollView>
	                    {this.renderView(this.state.dataArray2)}
	                </ScrollView>
                  {this.renderView(keys3)}
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f2f2',
        marginTop:30
    },
    item: {
        flexDirection: 'row',
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
})