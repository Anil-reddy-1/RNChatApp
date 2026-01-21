import { images } from '@/constants/images';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Header = () => {   
    const [visible1,setVisible1] = useState<boolean>(false);
    const Auth = useAuth();
      const [visible,setVisible] = useState(false);
      const [userName,setUserName]= useState(Auth?.user?.name)
  return (
    <View>
        <View style={styles.headerContainer}>
            <View>
                <Text>Chat</Text>
            </View>
            <View >
                <TouchableOpacity onPress={()=>setVisible1(prev=>!prev)}>
                    <Image source={images.Friends} style={styles.profile}/>
                </TouchableOpacity>
            </View>
        </View>
        <Modal 
        visible={visible1}
        animationType='slide'
        style={styles.Model}
        >
            <TouchableOpacity onPress={()=>{setVisible1(prev=>!prev)}} style={styles.BackImg}>
                <Image source={images.Back} style={styles.BackImg}/>
            </TouchableOpacity>
             <TouchableOpacity onPress={()=>{setVisible(false)}}>
            
                        <View>
                          <TouchableOpacity onPress={()=>{setVisible(true)}}>
                            <Image source={images.Friends} style={{width:120,height:120,borderRadius:60,borderWidth:0.2,alignSelf:"center"}}/>
                          </TouchableOpacity>
                        </View>
                        <View> 
                          <TextInput style={{borderWidth:0.5,borderColor:"grey",width:350,textAlign:"center",padding:8,margin:16}} value={userName} onChangeText={setUserName}/>
                        </View>
                        <TouchableOpacity onPress={Auth?.logOut} style={{width:100,padding:8,margin:12,backgroundColor:"red",borderRadius:5,alignSelf:"center",alignItems:"center"}}>
                          <Text style={{color:"white",fontSize:16,fontWeight:400}}>LogOut </Text>
                        </TouchableOpacity>
            
                        {visible&&(
                          
                            <View style={styles.float} >
                              <View style={styles.twoBlocks}>
                                <Text>Upload Photo</Text></View>
                              <View style={styles.twoBlocks}>
                                <Text>Take A Photo</Text></View>
                            </View>
            
                        )}
            
                        </TouchableOpacity>
            <View>
                <Text>
                    Model
                </Text>
            </View>
        </Modal>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    profile:{
        width:35,
        height:35
    },
    headerContainer:{
        margin:20,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    Model:{
        
    },
    BackImg:{
        width:40,
        height:40,

    },twoBlocks:{
    backgroundColor:"White",
    textAlign:"center",
    borderWidth:0.4,
    borderColor:"grey",
    margin:0,
    padding:8,
    zIndex:20,
    alignItems:"center"
  },
  Main:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    height:700,
    backgroundColor:"#656565"
  },
  float:{
    position:"absolute",
    left:100,
    top:100,
    width:200,
    backgroundColor:"#ffffff"
  }
})