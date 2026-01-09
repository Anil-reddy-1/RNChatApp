import React, { createContext, SetStateAction, useContext, useState } from "react";
import { ImageSourcePropType } from "react-native";




type person={
    id:string,
    name:string,
    imgsrc:ImageSourcePropType | undefined,
    isOnline:boolean,
    LastMessage:string,
    chatId:string,
}

type personContext={
    person:person|null,
    setPerson:React.Dispatch<SetStateAction<person|null>>,
}

const PersonContext = createContext<personContext|undefined>(undefined);


export const PersonProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [person, setPerson] = useState<person|null>(null);
    
    return (
        <PersonContext.Provider value={{person,setPerson}}>
            {children}
        </PersonContext.Provider>
    )
}

export  const usePerson=()=>{
    const context = useContext(PersonContext);
    if(context) return context;
    throw new Error("use within provider region");
}

export default PersonContext;