import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ChatCard from '../components/cardComponents/chatCard'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MainHeader from '../components/global/MainHeader'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { getTicketsMessages, addMessage } from '../Utils/SupportTickets'


const TicketScreen = ({ navigation }) => {

  const category = navigation.state.params.props.category
  const ticketID = navigation.state.params.props.id
 
  
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [reloading, setReloading] = useState(false);
  const [active, setActive] = useState(false);
  
  const newMessage = async () => {
    if (active == true) {
      addMessage(ticketID, message).then((result) => {
        setMessage('')
        setActive(false)
        getMessages()
      });
    }
  }

  const getMessages = async () => {
    setReloading(true);
    setMessages([]);
   
    await getTicketsMessages(ticketID).then((result) => {
     
      setMessages(result);
      setReloading(false);
    });
  };

  useEffect(() => {
    getMessages();

  }, []);
 

  return (
    <View style={styles.container}>
      <View style={{ height: Dimensions.get('window').height<600?Dimensions.get("window").height * 0.75:Dimensions.get("window").height * 0.81 }}>
        <MainHeader headerText={category} style={{ height: Dimensions.get('window').height * 0.18, marginBottom: '4%' }} />
        <View style={{ flex: 1 }}>
          <FlatList
            inverted
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            refreshing={reloading}
            onRefresh={() => getMessages()}
            data={messages}
            getItemLayout={(data, index) => ({
              length: 170,
              offset: 170 * index,
              index,
            })}
            keyExtractor={(item, index) => "key" + index}
            showsVerticalScrollIndicator={true}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <ChatCard item={item} />
                </View>
              );
            }}
          />
          <KeyboardSpacer
          />
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={'position'}
        keyboardVerticalOffset={Platform.OS == "ios" ?60:80}
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

  );


}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1,
  },
  
  footer: {
    borderWidth: 1,
    borderTopColor:'#E9EEF1',
    borderColor: '#FFFFFF',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    alignItems: 'center',
    height:60,
    bottom: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%'
  },
  input: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#BCC5D3',
    paddingHorizontal: '10%',
    justifyContent: 'flex-end',
    bottom: 0,
    height: '100%',
    width: '100%',
  },

})

export default TicketScreen;