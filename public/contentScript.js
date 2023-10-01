/* eslint-disable no-undef */
console.log("Help Me Out Extension Content Script Has Been Injected");



var recorder = null;


function onRecord(stream){
    // track chunks
    const trackedRecordedChunks = [];
    // track chunk blob
    const chunkBlobs = []
    var streamId = stream.id;
    const options = { mimeType: "video/webm;codecs=vp9" };

    recorder = new MediaRecorder(stream, options);

    console.log("recorder:", recorder);
    console.log("Stream: ", stream);
    console.log("Stream ID: ", streamId);


    // start recoreder
    recorder.start()
    startRecording();
    async function startRecording(){
        try {
            const res = await fetch("https://weak-blue-hermit-crab-veil.cyclic.cloud/videos/create", {
                method: "POST"
            });
            const data = await res.json();
            console.log(data);
            localStorage.setItem("videoId", data.data.id);
        } catch (error) {
            console.log(error);
        }
    }



    // what should happen when recoreder stops
    recorder.onstop = function() {
        stream.getTracks().forEach((track) => {
            console.log("track: ", track);
            if(track.readyState === "live"){
                track.stop();
            }
        })

        handleRedirect();
        console.log("tracked recorded chunks: ", trackedRecordedChunks);
        console.log("tracked recorded chunkBlobs: ", chunkBlobs);
        localStorage.removeItem("videoId");
    }

    // what happens when dataonavailable
    recorder.ondataavailable = async function(event){
        if(event.data.size > 0){
            const blobChunk = new Blob([event.data], { type: "video/webm" });
            trackedRecordedChunks.push(event.data);
            chunkBlobs.push(blobChunk);

            handleSendChunkToServer(blobChunk)
        }
    }
}





// message listener
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





// utils functions
// send chunk to server
async function handleSendChunkToServer(chunk){
    const videoId = localStorage.getItem("videoId");

    try {
        const res = await fetch(`https://weak-blue-hermit-crab-veil.cyclic.cloud/videos/save/${videoId}`, {
            method: "POST",
            body: chunk
        })
        const data = await res.json();
        console.log(data);
    } catch (error) {
        
    }
    console.log("Chunk sending to server: ", chunk);
}

// handle redirect
function handleRedirect(id){
    const videoId = localStorage.getItem("videoId");
    const url = `http://localhost:3000/preview/${videoId}`;

    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.target = "_blank"

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
}


