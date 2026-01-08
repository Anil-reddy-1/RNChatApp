import { images } from '@/constants/images';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {   
    const [visible,setVisible] = useState<boolean>(false);
  return (
    <View>
        <View style={styles.headerContainer}>
            <View>
                <Text>Chat</Text>
            </View>
            <View  >
                <TouchableOpacity onPress={()=>setVisible(prev=>!prev)}>
                    <Image source={images.Friends} style={styles.profile}/>
                </TouchableOpacity>
            </View>
        </View>
        <Modal
        visible={visible}
        animationType='slide'

        style={styles.Model}
        >
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
        
    }
})