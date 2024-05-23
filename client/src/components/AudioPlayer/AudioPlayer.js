import React, { useState, useEffect, useRef } from 'react'
import {
    styled, Typography, Slider,
    Paper, Stack, Box
} from '@mui/material';


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
        if (time && !isNaN(time)) {
            const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
            const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);

            return `${minutes}:${seconds}`;
        }
        return '00:00';
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
        <Container>
            <ModelName>{children}</ModelName>
            <audio src={props.src} ref={audioPlayer} muted={mute} onEnded={resetPlayer} />
            <TrackBar>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Stack direction='row' spacing={1}
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '25%',
                            alignItems: 'center'
                        }}
                    >
                        <VolumeBtns />

                        <PlaybackSlider min={0} max={100} value={volume}
                            onChange={(e, v) => setVolume(v)}
                        />
                    </Stack>

                    <Stack direction='row' spacing={1}
                        sx={{
                            display: 'flex',
                            width: '40%',
                            alignItems: 'center'
                        }}>


                        <FastRewindIcon sx={{ color: 'grey', '&:hover': { color: 'white' } }} onClick={toggleBackward} />

                        {!isPlaying
                            ? <PlayArrowIcon fontSize={'large'} sx={{ color: 'grey', '&:hover': { color: 'white' } }} onClick={togglePlay} />
                            : <PauseIcon fontSize={'large'} sx={{ color: 'grey', '&:hover': { color: 'white' } }} onClick={togglePlay} />
                        }


                        <FastForwardIcon sx={{ color: 'grey', '&:hover': { color: 'white' } }} onClick={toggleForward} />

                    </Stack>

                    <Stack sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }} />
                </Box>
                <Stack spacing={1} direction='row' sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Typography sx={{ color: 'grey' }}>{formatTime(elapsed)}</Typography>
                    <PlaybackSlider thumbless value={elapsed} max={duration} />
                    <Typography sx={{ color: 'grey' }}>{formatTime(duration - elapsed)}</Typography>
                </Stack>
            </TrackBar>
        </Container>
    )
}