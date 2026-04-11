#!/bin/bash
set -e

echo ""
echo "HADALING AUDIO CLEANUP"
echo "======================"

if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "ERROR: Run this from the hadaling repo root"
    exit 1
fi

# Count old files
OLD_COUNT=0
if [ -d "public/audio" ]; then
    OLD_COUNT=$(find public/audio -type f -name "*.mp3" 2>/dev/null | wc -l | tr -d ' ')
    echo "Found $OLD_COUNT MP3 files to remove"
fi

# Delete everything
if [ -d "public/audio" ]; then
    find public/audio -type f -name "*.mp3" -delete 2>/dev/null || true
    for i in 1 2 3 4 5 6 7 8 9 10; do
        rm -rf "public/audio/lesson-$i" 2>/dev/null || true
    done
    rm -rf "public/audio/wotd" "public/audio/lessons" "public/audio/practice" 2>/dev/null || true
    find public/audio -type d -empty -delete 2>/dev/null || true
fi

# Create new structure
for i in 1 2 3 4 5 6 7 8 9 10; do
    mkdir -p "public/audio/lessons/lesson-$i"
done
mkdir -p "public/audio/practice/vocabulary"
mkdir -p "public/audio/practice/word-formation"
mkdir -p "public/audio/practice/sentence-builder"
mkdir -p "public/audio/wotd"

# Add .gitkeep
for dir in $(find public/audio -type d); do
    touch "$dir/.gitkeep"
done

echo "Deleted $OLD_COUNT old files"
echo "Created new folder structure"
echo ""
echo "Next: python generate_hadaling_audio.py"
