import { useEffect, useRef, useState } from "react";
import Style from './record.module.css'
import { createClient } from "@deepgram/sdk"
import fs from 'fs'

export const Record = () => {
    const { isRecording, startRecording, stopRecording, playPauseAudio, isPlaying, hasAudio, uploadAudio } = useRecorder()
    const PlayPauseButtonName = isPlaying ? "Pause " : "Play "
    const recordOptions = isRecording ? { function: stopRecording, text: "Stop Recording" } : { function: startRecording, text: "Start Recording" }

    return (
        <div className={Style.container}>
            <button
                className={ButtonStyle(recordOptions.text)}

                onClick={recordOptions.function} >{recordOptions.text}</button>
            {hasAudio &&
                <>
                    <button
                        onClick={playPauseAudio}
                        className={ButtonStyle("PlayPause")}>
                        {PlayPauseButtonName}
                    </button>
                    <button
                        className={ButtonStyle("Upload")}
                        onClick={uploadAudio}
                    >
                        Upload
                    </button>
                </>

            }
        </div >

    )
}

const useRecorder = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const chunks = useRef<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const hasAudio = !!audioBlob;

    useEffect(() => {
        if (hasAudio) {
            const url = URL.createObjectURL(audioBlob);
            const newAudio = new Audio(url);

            newAudio.addEventListener('ended', () => {
                setIsPlaying(false);
            });

            setAudio(newAudio);

            return () => {
                newAudio.pause();
                newAudio.src = '';
                URL.revokeObjectURL(url);
            };
        }
    }, [hasAudio, audioBlob]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStream.current = stream;
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.current.push(e.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                const audio = new Blob(chunks.current, { type: 'audio/wav' });
                setAudioBlob(audio);
                // You can do something with the recorded audio blob, like saving it or sending it to a server
                chunks.current = [];
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
            if (mediaStream.current) {
                mediaStream.current.getTracks().forEach(track => track.stop());
            }
            setIsRecording(false);
        }
    };

    const playPauseAudio = () => {
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    function uploadAudio() {

    }



    return {
        isRecording,
        startRecording,
        stopRecording,
        hasAudio,
        playPauseAudio,
        isPlaying,
        uploadAudio
    };
};

function ButtonStyle(text: string) {
    switch (text) {
        case "Start Recording": return `${Style.button} ${Style.startRecordingButton}`
        case "Stop Recording": return `${Style.button} ${Style.stopRecordingButton}`
        case "Upload": return `${Style.button} ${Style.uploadButton}`
        case "PlayPause": return `${Style.button} ${Style.playPauseButton}`
        default: return ``
    }
}

// index.js (node example)

// index.js (node example)




