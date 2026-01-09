import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function Chatlayout(){
  return (
    <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name='[person]' options={{headerShown:false}} />
    </Stack>
  )
}


const styles = StyleSheet.create({})