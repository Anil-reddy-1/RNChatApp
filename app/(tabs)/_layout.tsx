import { StyleSheet,Image, Text, View, ImageSourcePropType, ActivityIndicator } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { useAuth } from '@/contexts/AuthContext'
import Login from '@/components/login'

const Icon = ({src}:any)=>(<>
    <Image source={src} style={styles.icon} />
</>)

const _layout = () => {
    const Auth = useAuth();
    if (Auth&&Auth.isLoading) return (<View>
        <ActivityIndicator size="large"></ActivityIndicator>
    </View>)

  return (
    <Tabs
    screenOptions={{
        headerShown:false,
        tabBarActiveTintColor:"black",
        tabBarInactiveTintColor:"grey",
        tabBarStyle:{
            backgroundColor:"white"
        },
        tabBarLabelStyle:{
            fontSize:14
        }
    }}
    >
        <Tabs.Screen name='chat' options={{title:"Chats", tabBarIcon:(props)=> (<>
        <Icon src={images.Home}/>
        </>)}}/>
        <Tabs.Screen name='Profile' options={{title:"Profile", tabBarIcon:(props)=> (<>
        <Icon src={images.Friends}/>
        </>),}}/>
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({
    icon:{
    width: 24,
    height: 24,
    marginTop: 10,
    tintColor: 'black',
  },
})