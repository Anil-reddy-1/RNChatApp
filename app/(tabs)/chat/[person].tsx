import { usePerson } from '@/contexts/PersonContext'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import React from 'react'
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'


type prop={
    id:string,
    name:string,
    imgsrc:ImageSourcePropType | undefined,
    isOnline:boolean,
    LastMessage:string,
    chatId:string,
}

const Chat = () => {
  const {person} = useLocalSearchParams();
  const PersonContext=usePerson();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={styles.Container}>
            <View style={styles.ProfileImgCont}>
              <Image source={PersonContext.person?.imgsrc} style={styles.ProfileImg} />
            </View>
            <Text style={{fontSize:18,fontWeight:500,padding:4,margin:12}} >{PersonContext.person?.name}</Text>
          </View>
          <ScrollView 
            style={{flex: 1}} 
            contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
          >
          <View style={styles.sentMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.rcvMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.sentMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.rcvMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.sentMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.rcvMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.sentMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.rcvMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.sentMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.rcvMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.sentMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.rcvMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.sentMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.rcvMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.sentMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.rcvMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.sentMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>

          <View style={styles.rcvMessage}>
            <Text>Hello there ....</Text>
            <View>
              <Text>21/23/43-054 am</Text>
            </View>
          </View>
          </ScrollView>
          <Text>Chat</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
    
  )
}

export default Chat

const styles = StyleSheet.create({
  Container:{
        display:"flex",
        flexDirection:"row",
        alignItems:'center',
        borderRadius:8,
        borderWidth:0.3,
        borderColor:"black",
        height:70,
        padding:8,
    },
  ProfileImgCont:{
        width:50,
        height:50,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    ProfileImg:{
        width:45,
        height:45,
        borderWidth:0.2,
        borderRadius:20,

    },
    MessageContainer:{
      flex: 1,
    },
    sentMessage:{
      maxWidth:320,
      backgroundColor:"#b9f3b9",
      padding:8,
      margin:10,
      borderRadius:8,
      borderWidth:.15,
      display:"flex",
      alignSelf:"flex-end",
    },
    rcvMessage:{
      maxWidth:320,
      backgroundColor:"#f1cec7",
      padding:8,
      margin:10,
      borderRadius:8,
      borderWidth:.15,
      display:"flex",
      alignSelf:"flex-start",
    }
})