import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Link as MuiLink,
    Avatar,
    Stack,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import VideoPreview from '../components/Interview/VideoPreview';
import QuestionDisplay from '../components/Interview/QuestionDisplay';
import RecorderControls from '../components/Interview/RecorderControls';
import TranscriptResult from '../components/Interview/TranscriptResult';
import BotGIF from '../assets/images/logo/bot.gif';

const InterviewSession = () => {
    const { sessionId } = useParams();
    const [mediaStream, setMediaStream] = useState(null);
    const [questionData, setQuestionData] = useState({ category: '', text: '' });
    const [mode, setMode] = useState('predefined');
    const [questions, setQuestions] = useState({});
    const [response, setResponse] = useState(null);
    const [reportLink, setReportLink] = useState('');

    const currentQIndex = useRef(0);
    const currentCIndex = useRef(0);

    useEffect(() => {
        const mockData = {
            question_mode: 'predefined',
            questions: {
                Behavioral: [
                    'Describe a time you had a conflict at work and how you resolved it.',
                    'What’s your biggest strength?',
                ],
                Technical: [
                    'What is a closure in JavaScript?',
                    'Explain useEffect hook in React.',
                ],
            },
        };

        setMode(mockData.question_mode);
        setQuestions(mockData.questions);
    }, []);

    useEffect(() => {
        async function initCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setMediaStream(stream);
            } catch (err) {
                alert('Could not access webcam/mic: ' + err.message);
            }
        }

        initCamera();
    }, []);

    const getDynamicQuestion = async () => {
        const res = await fetch(`/get_dynamic_question/${sessionId}`);
        const data = await res.json();
        setQuestionData({ category: 'AI', text: data.question || 'Tell me about yourself.' });
    };

    const getPredefinedQuestion = () => {
        const categories = Object.keys(questions);
        const currentCategory = categories[currentCIndex.current];
        const list = questions[currentCategory];
        const text = list[currentQIndex.current];
        setQuestionData({ category: currentCategory, text });
    };

    const loadNextQuestion = async () => {
        if (mode === 'predefined') {
            const categories = Object.keys(questions);
            const currentCategory = categories[currentCIndex.current];
            const list = questions[currentCategory];

            currentQIndex.current++;
            if (currentQIndex.current >= list.length) {
                currentCIndex.current++;
                currentQIndex.current = 0;
            }

            if (currentCIndex.current < categories.length) {
                getPredefinedQuestion();
            } else {
                setQuestionData({ category: '', text: '✅ Interview Completed!' });
                setReportLink(`/final_report/${sessionId}`);
                stopStream();
            }
        } else {
            await getDynamicQuestion();
        }
    };

    const stopStream = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
        }
    };

    useEffect(() => {
        if (mode === 'predefined' && Object.keys(questions).length > 0) {
            getPredefinedQuestion();
        } else if (mode === 'dynamic') {
            getDynamicQuestion();
        }
    }, [questions, mode]);

    return (
        <Box
            sx={{
                width: {
                    xs: '93.5%',     // narrower on small screens
                    sm: '93.5%',
                    md: '100%',
                },
                maxWidth: '1480px',
                mx: 'auto',
                minHeight: '100vh',
                background: `linear-gradient(180deg, rgb(0, 175, 181) 0%, white 50%,rgb(0, 175, 181) 100%)`,
                p: { xs: 1.5, sm: 3 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 1.5, md: 3 },
                alignItems: 'flex-start',
            }}
        >

            {/* Left Section: Video + Question */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    minWidth: { xs: '100%', md: '0' },
                    mt: { xs: 8, md: 8 },
                }}
            >
                {/* Video Container */}
                <Paper elevation={3} sx={{ p: 1.5, position: 'relative' }}>
                    <VideoPreview stream={mediaStream} />
                    <Box
                        component="img"
                        src="https://miro.medium.com/v2/resize:fit:800/1*llqlfqGFKm9klLx_itWNLQ.gif"
                        alt="Bot"
                        sx={{
                            width: { xs: 40, md: 150 },
                            height: { xs: 40, md: 150 },
                            position: 'absolute',
                            bottom: 16,
                            right: 12,
                            bgcolor: 'white',
                            p: 0.5,
                            boxShadow: 2,
                        }}
                    />
                </Paper>

                <Paper elevation={3} sx={{ p: 2 }}>
                    {/* Center RecorderControls */}
                    <Stack alignItems="center" justifyContent="center" direction="row" mb={2}>
                        <RecorderControls
                            stream={mediaStream}
                            sessionId={sessionId}
                            questionData={questionData}
                            onNext={loadNextQuestion}
                            setResponse={setResponse}
                        />
                    </Stack>

                    <TranscriptResult response={response} />

                    {reportLink && (
                        <Stack mt={2} alignItems="center">
                            <MuiLink href={reportLink} target="_blank" underline="hover">
                                📄 Download Final Report
                            </MuiLink>
                        </Stack>
                    )}
                </Paper>

            </Box>

            {/* Right Section: Instructions */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: { xs: '100%', md: '0' },
                    mt: { xs: 2, md: 8 },
                    height: '648px'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        height: '100%',
                        p: 2,
                    }}
                >
                    <QuestionDisplay category={questionData.category} question={questionData.text} />
                    <Typography variant="h6" gutterBottom>📋 Instructions</Typography>
                    <Typography variant="body2" gutterBottom>
                        • Ensure webcam & mic are active.<br />
                        • Click "Next" after answering.<br />
                        • Final report available at the end.
                    </Typography>
                    <Typography variant="h6" mt={2}>🧑 Candidate Info</Typography>
                    <Typography variant="body2">
                        Session ID: <strong>{sessionId}</strong><br />
                        Mode: <strong>{mode}</strong>
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default InterviewSession;
