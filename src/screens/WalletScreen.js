import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from 'react-native';
import MainHeader from '../components/global/MainHeader';
import SubHeaderText from '../components/global/SubHeaderText';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/global/HeaderButton'
import { getProfileData } from '../Utils/ProfileData';


const WalletScreen = ({ navigation }) => {
    const [userData, setUserData] = useState([]);
    useEffect(() => {
        getProfileData().then((result) => {
            setUserData(result);
        });
    }, []);

    return (
        <View style={styles.container}>
            <MainHeader headerText={'Wallet'} name={'money'}></MainHeader>
            <SubHeaderText SubHeaderText={'Your available balance'}></SubHeaderText>
            <Text style={styles.Balance} >  {userData.balance} EGP</Text>

        </View>
    )
}
WalletScreen.navigationOptions = (props) => {
    return {
        title: '',
        headerTransparent: true,
        headerLeft: () => {
            return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}   >
                    <Item title="menu" iconName='menu' onPress={() => { props.navigation.toggleDrawer() }} />
                </HeaderButtons>
            )
        },

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        display: "flex",
        flex: 1
    },
    Balance: {
        fontFamily: 'Montserrat',
        fontSize: 24,
        marginLeft: '8%',
        color: '#132641'
    }

})

export default WalletScreen;