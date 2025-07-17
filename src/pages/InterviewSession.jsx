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
import { fetchInterviewSession, fetchDynamicQuestion } from '../utilities/API/interviewApi';
import { uploadResume } from '../utilities/API/resumeApi';

const InterviewSession = () => {
    const { sessionId } = useParams();
    const [mediaStream, setMediaStream] = useState(null);
    const [questionData, setQuestionData] = useState({ category: '', text: '' });
    const [mode, setMode] = useState('predefined');
    const [questions, setQuestions] = useState({});
    const [response, setResponse] = useState(null);
    const [reportLink, setReportLink] = useState('');
    const [gifKey, setGifKey] = useState(Date.now());
    const [loading, setLoading] = useState(false);


    const currentQIndex = useRef(0);
    const currentCIndex = useRef(0);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const data = await fetchInterviewSession(sessionId);
                if (data.error) {
                    alert(data.error);
                    return;
                }
                setMode(data.question_mode || 'predefined');
                setQuestions(data.questions || {});
            } catch (err) {
                console.error("Failed to load interview session", err);
            }
        };

        loadSession();
    }, [sessionId]);

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

    const refreshGif = () => {
        setGifKey(Date.now());
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(
            (v) =>
                v.lang.startsWith("en") &&
                (v.name.toLowerCase().includes("female") ||
                    v.name.toLowerCase().includes("samantha") ||
                    v.name.toLowerCase().includes("zira") ||
                    v.name.toLowerCase().includes("google us"))
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const getPredefinedQuestion = () => {
        const categories = Object.keys(questions);
        const currentCategory = categories[currentCIndex.current];
        const list = questions[currentCategory];
        const text = list[currentQIndex.current];
        speak(text);
        setQuestionData({ category: currentCategory, text });
        refreshGif();
    };

    const getDynamicQuestion = async () => {
        try {
            const data = await fetchDynamicQuestion(sessionId);
            const question = data.question || 'Tell me about yourself.';
            speak(question);
            setQuestionData({ category: 'AI', text: question });
            refreshGif();
        } catch (error) {
            console.error("Error loading dynamic question", error);
            setQuestionData({ category: 'AI', text: '⚠️ Failed to load dynamic question.' });
        }
    };

    const loadNextQuestion = async () => {
        setResponse(null); // 👈 Reset to trigger "Processing..." message
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
                setReportLink(`/finalreport/${sessionId}`);
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

    const handleResumeUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }

        try {
            const result = await uploadResume(file);
            console.log("Resume uploaded successfully:", result);
            setResponse((prev) => ({
                ...prev,
                resume_summary: result.summary || 'Resume processed successfully!',
            }));
        } catch (error) {
            console.error("Resume upload failed:", error);
            alert("Resume upload failed. Please try again.");
        }
    };


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
                            src={`https://miro.medium.com/v2/resize:fit:800/1*llqlfqGFKm9klLx_itWNLQ.gif?${gifKey}`}
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
                        setLoading={setLoading}
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
                        <Box p={2} sx={{ backgroundColor: '#f1f1f1', borderRadius: 2, boxShadow: 1 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#007b83', fontWeight: 'bold' }}>
                                Candidate Info
                            </Typography>

                            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                                <strong>Session ID:</strong> <span style={{ color: '#333' }}>{sessionId}</span><br />
                                <strong>Mode:</strong> <span style={{ textTransform: 'capitalize', color: '#333' }}>{mode}</span>
                            </Typography>
                        </Box>

                        <QuestionDisplay question={questionData.text} />
                        <TranscriptResult response={response} loading={loading} />

                        {questionData.text.toLowerCase().includes('upload your resume') && (
                            <Stack spacing={1} mt={2}>
                                <Typography variant="body1">📄 Upload your resume (PDF)</Typography>
                                <input type="file" accept="application/pdf" onChange={handleResumeUpload} />
                            </Stack>
                        )}

                        {reportLink && (
                            <Stack mt={3} alignItems="center">
                                <Button
                                    component={Link}
                                    to={reportLink}
                                    variant="contained"
                                    color="primary"
                                >
                                    📄 Download Final Report
                                </Button>
                            </Stack>
                        )}
                    </Box>

                </Paper>
            </Box>
        </Box>
    );
};

export default InterviewSession;