import Header from '@/components/Header'
import PersonCard from '@/components/PersonCard'
import { images } from '@/constants/images'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const index = () => {
  return (
    <SafeAreaProvider style={{backgroundColor:"rgba(247, 224, 180, 0.4)"}}>
        <SafeAreaView>
            <Header/>
            <View className="flex-1 items-center justify-center bg-gray-900">
                <Text className="text-white text-2xl font-bold">chats</Text>
                <PersonCard name="Anil" imgsrc={images.Friends} LastMessage='hello' isOnline={true} chatId="122" id="1243"/>
            </View>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default index

const styles = StyleSheet.create({});