import React, {useState, useEffect, useRef} from 'react'
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
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Tags from './AudioTags';
// #endregion ------------ ICONS ---------

// #region -------- Styled Components -----------------------------------------
const Container = styled('div')(() => ({
    padding: '20px'
}))

const ModelName = styled("span")(() => ({
    color: 'white',
    fontSize: '42px'
}))

const TrackBar = styled(Paper)(() => ({
    backgroundColor: '#4c4c4c',
    marginBottom: '20px',
    padding: '20px',
    width: 'auto'
}))

const PlaybackSlider = styled(Slider)(({theme, ...props}) => ({
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

const LikeButton = styled(Paper)(() => ({
    color: 'grey', 
    width: "2",
    height: "2",
    '&:hover': {
    cursor: "auto",
    }   
}))

const DisLikeButton = styled(Paper)(() => ({
    color: 'grey', 
    width: "2",
    height: "2",
    '&:hover': {
    cursor: "auto",
    }   
}))

// #endregion ---------------------------------------------------------------

const playlist = [];


export default function AudioPlayer({children, ...props}) {
    const audioPlayer = useRef()

    const [index, setIndex] = useState(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(30);
    const [mute, setMute] = useState(false);

    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if(audioPlayer){
            audioPlayer.current.volume = volume / 100;
        }

        
        if(isPlaying){
            setInterval(() => {
                const _duration = Math.floor(audioPlayer?.current?.duration);
                const _elapsed = Math.floor(audioPlayer?.current?.currentTime);

                setDuration(_duration);
                setElapsed(_elapsed);
            }, 100);
        }

    }, [
        volume, isPlaying
    ]);

    function formatTime(time) {
        if(time && !isNaN(time)){
            const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
            const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);

            return `${minutes}:${seconds}`;
        }
        return '00:00';
    }

    // Plays and pause the audio of a given track
    function togglePlay() {
        if(!isPlaying) {
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

    // will skip
    function toggleSkipForward() {
        if(index >= playlist.length - 1) {
            setIndex(0);
            audioPlayer.current.src = playlist[0];
            audioPlayer.current.play();
        } else {
            setIndex(prev => prev + 1);
            audioPlayer.current.src = playlist[index + 1];
            audioPlayer.current.play();
        }
    }

    function toggleSkipBackward() {
        if(index > 0) {
            setIndex(prev => prev - 1);
            audioPlayer.current.src = playlist[index - 1];
            audioPlayer.current.play();
        }
    }
    
    function VolumeBtns() {
        return mute
            ? <VolumeOffIcon sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)} />
            : volume <= 20 ? <VolumeMuteIcon sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)} />
            : volume <= 75 ? <VolumeDownIcon sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)} />
            : <VolumeUpIcon sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)} />
    }

    return (
        <Container>
            <ModelName>{children}</ModelName>
            <audio src={props.src} ref={audioPlayer} muted={mute} />
            <TrackBar>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Stack direction='row' spacing={1} 
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '25%',
                            alignItems: 'center'
                        }}
                    >
                        <VolumeBtns  />

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
                        <SkipPreviousIcon 
                            sx={{
                                color: 'grey', 
                                '&:hover': {color: 'white'}
                            }} 
                            onClick={toggleSkipBackward} disabled={true}/>
                        <FastRewindIcon sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={toggleBackward}/>

                        {!isPlaying
                            ?   <PlayArrowIcon fontSize={'large'} sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={togglePlay}/>
                            :   <PauseIcon fontSize={'large'} sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={togglePlay}/>
                        }


                        <FastForwardIcon sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={toggleForward} />
                        <SkipNextIcon sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={toggleSkipForward}/>
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
                    <Typography sx={{color: 'grey'}}>{formatTime(elapsed)}</Typography>
                    <PlaybackSlider thumbless value={elapsed} max={duration} />
                    <Typography sx={{color: 'grey'}}>{formatTime(duration - elapsed)}</Typography>
                </Stack>
            </TrackBar>
        </Container>
    )
}