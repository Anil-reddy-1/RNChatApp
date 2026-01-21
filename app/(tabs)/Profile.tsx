import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants/images'
import { useAuth } from '@/contexts/AuthContext'
import Login from '@/components/login'

const Profile = () => {
  const Auth = useAuth();
  const [query,setQuery] = useState("");

  useEffect(()=>{

  },[query])

 
  if(!Auth?.isAuthenticated) return(<Login/>)
  return (
    <SafeAreaProvider>
        <SafeAreaView style={{display:"flex",justifyContent:"center",alignItems:"center",height:800}}>
          <Text>Find Friends</Text>
          <View>
            <TextInput value={query} onChangeText={setQuery}/>
          </View>
          
        </SafeAreaView>
    </SafeAreaProvider>
    
  )
}

export default Profile

const styles = StyleSheet.create({
  
})