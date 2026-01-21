import React from 'react'
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { usePerson } from '@/contexts/PersonContext'

type prop={
    id:string,
    name:string,
    imgsrc:ImageSourcePropType | undefined,
    isOnline:boolean,
    LastMessage:string,
    chatId:string,
}
  

const PersonCard = (props:prop) => {
    const router = useRouter();
    const personContext = usePerson();

    const handleRoute=()=>{
        personContext.setPerson(props)
        router.push(`/chat/${props.id}` as any)
    }
    
  return (
    <View style={styles.Container}  >
        <View style={styles.ProfileImgCont}>
            <Image source={props.imgsrc} style={styles.ProfileImg}/>
        </View>
        <View>
            <TouchableOpacity onPress={handleRoute}>
            <Text style={{fontSize:16,fontWeight:500,padding:4}}> {props.name} </Text>
            <View style={styles.cardBottom}>
                {props.isOnline?(<Text style={{fontSize:14,fontWeight:700,color:"#0d8a28ff"}}> Online</Text>):(<Text style={{fontSize:14,fontWeight:500,padding:4,color:"#ff3030ff"}}>Offline</Text>)}
                <Text>{props.LastMessage}</Text>
            </View>
            </TouchableOpacity>
        </View>
      
    </View>
  ) 
}

export default PersonCard

const styles = StyleSheet.create({
    Container:{
        display:"flex",
        flexDirection:"row",
        borderRadius:8,
        borderWidth:0.3,
        borderColor:"black",
        height:70,
        margin:10,
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
    cardBottom:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        width:320,
        marginLeft:8,
        padding:2,
    }
})