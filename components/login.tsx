import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState('');
    const [error, setError] = useState("");
    const context = useAuth();

    async function Login() {
    
        setError("");
        if (name.trim().length < 5) {
            setError("user name must be greater than 4 character");
            return
        }

        if (!email.includes("@gmail.com")) {
            setError("must be a valid email");
            return
        }

        if (password.trim().length < 8) {
            setError("password must be atleast 8 characters");
            return;
        }
        try {
            const userData = await api.post("/user", { name, email, password })
            const user = { name: userData.data.name, token: userData.data.token, id: userData.data.id };
            context?.setUser(user)
            await AsyncStorage.setItem("ChatUserData", JSON.stringify(user))
            console.log(context?.user);
        } catch (error: any) {
            console.log(error);
            if (error.response) {
                setError(error.response.data.message)
            } else setError("something went wrong")
        }

    }
  return (
    <View style={{width:420,height:850,display:"flex",justifyContent:"center",alignItems:"center"}}>
         <Text style={{alignSelf:"center",fontSize:20,fontWeight:700,}}>Login/Register</Text>
         
         <View style={styles.Container}>
            <View>
                <Text style={styles.Label}>UserName</Text>
                <TextInput style={styles.Input}  value={name} onChangeText={setName}></TextInput>
            </View>
            <View>
                <Text style={styles.Label}>Email</Text>
                <TextInput style={styles.Input}  value={email} onChangeText={setEmail}></TextInput>
            </View>
            <View>
                <Text style={styles.Label}>Password</Text>
                <TextInput style={styles.Input}  value={password} onChangeText={setPassword}></TextInput>
            </View>
            {error&&(
                
                    <Text style={{alignSelf:"center",color:"red",fontSize:14,}}>{error}</Text>
                
                )}
            <TouchableOpacity style={styles.Button} onPress={Login}>
                <Text style={{fontSize:18,fontWeight:500,color:"white"}}>Login</Text>
            </TouchableOpacity>
            
            
        </View>
    </View>
   
  )
}

export default Login

const styles = StyleSheet.create({
    Container:{
        width:400,
        height:350,
        backgroundColor:"#ffffff",
        justifyContent:"center",
        margin:12
    },
    Label:{
        fontSize:18,
        fontWeight:500,
        margin:4,
    },
    Input:{
        width:370,
        borderWidth:0.5,
        borderColor:"grey",
        borderRadius:5,
        margin:4,
    },
    Button:{
        margin:12,
        width:100,
        backgroundColor:"#24A0ED",
        color:"white",
        alignItems:"center",
        alignSelf:"center",
        fontSize:22,
        fontWeight:600,
        padding:10,
        borderRadius:8,
    }
})