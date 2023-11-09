import {getDocs ,collection ,addDoc} from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { db } from'../config/firebase'
function get_dataobject(database_name){
    let database_collection = collection(db,database_name);
    let filtered_data;
    async ()=>{
        try{
            const data = await getDocs(database_collection);
            filtered_data = data.docs.map((doc)=>({...doc.data(),id: doc.id,}));
            filtered_data.map((data)=>{console.log(data.dimention); });
        }catch(err){
            console.log(err);
        }
    }
    
    return filtered_data;
}
function submitdata(database_name,obj_item){
    let database_collection = collection(db,database_name);
    try{ addDoc(database_collection,obj_item);
    
  }catch(err){
    console.error(err)
  }
  console.log("submit complete");
  
};
export  {get_dataobject,submitdata};