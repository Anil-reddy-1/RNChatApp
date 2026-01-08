import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  return (
    <SafeAreaProvider>
        <SafeAreaView>
            <View>
                <Text>profile</Text>
            </View>
        </SafeAreaView>
    </SafeAreaProvider>
    
  )
}

export default Profile

const styles = StyleSheet.create({})