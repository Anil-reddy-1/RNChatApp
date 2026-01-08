import Header from '@/components/Header'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const Chats = () => {
  return (
    <SafeAreaProvider style={{backgroundColor:"rgba(247, 224, 180, 0.4)"}}>
        <SafeAreaView>
            <Header/>
            <View className="flex-1 items-center justify-center bg-gray-900">
                <Text className="text-white text-2xl font-bold">chats</Text>
            </View>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Chats

const styles = StyleSheet.create({});