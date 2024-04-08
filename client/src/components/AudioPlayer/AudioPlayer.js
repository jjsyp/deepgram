import React, {useState, useEffect, useRef} from 'react'
import {styled, Typography, Slider, Paper, Stack, Box} from '@mui/material';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Tags from './AudioTags';

const Container = styled('div')(() => ({padding: '20px'}));
const ModelName = styled("span")(() => ({color: 'white', fontSize: '42px'}));
const TrackBar = styled(Paper)(() => ({backgroundColor: '#4c4c4c', marginBottom: '20px', padding: '20px', width: 'auto'}));
const PlaybackSlider = styled(Slider)(({theme, ...props}) => ({
    color: '#EEEEEE',
    height: 2,
    '&:hover': {cursor: 'auto'},
    '& .MuiSlider-thumb': {width: '13px', height: '13px', display: props.thumbless ? 'none' : 'block'}
}));

export default function AudioPlayer({children, src, tagList}) {
    console.log("src", src);
    const audioPlayer = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(30);
    const [mute, setMute] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if(src){
            const binaryString = atob(src.split(',')[1]);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes.buffer], { type: 'audio/mp3' });
            const blobURL = URL.createObjectURL(blob);
            audioPlayer.current.src = blobURL;

            return () => {
                URL.revokeObjectURL(blobURL);
            };
        }
    }, [src]);

    useEffect(() => {
        if(audioPlayer){
            audioPlayer.current.volume = volume / 100;
        }

        if(isPlaying){
            const timer = setInterval(() => {
                const _duration = Math.floor(audioPlayer?.current?.duration);
                const _elapsed = Math.floor(audioPlayer?.current?.currentTime);

                setDuration(_duration);
                setElapsed(_elapsed);
            }, 1000);
            return () => clearInterval(timer);
        }

    }, [volume, isPlaying]);

    function formatTime(time) {
        if(time && !isNaN(time)){
            const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
            const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);

            return `${minutes}:${seconds}`;
        }
        return '00:00';
    }

    function togglePlay() {
        if(!isPlaying) {
            audioPlayer.current.play()
        } else {
            audioPlayer.current.pause()
        }
        setIsPlaying(prev => !prev)
    }

    function toggleForward() {
        audioPlayer.current.currentTime += 10;
    }

    function toggleBackward() {
        audioPlayer.current.currentTime -= 10;
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
            <audio ref={audioPlayer} muted={mute} />
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
                        <PlaybackSlider min={0} max={100} value={volume} onChange={(e, v) => setVolume(v)}/>
                    </Stack>
                    <Stack direction='row' spacing={1} sx={{display: 'flex', width: '40%', alignItems: 'center'}}>
                        <FastRewindIcon sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={toggleBackward}/>
                        {!isPlaying
                            ?   <PlayArrowIcon fontSize={'large'} sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={togglePlay}/>
                            :   <PauseIcon fontSize={'large'} sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={togglePlay}/>
                        }
                        <FastForwardIcon sx={{color: 'grey', '&:hover': {color: 'white'}}} onClick={toggleForward} />
                    </Stack>
                    <Stack sx={{display: 'flex', justifyContent: 'flex-end', width: '35%'}} />
                </Box>
                <Stack spacing={1} direction='row' sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography sx={{color: 'grey'}}>{formatTime(elapsed)}</Typography>
                    <PlaybackSlider thumbless value={elapsed} max={duration} />
                    <Typography sx={{color: 'grey'}}>{formatTime(duration - elapsed)}</Typography>
                </Stack>
            </TrackBar>
            <Tags tagList={tagList} />
        </Container>
    )
}