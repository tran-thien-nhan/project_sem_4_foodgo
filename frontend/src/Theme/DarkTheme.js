const {createTheme} = require("@mui/material");

// Tạo một theme mới với các thuộc tính tùy chỉnh
export const darkTheme = createTheme({ //createTheme là một hàm tạo theme mới với các thuộc tính tùy chỉnh
    palette: {
        mode: "dark", // Enable dark mode
        primary: {
            main: "#e91e63", // Pink
        },
        secondary: {
            main: "#f48fb1", // Pink
            // main: "#000000", // Black 
        },
        error: {
            main: "#f44336", // Red
        },
        warning: {
            main: "#ff9800", // Orange
        },
        info: {
            main: "#2196f3", // Blue
        },
        success: {
            main: "#4caf50", // Green
        },
        background: {
            default: "#121212", // Dark grey
            paper: "#121212", // Dark grey
        },
        text: {
            primary: "#ffffff", // White
        },
        grey: {
            main: "#757575", // Grey
        },
        background: {
            main: "#000000", // Dark grey
            default: "#121212", // Dark grey
            paper: "#121212", // Dark grey
        },
        textColor: {
            main: "#ffffff", // White
        },
    },
});