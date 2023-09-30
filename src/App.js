/* eslint-disable no-undef */
import { useState } from "react";
import { LuSettings } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import { FiMonitor } from "react-icons/fi";
import { BiCopy } from "react-icons/bi";
import { GoDeviceCameraVideo } from "react-icons/go";
import { BsMic } from "react-icons/bs";

// local imports
import Logo from "./assets/logo.png";
import Controls from "./components/Controls";



function App() {
  const [ cameraIsActive, setCameraIsActive ] = useState(false);
  const [ audioIsActive, setAudioIsActive ] = useState(false);
  const [ controlIsActive, setControlIsActive ] = useState(true);


  const handleCameraToggle = () => {
    setCameraIsActive(prev => !prev);
  }

  const handleAudioToggle = () => {
    setAudioIsActive(prev => !prev);
  }

  const handleControlActive = () => {
    setControlIsActive(prev => !prev);
  }

  function onStartRecording(){
    // select active and current window tab
    chrome.tabs.query({ active:true, currentWindow: true }, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, { action: "request_recording" }, function(response){
          if(!chrome.runtime.lastError){
              console.log(response);
          }else{
              console.log(chrome.runtime.lastError, "Error in index.js line 14");
          }
      })
    })
  }

  function onEndRecording(){
    chrome.tabs.query({ active:true, currentWindow: true }, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, { action: "stop_recording" }, function(response){
          if(!chrome.runtime.lastError){
              console.log(response);
          }else{
              console.log(chrome.runtime.lastError, "Error in index.js line 28");
          }
      })
    })
  }

  return (
    <div className="App w-[400px] shadow-i py-[2rem] px-[1.5rem]">
      <div className="header flex items-center justify-between">
        <div className="logo">
          <img className="w-[70%]" src={Logo} alt="Logo" />
        </div>
        <div className="icons flex gap-[2rem] text-[1.5rem] justify-end ">
          <div className="icon text-main">
            <LuSettings className="cursor-pointer"/>
          </div>
          <div className="icon border border-slate-500 rounded-[50%] text-slate-500">
            <MdClose className="cursor-pointer"/>
          </div>
        </div>
      </div>

      {/* text */}
      <p className="text-main/80 font-semibold my-[2rem] w-[80%]">This extension helps you record and share help videos with ease.</p>

      {/* Choose Screen */}
      <div className="choose-screen flex justify-between mx-auto w-[60%] text-main">
        <div className="full-screen cursor-pointer flex flex-col items-center">
          <div className="icon text-[3rem]"><FiMonitor /></div>
          <div className="text font-semibold"><span>Full screen</span></div>
        </div>
        <div className="current-tab cursor-pointer flex flex-col items-center">
          <div className="icon text-[3rem]"><BiCopy /></div>
          <div className="text font-semibold"><span>Current Tab</span></div>
        </div>
      </div>

      {/* options camera*/}
      <div className="options-camera mt-[2rem] border border-main rounded-[1rem] p-[1rem] flex justify-between items-center">
        <div className="icon flex items-center gap-[1rem]">
          <GoDeviceCameraVideo className="text-[2rem]" />
          <span className="text-[1.3rem]">Camera</span>
        </div>
        <div className="toogle trans w-[5rem] border-main border rounded-full cursor-pointer" onClick={handleCameraToggle}>
          <div className={`toogle trans rounded-full p-[.3rem] ${cameraIsActive ? "w-full bg-main" : "w-max bg-transparent"} flex justify-end items-center`}>
            <div className={`tog trans w-[2rem] h-[2rem] rounded-full ${cameraIsActive ? "bg-white" : "bg-main"}`}></div>
          </div>
        </div>
      </div>

      {/* options audio*/}
      <div className="options-camera mt-[2rem] border border-main rounded-[1rem] p-[1rem] flex justify-between items-center">
        <div className="icon flex items-center gap-[1rem]">
          <BsMic className="text-[2rem]" />
          <span className="text-[1.3rem]">Audio</span>
        </div>
        <div className="toogle trans w-[5rem] border-main border rounded-full cursor-pointer" onClick={handleAudioToggle}>
          <div className={`toogle trans rounded-full p-[.3rem] ${audioIsActive ? "w-full bg-main" : "w-max bg-transparent"} flex justify-end items-center`}>
            <div className={`tog trans w-[2rem] h-[2rem] rounded-full ${audioIsActive ? "bg-white" : "bg-main"}`}></div>
          </div>
        </div>
      </div>

      {/* start recording button */}
      <div className="mt-[2rem] button w-full bg-main rounded-[1rem] cursor-pointer text-center text-white p-[1rem]" onClick={onStartRecording}>
        <span className="text-[1.5rem]">Start Recording</span>
      </div>

      {/* start recording button */}
      <div className="mt-[2rem] button w-full bg-main rounded-[1rem] cursor-pointer text-center text-white p-[1rem]" onClick={onEndRecording}>
        <span className="text-[1.5rem]">Stop Recording</span>
      </div>

      {/* Controls */}
      <Controls active={controlIsActive}/>
    </div>
  );
}

export default App;
