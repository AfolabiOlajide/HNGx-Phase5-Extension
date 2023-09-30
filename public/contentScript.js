/* eslint-disable no-undef */
console.log("Help Me Out: Content Script Has Been Injected");


const trackedRecordedBlob = [];

var recorder = null;
let streamId;

function onRecord(stream){
    recorder = new MediaRecorder(stream);
    streamId = stream.id;

    console.log("recorder:", recorder);
    console.log("Stream: ", stream);
    console.log("Stream ID: ", stream.id);


    // start recoreder
    recorder.start();

    // whaat should happen when recoreder stops
    recorder.onstop = async function() {
        stream.getTracks().forEach((track) => {
            console.log("track: ", track);

            if(track.readyState === "live"){
                track.stop();
            }
        })

        console.log("tracked recorded blobs: ", trackedRecordedBlob)
        
        // convert recorded blob to base64
        const base64DataArray = [];
        for (const blob of trackedRecordedBlob) {
            const base64Data = await blobToBase64(blob);
            base64DataArray.push(base64Data);
        }
        console.log("bse64Data: ", base64DataArray);
        
        // convert base64 to buffer
        const arrayBufferArray = [];
        for (const base64Data of base64DataArray) {
            const arrayBuffer = base64ToArrayBuffer(base64Data);
            arrayBufferArray.push(arrayBuffer);
        }
        console.log("BufferData: ", arrayBufferArray);
    }

    // 
    recorder.ondataavailable = function(event){
        trackedRecordedBlob.push(event.data);
        let recordedBlob = event.data;
        let url = URL.createObjectURL(recordedBlob);

        console.log("recorder Blob: ", recordedBlob);
        console.log("URL: ", url);

        let a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "screen-recording.webm";

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse)=> {
    // check for the message sent
    if(message.action === "request_recording"){
        console.log("request recording");

        sendResponse(`processed ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                width: 999999,
                height: 999999
            }
        }).then((stream)=> {
            onRecord(stream);
        })
    }

    if(message.action === "stop_recording"){
        console.log("Stoping streaming");
        sendResponse(`processed ${message.action}`);

        if(!recorder) return console.log("No recoreder");

        recorder.stop();
    }
})

// utility functions
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]); // Get the Base64 data (remove data URL header)
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return arrayBuffer;
}