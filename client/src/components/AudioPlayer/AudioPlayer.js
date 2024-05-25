import React, { useState, useEffect, useRef } from 'react'
import {
    styled, Typography, Slider,
    Paper, Stack, Box
} from '@mui/material';
import "./audioplayer.css";


// #region ------------ ICONS ---------
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';

import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// #endregion ------------ ICONS ---------

// #region -------- Styled Components -----------------------------------------
const Container = styled('div')(() => ({
    padding: '1px'
}))

// This is the model name that appears at the top of the audio player
const ModelName = styled("span")(() => ({
    color: 'white',
    fontSize: '42px'
}))

// this is the large container that holds the audio player
const TrackBar = styled(Paper)(() => ({
    backgroundColor: '#4c4c4c',
    marginBottom: '2px',
    padding: '10px',
    width: 'auto',
    borderTopLeftRadius: '10px',  // This rounds the top-left corner
    borderTopRightRadius: '10px',  // This rounds the top-right corner
}))

// This is the slider that controls the volume
const PlaybackSlider = styled(Slider)(({ theme, ...props }) => ({
    color: '#EEEEEE',
    height: 2,
    '&:hover': {
        cursor: 'auto',
    },
    '& .MuiSlider-thumb': {
        width: '13px',
        height: '13px',
        display: props.thumbless ? 'none' : 'block',
    }
}))



// #endregion ---------------------------------------------------------------
const StyledSlider = Slider;


export default function AudioPlayer({ children, ...props }) {
    const audioPlayer = useRef()
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(30);
    const [mute, setMute] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (audioPlayer) {
            audioPlayer.current.volume = volume / 100;
        }


        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                const _duration = audioPlayer?.current?.duration;
                const _elapsed = audioPlayer?.current?.currentTime; // Use fractional time to ensure slider moves smoothly

                setDuration(_duration);
                setElapsed(_elapsed);
            }, 100);
        }
        // This function will run when the component unmounts or when `volume` or `isPlaying` changes
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [volume, isPlaying]);

    function formatTime(time) {
        if (!time || isNaN(time)) return '00:00.0';

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const tenthsOfSecond = Math.round((time % 1) * 10); // calculate tenths of a second

        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        const formattedTenths = `${tenthsOfSecond}`; // no need for leading zeros for tenths of a second

        return `${formattedMinutes}:${formattedSeconds}.${formattedTenths}`;
    }

    // Plays and pause the audio of a given track
    function togglePlay() {
        if (!isPlaying) {
            audioPlayer.current.play()
        } else {
            audioPlayer.current.pause()
        }
        setIsPlaying(prev => !prev)
    }

    // Allows the user to toggle the audio forward 
    function toggleForward() {
        audioPlayer.current.currentTime += 10;
    }

    // Allows the user to toggle the audio backward
    function toggleBackward() {
        audioPlayer.current.currentTime -= 10;
    }


    function VolumeBtns() {
        return mute
            ? <VolumeOffIcon sx={{ color: 'grey', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
            : volume <= 20 ? <VolumeMuteIcon sx={{ color: 'grey', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
                : volume <= 75 ? <VolumeDownIcon sx={{ color: 'grey', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
                    : <VolumeUpIcon sx={{ color: 'grey', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
    }

    function resetPlayer() {
        audioPlayer.current.pause();
        audioPlayer.current.currentTime = 0;
        setIsPlaying(false);
    }

    return (
        <div>
            <div className="model-name">{children}</div>
            <div className="container">
                <audio src={props.src} ref={audioPlayer} muted={mute} onEnded={resetPlayer} />
                <div className="track-bar">
                    <div className="controls">
                        <div className="stack-flex-start">
                            <VolumeBtns />
                            <Slider className="volume-slider" min={0} max={100} value={volume}
                                onChange={(e, v) => setVolume(v)}
                            />
                        </div>
                        <div className="stack-center">
                            <FastRewindIcon className="rewind-icon" onClick={toggleBackward} />
                            {!isPlaying
                                ? <PlayArrowIcon className="play-pause-icon" onClick={togglePlay} />
                                : <PauseIcon className="play-pause-icon" onClick={togglePlay} />
                            }
                            <FastForwardIcon className="fast-forward-icon" onClick={toggleForward} />
                        </div>
                        <div className="stack-flex-end"></div> 
                    </div>
                    <div className="time-stamp">
                        <Typography className="time-stamp">{formatTime(elapsed)}</Typography>
                        <Slider className="playback-slider slider" value={elapsed} max={duration} />
                        <Typography className="time-stamp">{formatTime(duration - elapsed)}</Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}