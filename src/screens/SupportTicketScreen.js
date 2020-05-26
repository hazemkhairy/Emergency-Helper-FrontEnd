import React, { useState, useEffect } from 'react';
import { Text, View,StyleSheet,Dimensions, FlatList } from 'react-native';
import AddCard from '../components/cardComponents/supportTicketCard'
import Button from '../components/global/reusableButton'
import AddModal from '../components/global/AddTicketModal'
import Icon from 'react-native-vector-icons/Entypo';
import MainHeader from '../components/global/MainHeader'
import SubHeaderText from '../components/global/SubHeaderText'
import {getAllTickets} from '../Utils/SupportTickets'

const SupportTicket = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [reloading, setReloading] = useState(false);

  const getTickets = async () => {
    setReloading(true);
    setTickets([]);
    await getAllTickets().then((result) => {
      setTickets(result);
      setReloading(false);
    });
  };
  const reload = () => {
    getTickets();
  };

  useEffect(() => {
    getTickets();
  }, []);

    // if(modalVisible==false)
    // {
    //   getTickets()
    // }
    return (
    <View  style={styles.container}>
         <AddModal modalVisible={modalVisible} newItem={() => reload()} 
         />
        <MainHeader headerText='Support' name={'users'}/>
          <View style={styles.rowContainer}>
          <View style={{marginBottom:'5%'}}>
          <SubHeaderText SubHeaderText={'Tickets'}/>
          </View>
          <Button 
          onPress={() =>setModalVisible(!modalVisible)}
          //style={{height:'100%'}}
          >
            <View style={styles.buttonContainer}>
             <Icon name={'plus'} style={styles.iconStyle} />
             <Text style={styles.addButton}>New</Text>
             </View>
           </Button>
          </View>
          <FlatList
             data={tickets}
             keyExtractor={(item,index) => 'key'+index}
             showsVerticalScrollIndicator={false}
             refreshing={reloading}
             onRefresh={() => getTickets()}
             renderItem={({ item }) => {
            return (
              <View >
                <AddCard item={item} />
              </View>
            )
          }}
         />
    </View >


  );


}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#FFFFFF', 
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex:1
  },
    rowContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width:'85%',
        alignSelf: 'center',
        marginTop:'5%',
        height:'10%'
    },
    iconStyle:{
        fontSize:20,
        color:'#FFFFFF',
       
    },
    buttonContainer:{
      flexDirection: 'row',
    },
    addButton:{
      color: "white",
      fontSize: 18,
      fontFamily: "Montserrat",
      
    }
})

export default SupportTicket;

