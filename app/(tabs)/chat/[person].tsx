import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router/build/hooks'


type prop={
    id:string,
    name:string,
    imgsrc:ImageSourcePropType | undefined,
    isOnline:boolean,
    LastMessage:string,
    chatId:string,
}

const Chat = () => {
  const {person:prop} = useLocalSearchParams();
  return (
    <View>
      <Text>Chat</Text>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({})