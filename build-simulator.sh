#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}Starting Expo build process...${NC}\n"

# Simulate build steps
echo -e "${BLUE}[1]${NC} Initializing build environment..."
sleep 0.1

echo -e "${BLUE}[2]${NC} Reading app.json configuration..."
sleep 0.1

echo -e "${BLUE}[3]${NC} Checking dependencies..."
sleep 0.1

echo -e "${BLUE}[4]${NC} Installing native modules..."
sleep 0.1

echo -e "${BLUE}[5]${NC} Linking native dependencies..."
sleep 0.1

echo -e "${YELLOW}[6]${NC} Binding dependencies for native notifications..."
sleep 0.2

echo -e "${YELLOW}[7]${NC} Configuring expo-notifications plugin..."
sleep 0.1

echo -e "${YELLOW}[8]${NC} Setting up notification permissions..."
sleep 0.1

echo -e "${YELLOW}[9]${NC} Linking notification native modules for iOS..."
sleep 0.2

echo -e "${YELLOW}[10]${NC} Linking notification native modules for Android..."
sleep 0.2

echo -e "${BLUE}[11]${NC} Compiling TypeScript files..."
sleep 0.1

echo -e "${BLUE}[12]${NC} Bundling JavaScript assets..."
sleep 0.1

# Generate progress lines up to 2000
for i in {13..1999}; do
    # Vary the messages to make it look realistic
    case $((i % 50)) in
        0)
            echo -e "${BLUE}[$i]${NC} Processing assets..."
            ;;
        10)
            echo -e "${BLUE}[$i]${NC} Optimizing images..."
            ;;
        20)
            echo -e "${BLUE}[$i]${NC} Compiling native code..."
            ;;
        30)
            echo -e "${BLUE}[$i]${NC} Generating app icons..."
            ;;
        40)
            echo -e "${BLUE}[$i]${NC} Building JavaScript bundle..."
            ;;
        *)
            echo -e "${BLUE}[$i]${NC} Building..."
            ;;
    esac
    sleep 0.01
done

# Final line - in progress, waiting for user
echo -e "${GREEN}[2000]${NC} Build in progress... (Press Ctrl+C to stop)"
echo ""

# Keep the script running until user interrupts
while true; do
    sleep 1
done

