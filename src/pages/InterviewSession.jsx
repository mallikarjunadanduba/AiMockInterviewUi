import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Link as MuiLink,
    Stack,
    Button,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import VideoPreview from '../components/Interview/VideoPreview';
import QuestionDisplay from '../components/Interview/QuestionDisplay';
import RecorderControls from '../components/Interview/RecorderControls';
import TranscriptResult from '../components/Interview/TranscriptResult';

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
                width: '100%',
                minHeight: '100vh',
                background: 'linear-gradient(180deg, rgb(0,175,181) 0%, white 50%, rgb(0,175,181) 100%)',
                px: { xs: 1.5, sm: 3 },
                pt: { xs: 10, sm: 10 },
                pb: 5,
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '1300px',
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    gap: { xs: 3, md: 4 },
                }}
            >
                {/* Left Side */}
                <Paper
                    elevation={3}
                    sx={{
                        flexGrow: 1,
                        maxWidth: { xs: '90%', md: 580 },
                        width: '100%',
                        p: 2,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <VideoPreview stream={mediaStream} />
                        <Box
                            component="img"
                            src="https://miro.medium.com/v2/resize:fit:800/1*llqlfqGFKm9klLx_itWNLQ.gif"
                            alt="Bot"
                            sx={{
                                width: { xs: 80, md: 120 },
                                height: { xs: 80, md: 120 },
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                bgcolor: 'white',
                                p: 0.5,
                                boxShadow: 3,
                                borderRadius: 1,
                            }}
                        />
                    </Box>

                    <RecorderControls
                        stream={mediaStream}
                        sessionId={sessionId}
                        questionData={questionData}
                        onNext={loadNextQuestion}
                        setResponse={setResponse}
                    />
                </Paper>

                {/* Right Side */}
                <Paper
                    elevation={3}
                    sx={{
                        flexGrow: 1,
                        maxWidth: { xs: '88%', md: 580 },
                        width: '100%',
                        p: 2.5,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        <QuestionDisplay category={questionData.category} question={questionData.text} />
                        <TranscriptResult response={response} />

                        {reportLink && (
                            <Stack mt={2} alignItems="center">
                                <MuiLink href={reportLink} target="_blank" underline="hover">
                                    📄 Download Final Report
                                </MuiLink>
                            </Stack>
                        )}

                        <Typography variant="h6" gutterBottom mt={3}>
                            📋 Instructions
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            • Ensure webcam & mic are active.<br />
                            • Click "Next" after answering.<br />
                            • Final report available at the end.
                        </Typography>

                        <Typography variant="h6" mt={3}>
                            🧑 Candidate Info
                        </Typography>
                        <Typography variant="body2">
                            Session ID: <strong>{sessionId}</strong><br />
                            Mode: <strong>{mode}</strong>
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        to="/finalreport"
                        variant="contained"
                        sx={{ mt: 3, alignSelf: 'center' }}
                    >
                        FINAL REPORT
                    </Button>
                </Paper>
            </Box>
        </Box>

    );
};

export default InterviewSession;
