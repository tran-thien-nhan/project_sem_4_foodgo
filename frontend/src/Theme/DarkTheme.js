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
        },
        black: {
            main: "#000000", // Black
        },
        background: {
            main: "#121212", // Dark grey
            default: "#0D0D0D", // Darker grey
            paper: "#333", // Darker grey
        },
        textColor: {
            main: "#ffffff", // White
        },
    },
});