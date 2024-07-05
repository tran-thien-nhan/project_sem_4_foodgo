import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';

const ChatAssistant = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleSend = async () => {
        if (!input) return;

        const newMessage = { text: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInput('');

        try {
            const response = await axios.post('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
                {
                    contents:
                        [
                            {
                                parts:
                                    [
                                        {
                                            text: input
                                        }
                                    ]
                            }
                        ]
                }
            )

            const assistantResponse = {
                text: response.data.candidates[0].content.parts[0].text,
                sender: 'assistant'
            };

            setMessages([...messages, newMessage, assistantResponse]);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div>
            <div className="fixed bottom-4 right-4">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    style={{ backgroundColor: '#E91E63', color: '#FFFFFF' }}
                    >
                    {isChatOpen ? 'Close' : 'Chat'}
                </Button>
                {isChatOpen && (
                    <div className="fixed bottom-14 right-4 bg-black p-4 border border-gray-950 rounded-lg shadow-lg">
                        <Box className="chat-box mb-4 p-4 border border-gray-950 rounded-lg w-full max-w-md h-80 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender === 'user' ? 'bg-blue-500 text-right' : 'bg-green-500 text-left'} p-2 my-2 rounded`}>
                                    {msg.text}
                                </div>
                            ))}
                        </Box>
                        <div className="flex w-full max-w-md">
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="mr-2"
                                onKeyPress={handleKeyPress}
                            />
                            {/* <IconButton variant="contained" color="primary" onClick={handleSend}>
                                <SendIcon />
                            </IconButton> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatAssistant;
