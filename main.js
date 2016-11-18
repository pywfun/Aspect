import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import Progress from 'react-native-progress/Circle';
var szzf = require('./szzf.js');
var szzs = require('./szzs.js');
var DateTimePicker = require('react-native-datetime').default;
var resultsCache = {
  aspectDate:{},//章节列表数据
};
var aspectList={};
//var nextDay;
var needAspectName = ["Merc","Venu","Jupi","Satu","Uran","Nept","Plut","Sun","Mars"];
var needAspectNameCache = ["Merc","Venu","Jupi","Satu","Uran","Nept","Plut","Sun","Mars"];
var needAspect = ["CJN","SQR","TRI","OPP","SXT"];
var needAspectCache = ["CJN","SQR","TRI","OPP","SXT"];
var needPlant = ["Ari",'Can',"Cap","Gem","Leo","Lib","Pis","Sag","Sco","Tau","Vir","Aqu"];
var cache;
var DayNum = 0,RealDayNum=0;
var pNum = 0;
var oneDay = 1000*60*60*24;
var show = false;
var showAll = false;
class Button extends Component{
  render() {
    return (
      <TouchableHighlight
        underlayColor={"#556AC3"}//触摸的时候显示出来的底层颜色
        style={[styles.button,{backgroundColor:this.props.color}]}
        onPress={this.props.onPress}>
        <Text style={styles.buttonLabel}>
          {this.props.label}
        </Text>
      </TouchableHighlight>
    );
  }
}


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      startDateDay: '',
      startDateMonth: '',
      startDateYear: '',
      endDate:'',
      endDateDay:'',
      endDateMonth:'',
      endDateYear:'',
      dateList:{},
      date:new Date(),
      progressNum:0};
    this.picker = null;
  }
  componentDidMount() {

      this.subscription = DeviceEventEmitter.addListener('sendNeedAspect', (array)=>{
          needAspectCache = array;
          console.log('sendNeedAspect = ', needAspect);
      });
      this.subscription2 = DeviceEventEmitter.addListener('sendNeedAspectName', (array)=>{
          needAspectNameCache = array;
          console.log('sendNeedAspectName = ', needAspectName);
      });
      this.subscription2 = DeviceEventEmitter.addListener('sendNeedShowAll', (show)=>{
          showAll = show;
          console.log('showAll = ', show);
      });
      let date = new Date();
      this.setState({
              progressNum:0,
              startDate:date.getTime(),
              startDateDay:date.getDate(),
              startDateMonth:date.getMonth()+1,
              startDateYear:date.getFullYear(),
              endDate:date.getTime(),
              endDateDay:date.getDate(),
              endDateMonth:date.getMonth()+1,
              endDateYear:date.getFullYear()    
            });
    }    
  componentWillUnmount(){
      this.subscription.remove();
      this.subscription2.remove();
  }

    showDatePicker() {
        var date = this.state.date;
        aspectList={};
        this.picker.showDatePicker(date, (d)=>{
            this.setState({
              dateList:{},
              date:d,
              progressNum:0,
              startDate:d.getTime(),
              startDateDay:d.getDate(),
              startDateMonth:d.getMonth()+1,
              startDateYear:d.getFullYear()});
        });
    }
    showDatePickerEnd() {
        var date = this.state.date;
        aspectList={};
        this.picker.showDatePicker(date, (d)=>{
            this.setState({
              dateList:{},
              date:d,
              progressNum:0,
              endDate:d.getTime(),
              endDateDay:d.getDate(),
              endDateMonth:d.getMonth()+1,
              endDateYear:d.getFullYear()});
        });
    }    
    showTimePicker() {
        var date = this.state.date;
        this.picker.showTimePicker(date, (d)=>{
            this.setState({date:d.getDay()});
        });
    }
    showDateTimePicker() {
        var date = this.state.date;
        this.picker.showDateTimePicker(date, (d)=>{
            this.setState({date:d});
        });
    }
    UpdateDate(){
      show = false;
      var nextDay = new Date(this.state.startDate);
      DayNum = Math.round((this.state.endDate - this.state.startDate)/oneDay);
      RealDayNum = DayNum;
      pNum = 0;
      for(let i = 0 ; i <= DayNum ; i++)
      {
            if(nextDay.getDay()==6||nextDay.getDay()==0)
            {
              nextDay = new Date(nextDay.getTime() + oneDay); 
              RealDayNum--;   
              continue;
            }
        this.getDate(nextDay);
        nextDay = new Date(nextDay.getTime() + oneDay);
      }

    }

    getDate(date:Date){
      let day = this.prefixInteger(date.getDate(),2);
      let month = date.getMonth()+1;
      let year = date.getFullYear();
      var coDay = year+'-'+month+'-'+day;
      url = 'http://www.nodoor.com/wheelDetail.do';
      data = "selectWheel=Natal&userName=mm&userGender=%E5%A5%B3&astroHour=0&astroMin=0&boroughs=310105&astroDate=";
      var fetchOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          //表单
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:'data='+data+coDay+''
      };

      fetch(url,fetchOptions)
      .then((response) => response.json())
      .catch((error) => {
        resultsCache.aspectDate = undefined;
      })
      .then((responseData) => {
        resultsCache.aspectDate = responseData;
        
        let data={
            aspectList:responseData.aspectList,
            planetList:responseData.planetList,
            wheelAspectsASMap:responseData.wheelAspectsASMap,
            planetStr:responseData.planetStr,
        };
        aspectList[coDay] = data;
        pNum++;
        this.setState({
          dateList:aspectList,
          progressNum:pNum/(RealDayNum+1)
        })
      })
      .done();
    }

    prefixInteger(num, length) {
      return (Array(length).join('0') + num).slice(-length);
    }

    inPlant(plant,data){

      for (let i = 0; i < data.length; i++) {
        if(data[i].planetName == plant)
          return {signame:data[i].signName,reverse:data[i].reverse};
      }

    }
    imageSrc(name){
      let src;
      switch(name)
      {
      case 'CJN':
        src =  require('./img/CJN.png');
        break;
      case 'Jupi':
        src =  require('./img/Jupi.png');
        break;
      case 'Mars':
        src =  require('./img/Mars.png');
        break;
      case 'Merc':
        src =  require('./img/Merc.png');
        break;
      case 'Nept':
        src =  require('./img/Nept.png');
        break;
      case 'OPP':
        src =  require('./img/OPP.png');
        break;
      case 'Plut':
        src =  require('./img/Plut.png');
        break;
      case 'Satu':
        src =  require('./img/Satu.png');
        break;  
      case 'SQR':
        src =  require('./img/SQR.png');
        break;
      case 'Sun':
        src =  require('./img/Sun.png');
        break;
      case 'SXT':
        src =  require('./img/SXT.png');
        break;
      case 'TRI':
        src =  require('./img/TRI.png');
        break;
      case 'Uran':
        src =  require('./img/Uran.png');
        break;
      case 'Venu':
        src =  require('./img/Venu.png');
        break;
      case 'Ari':
        src =  require('./img/Ari.png');
        break;
      case 'Can':
        src =  require('./img/Can.png');
        break;
      case 'Cap':
        src =  require('./img/Cap.png');
        break;
      case 'Gem':
        src =  require('./img/Gem.png');
        break;
      case 'Leo':
        src =  require('./img/Leo.png');
        break;
      case 'Lib':
        src =  require('./img/Lib.png');
        break;
      case 'Pis':
        src =  require('./img/Pis.png');
        break;
      case 'Sag':
        src =  require('./img/Sag.png');
        break;  
      case 'Sco':
        src =  require('./img/Sco.png');
        break;
      case 'Tau':
        src =  require('./img/Tau.png');
        break;
      case 'Vir':
        src =  require('./img/Vir.png');
        break;
      case 'Aqu':
        src =  require('./img/Aqu.png');
        break;                             
      }
      return src;

    }
    cacheImg(){
      for(let i = 0;i<needAspect.length;i++)
      {
        let img1 = this.imageSrc(needAspect[i]);
        cache[needAspect[i]] = (
          <Image source={img1} style={{width:20,height:20}}/>
          );
      }
      for(let i = 0;i<needAspectName.length;i++)
      {
        let img1 = this.imageSrc(needAspectName[i]);
        cache[needAspectName[i]] = (
          <Image source={img1} />
          );
      }
      for(let i = 0;i<needPlant.length;i++)
      {
        let img1 = this.imageSrc(needPlant[i]);
        cache[needPlant[i]] = (
          <Image source={img1} />
          );
      }
    }
    hasNeedAspectInThisDay(aspectList){
      for(let j = 0;j<aspectList.length;j++)
      {
        if(needAspectCache.indexOf(aspectList[j].aspectName)>-1&&needAspectNameCache.indexOf(aspectList[j].object1)>-1&&needAspectNameCache.indexOf(aspectList[j].object2)>-1)
          return true;
      }


        return false;
              
    }
    zfDay(year,month,day)
    {
      let y = year+'',m=month,d=day;
       y=y.slice(2,4);
      if(month<10)
        m='0'+m;

      return y+m+d;

    }
    makeItem(){
      if(this.state.dateList&&!show)
      {
        let items=[];
        let num = 0;
        let item = 0;
        let day,month ,year,coDay,zfDay; 
        let color,showDate;     
        for(var key in this.state.dateList)
          num++;
        if(num==RealDayNum+1){
          var showDay = new Date(this.state.startDate);

          for(let i = 0; i<DayNum+1;i++)
          {
            if(showDay.getDay()==6||showDay.getDay()==0)
            {
              showDay = new Date(showDay.getTime() + oneDay);
    
              continue;
            }
            day = this.prefixInteger(showDay.getDate(),2);
            month = showDay.getMonth()+1;
            year = showDay.getFullYear();
            coDay = year+'-'+month+'-'+day;
            zfDay = this.zfDay(year,month,day);            
            aspdate = this.state.dateList[coDay];
            color = i%2==0?'#F8F5F8':'#FCFCFC';
            showDate = true;
            let showOther = this.hasNeedAspectInThisDay(aspdate.aspectList);
            for(let j = 0; j<aspdate.aspectList.length;j++)
            {
              let tempShow;
              if(showAll)
              {
                tempShow = showOther&&needAspect.indexOf(aspdate.aspectList[j].aspectName)>-1&&needAspectName.indexOf(aspdate.aspectList[j].object1)>-1&&needAspectName.indexOf(aspdate.aspectList[j].object2)>-1
              }
              else
              {
                  tempShow = needAspectCache.indexOf(aspdate.aspectList[j].aspectName)>-1&&needAspectNameCache.indexOf(aspdate.aspectList[j].object1)>-1&&needAspectNameCache.indexOf(aspdate.aspectList[j].object2)>-1
        
              }
              if(tempShow)
              {
               // alert(aspdate.aspectList[j].aspectName+"-"+aspdate.aspectList[j].object1+"-"+aspdate.aspectList[j].object2);
                let plant1 = this.inPlant(aspdate.aspectList[j].object1,aspdate.planetList);
                let plant2 = this.inPlant(aspdate.aspectList[j].object2,aspdate.planetList);
                let orb = Number.parseInt(aspdate.aspectList[j].orb);
                let aspectASName = aspdate.aspectList[j].object1+'_'+aspdate.aspectList[j].object2+'_'+aspdate.aspectList[j].aspectName;
                orb = aspdate.wheelAspectsASMap[aspectASName];
                let orbArray = orb.split("");
                if((orbArray[1]=='A'&&Number.parseInt(orbArray[0])<6)||(orbArray[1]=='S'&&Number.parseInt(orbArray[0])<5))
                {
                 // orb = Math.abs(orb)+(orb>0?'A':'S');
                  let img1 = this.imageSrc(aspdate.aspectList[j].object1);
                  let img2 = this.imageSrc(plant1.signame);
                  let plant1Rev = plant1.reverse=="Y"?"R":null;
                  let img3 = this.imageSrc(aspdate.aspectList[j].aspectName);
                  let img4 = this.imageSrc(aspdate.aspectList[j].object2);
                  let plant2Rev = plant2.reverse=="Y"?"R":null;
                  let img5 = this.imageSrc(plant2.signame);
                  if(showDate){
                    let zf = global.sz[zfDay],zfshow;
                    if(zf===undefined||zf==='')
                    {
                      zfshow='';
                    }
                    else if(zf==0)
                      zfshow = '0';
                    else
                      zfshow = zf.toFixed(2)+'%';
                    items[item]=(
                      <View key={item} style={{backgroundColor:color,flexDirection:'row',flexWrap:'wrap',alignItems:'flex-start',flex:1,}}>
                      <Text style={{fontSize:23}}>{coDay}星期{showDay.getDay()}</Text>
                      <Text style={{fontSize:23}}>指数:{global.szzs[zfDay]}  涨幅：</Text>
                      <Text style={{fontSize:23,color:zf>0?"#ff0000":"#90ff00"}}>{zfshow}</Text>
                      </View>
                      );
                    item++;
                    showDate = false;
                  }
                  items[item]=(
                    <View key={item} style={[styles.container5,{backgroundColor:color}]}>
                      <Image source={img1} /><Text>{plant1Rev}</Text>
                      <Image source={img2} />
                      <Image source={img3} style={{width:25,height:25}}/>
                      <Image source={img4} /><Text>{plant2Rev}</Text>
                      <Image source={img5} />
                      <Text style={{fontSize:22}}>{orb}</Text>
                    </View>
                    );
                  item++;
                }
              }
            }
            showDay = new Date(showDay.getTime() + oneDay);
          }
         // show = true;
          return items;
        }
        else{
          if(this.state.progressNum!=0)
            return (
              <View style={styles.progress}>
              <Progress progress={this.state.progressNum} size={150} showsText = {true}/>
              </View>
              );
        }
        
      }
      else
      {
        return null;
      }
    }

    render(){	
		return(
	      <View style={styles.container}>
          <View style={{ borderColor:'#D4D4D4',borderWidth:1,}}>
  		      <View style={styles.container2}>
    		      	<TouchableOpacity style={styles.container3} onPress={()=>this.showDatePicker()}>
    		          <Text style={{fontSize:20}}>起始:{this.state.startDateYear+'-'+this.state.startDateMonth+'-'+this.state.startDateDay}</Text>
    		        </TouchableOpacity>
                <Text>  ____  </Text>
    		        <TouchableOpacity style={styles.container3} onPress={()=>this.showDatePickerEnd()}>
    		          <Text style={{fontSize:20}}>结束:{this.state.endDateYear+'-'+this.state.endDateMonth+'-'+this.state.endDateDay}</Text>
    		        </TouchableOpacity>              
  	          </View>
              <View style={styles.subimt}>
                  <Button
                  color="#798BDA"   
                  onPress={()=>this.UpdateDate()}
                  label="运行"
                  />
              </View>
            </View>
            <View style={styles.container4}>
              <ScrollView>
                {this.makeItem()}
              </ScrollView>
            </View>                 
	          <DateTimePicker cancelText="Cancel" okText="OK" ref={(picker)=>{this.picker=picker}}/>         
	      </View>		
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:67,
    backgroundColor:'#FFF',
  },
  container2: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    padding:10,

  },
  container3: {
    flexDirection: 'row',
    borderColor:'#D4D4D4',
    borderWidth:1,
  },
  container4: {
    flex: 1,
  },
  container5: {
    flexDirection: 'row',
    height:38,
   },
  subimt: {
    alignItems: 'center',
    margin: 3,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    width: 80,
    height:30,
    borderRadius:20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: '#fff',
  },
  progress: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
  },    
});

module.exports = Main;