import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import normalize from "react-native-normalize";
import ChatCard from '../components/cardComponents/chatCard'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import Modal from "react-native-modal";
import { allMessages, sendMessage } from '../Utils/CleintChat'
import { getAcceptedOffer } from '../Utils/HelpersOffers'
import { MaterialIcons } from '@expo/vector-icons';
import LoadingModal from '../components/global/LoadingModal'


const ClientChat = ({ close }) => {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(false);
  
  const [helperData, setHelperData] = useState([]);
  const [loading,setloading]=useState(true)

  const newMessage = async () => {
    if (active == true) {
      sendMessage(message).then((result) => {
      setMessage('')
      setActive(false)
      getMessages()
      });
   
    }
  }
 
  const getMessages = async () => {
 
    await allMessages().then((result) => {
      setMessages(result);
    
    });
  };

  useEffect(() => {
    getAcceptedOffer().then( (result) => {
      setHelperData(result);
      setloading(false)
    })
    getMessages()
    const time=setInterval(getMessages, 5000);
    return () => clearInterval(time);
  }, []);
  
  if(loading)
  return <LoadingModal modalVisible={loading}  />

  return (
    <Modal isVisible={true} style={{margin: 0}}>
    <View style={styles.container}>
      <View style={{ height: Dimensions.get('window').height < 600 ? Dimensions.get("window").height * 0.75 : Dimensions.get("window").height * 0.91 }}>
        <View style={styles.headerContainer}>
          <View style={styles.BackButton}>
            <TouchableOpacity onPress={() => { close() }}>
              <MaterialIcons name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: helperData.helperImage,
              }}
            />
          <Text style={styles.nameText}> {helperData.helperName.firstName} </Text>
          </View>
        </View>
        <View style={{ flex: 1,marginTop:'2%' }}>
          <FlatList 
          inverted
            //keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            data={messages}
            keyExtractor={(item, index) => "key" + index}
            showsVerticalScrollIndicator={true}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <ChatCard item={item}
                    chat={'Yes'}
                  />
                </View>
              );
            }}
          />
          <KeyboardSpacer
          />
        </View>
      </View>
      <KeyboardAvoidingView
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
        behavior={Platform.OS == "ios" ? 'position' : null}
      >
        <View style={styles.footer}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Write your reply…"
                autoCorrect={false}
                placeholderTextColor='#BCC5D3'
                underlineColorAndroid='transparent'
                onChangeText={(text) => {
                  setMessage(text)
                  {
                    if (/\S/.test(text)) {
                      setActive(true)

                    } else setActive(false)
                  }
                }}
                style={styles.input}
                value={message}
                multiline
              />
            </View>
          </TouchableWithoutFeedback>
          {!active ? <Icon name={'arrow-right-circle'} color={'#BCC5D3'} size={30} /> :
            <TouchableOpacity onPress={() => newMessage()}>
              <Icon name={'arrow-right-circle'} color={'#132641'} size={30} />
            </TouchableOpacity>}
        </View>
      </KeyboardAvoidingView>
    </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#7598BA',
    height: Dimensions.get('window').height * 0.20,
    borderBottomLeftRadius: 70,
    alignItems: 'center',
  },
  BackButton: {
    marginRight: '90%',
    marginTop: '7%'
  },
  image: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(400 / 2),
    resizeMode: "cover",
  },
  imageContainer: {
    flexDirection: "row",
    paddingVertical: normalize(5)
  },
  nameText: {
    fontFamily: 'Montserrat_bold',
    fontSize: 20,
    color: '#FFFFFF',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(10)
  },
  headerText: {
    color: 'white',
    fontSize: normalize(40) *
      Math.min(
        Dimensions.get("window").height / 900.0,
        Dimensions.get("window").width / 500.0
      ),
    paddingTop: '15%',
    fontFamily: 'Montserrat_bold'
  },

  
  footer: {
    borderWidth: 1,
    borderTopColor: '#E9EEF1',
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    height: normalize(60),
    paddingHorizontal: '5%'
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#BCC5D3',
    paddingHorizontal: '5%'
  },
})

export default ClientChat;