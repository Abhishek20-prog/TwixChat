import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react'

const strorycreate = ({setshowmodal , fetchstories}) => {
    const storyColors = [
  "#155E63", // Deep Teal
  "#1F7375", // Ocean Teal
  "#2A8C8C", // Fresh Teal
  "#58A6A6", // Soft Teal
  "#A8D5D2", // Light Teal

  "#F26B4D", // Coral
  "#E85A3F", // Deep Coral
  "#F58A6D", // Soft Coral

  "#F9B233", // Warm Gold
  "#F4E6D3", // Cream
];
    const [mode , setmode]=useState("text")
    const [background , setbackground]=useState(storyColors[0])
    const [text , settext] = useState("")
    const [media , setmedia] = useState(null)
    const [purl , setpurl] = useState(null)
    const handlemedia =(e)=>{
        const file = e.target.files?.[0]
        if(file) {
            setmedia(file)
            setpurl(URL.createObjectURL(file))
            
        }
    }
    const createstory = async () => {
        
    }
    


  return (
   <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>
  <div className='w-full max-w-md'>
    <div className='text-center mb-4 flex items-center justify-between'>
      <button className='text-white p-2 cursor-pointer' onClick={()=>setshowmodal(false)}>
        <ArrowLeft />
      </button>
      <h2 className="font-semibold text-lg">
        Create Story
      </h2>
    </div>
  </div>
</div>
  )
}

export default strorycreate