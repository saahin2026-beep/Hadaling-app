#!/usr/bin/env python3
"""
generate_hadaling_audio.py
==========================
Generates ALL 140 Hadaling audio files using Microsoft Edge TTS (FREE)

Setup:
  pip install edge-tts

Run from your hadaling repo root:
  python generate_hadaling_audio.py
"""

import asyncio
import os
import sys

try:
    import edge_tts
except ImportError:
    print("edge-tts not installed. Run: pip install edge-tts")
    sys.exit(1)

VOICE = "en-US-AriaNeural"
RATE_WORD = "-10%"
RATE_SENTENCE = "-15%"

LESSON_CHUNKS = [
    (1, "a", "Hi, I'm"), (1, "b", "Nice to meet you."), (1, "c", "What's your name?"), (1, "d", "My name is"), (1, "e", "And you?"),
    (2, "a", "How are you?"), (2, "b", "I'm fine, thanks."), (2, "c", "I'm good."), (2, "d", "Not bad."), (2, "e", "And you?"),
    (3, "a", "Good morning."), (3, "b", "Good evening."), (3, "c", "Goodbye."), (3, "d", "See you later."), (3, "e", "Have a good day."),
    (4, "a", "Yes."), (4, "b", "No."), (4, "c", "Thank you."), (4, "d", "You're welcome."), (4, "e", "No problem."),
    (5, "a", "I want"), (5, "b", "I need"), (5, "c", "I don't want"), (5, "d", "Can I have"), (5, "e", "Please."),
    (6, "a", "How much?"), (6, "b", "How much is this?"), (6, "c", "That's expensive."), (6, "d", "That's okay."), (6, "e", "I'll take it."),
    (7, "a", "What do you do?"), (7, "b", "I work as"), (7, "c", "I'm a student."), (7, "d", "I have a business."), (7, "e", "Where do you work?"),
    (8, "a", "Where is"), (8, "b", "It's here."), (8, "c", "It's there."), (8, "d", "Go straight."), (8, "e", "Turn left."),
    (9, "a", "I understand."), (9, "b", "I don't understand."), (9, "c", "Can you repeat that?"), (9, "d", "Slowly, please."), (9, "e", "What does that mean?"),
    (10, "a", "Can you help me?"), (10, "b", "I need help."), (10, "c", "Excuse me."), (10, "d", "Sorry."), (10, "e", "No worries."),
]

LISTEN_EXERCISES = [
    (1, "Hi, I'm Ahmed. Nice to meet you."),
    (2, "How are you? I'm fine, thanks. And you?"),
    (3, "Good morning! Have a good day. Goodbye!"),
    (4, "Yes, please. Thank you. You're welcome."),
    (5, "I want water. Can I have water, please?"),
    (6, "How much is this? That's okay. I'll take it."),
    (7, "What do you do? I'm a student. I work as a teacher."),
    (8, "Where is the hospital? Go straight. Turn left."),
    (9, "I don't understand. Can you repeat that? Slowly, please."),
    (10, "Excuse me. Can you help me? I need help."),
]

PRACTICE_VOCABULARY = [
    ("mother", "Mother"), ("father", "Father"), ("brother", "Brother"), ("sister", "Sister"), ("rice", "Rice"),
    ("bread", "Bread"), ("red", "Red"), ("green", "Green"), ("yellow", "Yellow"), ("tomato", "Tomato"),
]

PRACTICE_WORD_FORMATION = [
    ("mother", "Mother"), ("teacher", "Teacher"), ("water", "Water"), ("school", "School"), ("apple", "Apple"),
    ("family", "Family"), ("friend", "Friend"), ("hospital", "Hospital"), ("green", "Green"), ("children", "Children"),
]

PRACTICE_SENTENCE_BUILDER = [
    ("i-am-from-somalia", "I am from Somalia."), ("she-goes-to-school", "She goes to school."),
    ("can-you-help-me-please", "Can you help me please?"), ("i-want-water", "I want water."),
    ("my-name-is-ahmed", "My name is Ahmed."), ("i-work-as-a-teacher", "I work as a teacher."),
    ("he-is-happy", "He is happy."), ("the-children-are-playing", "The children are playing."),
    ("i-love-you", "I love you."), ("where-are-you-from", "Where are you from?"),
]

WOTD = [
    ("hello", "Hello"), ("goodbye", "Goodbye"), ("thank-you", "Thank you"), ("please", "Please"),
    ("yes", "Yes"), ("no", "No"), ("sorry", "Sorry"), ("excuse-me", "Excuse me"),
    ("help", "Help"), ("water", "Water"), ("food", "Food"), ("money", "Money"),
    ("today", "Today"), ("tomorrow", "Tomorrow"), ("yesterday", "Yesterday"),
    ("morning", "Morning"), ("afternoon", "Afternoon"), ("evening", "Evening"), ("night", "Night"),
    ("how-much", "How much?"), ("where", "Where?"), ("when", "When?"), ("what", "What?"),
    ("who", "Who?"), ("why", "Why?"), ("how", "How?"),
    ("i-need", "I need"), ("i-want", "I want"), ("i-have", "I have"),
    ("i-understand", "I understand"), ("i-dont-understand", "I don't understand"),
    ("can-you-help", "Can you help?"), ("speak-slowly", "Speak slowly"), ("repeat-please", "Repeat, please"),
    ("good", "Good"), ("bad", "Bad"), ("big", "Big"), ("small", "Small"),
    ("hot", "Hot"), ("cold", "Cold"), ("new", "New"), ("old", "Old"),
    ("fast", "Fast"), ("slow", "Slow"), ("open", "Open"), ("closed", "Closed"),
    ("left", "Left"), ("right", "Right"), ("here", "Here"), ("there", "There"),
]

async def generate_audio(text, output_path, rate=RATE_WORD):
    if os.path.exists(output_path):
        return True
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        communicate = edge_tts.Communicate(text=text, voice=VOICE, rate=rate)
        await communicate.save(output_path)
        return True
    except Exception as e:
        print(f"    Error: {output_path}: {e}")
        return False

async def main():
    print("\nHADALING AUDIO GENERATOR")
    print(f"Voice: {VOICE} | Cost: $0 | Target: 140 files\n")

    total = 0

    print("LESSON CHUNKS (50 files)")
    for lid, cid, text in LESSON_CHUNKS:
        path = f"public/audio/lessons/lesson-{lid}/{lid}-{cid}.mp3"
        if await generate_audio(text, path, RATE_WORD):
            total += 1
            print(f"  + lesson-{lid}/{lid}-{cid}.mp3")

    print("\nLISTEN EXERCISES (10 files)")
    for lid, text in LISTEN_EXERCISES:
        path = f"public/audio/lessons/lesson-{lid}/listen-5.mp3"
        if await generate_audio(text, path, RATE_SENTENCE):
            total += 1
            print(f"  + lesson-{lid}/listen-5.mp3")

    print("\nPRACTICE: VOCABULARY (10 files)")
    for slug, text in PRACTICE_VOCABULARY:
        path = f"public/audio/practice/vocabulary/{slug}.mp3"
        if await generate_audio(text, path, RATE_WORD):
            total += 1
            print(f"  + vocabulary/{slug}.mp3")

    print("\nPRACTICE: WORD FORMATION (10 files)")
    for slug, text in PRACTICE_WORD_FORMATION:
        path = f"public/audio/practice/word-formation/{slug}.mp3"
        if await generate_audio(text, path, RATE_WORD):
            total += 1
            print(f"  + word-formation/{slug}.mp3")

    print("\nPRACTICE: SENTENCE BUILDER (10 files)")
    for slug, text in PRACTICE_SENTENCE_BUILDER:
        path = f"public/audio/practice/sentence-builder/{slug}.mp3"
        if await generate_audio(text, path, RATE_SENTENCE):
            total += 1
            print(f"  + sentence-builder/{slug}.mp3")

    print("\nWORD OF THE DAY (50 files)")
    for slug, text in WOTD:
        path = f"public/audio/wotd/{slug}.mp3"
        if await generate_audio(text, path, RATE_WORD):
            total += 1
            print(f"  + wotd/{slug}.mp3")

    print(f"\nDONE: {total}/140 files generated")

if __name__ == "__main__":
    asyncio.run(main())
