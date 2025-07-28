#!/bin/bash

cd "$(dirname "$0")"

OS=$(uname)

if [[ "$OS" == "Darwin" ]]; then
    # macOS
    osascript <<EOF
tell application "Terminal"
    do script "cd \"$(pwd)/backend-jdsb\" && pip install -r requirements.txt && python app.py"
    do script "cd \"$(pwd)/frontend-jdsb\" && npm install && npm start"
end tell
EOF

elif [[ "$OS" == "Linux" ]]; then
    # Linux
    gnome-terminal -- bash -c "cd backend-jdsb && pip install -r requirements.txt && python app.py" \
    --tab -- bash -c "cd frontend-jdsb && npm install && npm start"
else
    echo "Unsupported OS: $OS"
fi

