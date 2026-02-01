# GK Data Organization Structure

## Folder Structure

```
backend/gk_data/
├── general_knowledge/
│   └── batch_7_raw_topics.txt (51 comprehensive topics)
│
├── science/
│   └── (Future: Physics, Chemistry, Biology topics)
│
├── life_skills/
│   └── (Future: Good Habits, Community Helpers, etc.)
│
├── stories/
│   └── moral_stories_english.txt (40 moral stories)
│
└── parsed_qa/
    ├── occupations.txt (25 Q&A pairs)
    ├── birds.txt (25 Q&A pairs)
    └── time.txt (25 Q&A pairs)
```

## File Categories

### Parsed Q&A Data (Ready for Integration)
- **Occupations**: 25 bilingual Q&A pairs about different professions
- **Birds**: 25 bilingual Q&A pairs about birds and their characteristics
- **Time**: 25 bilingual Q&A pairs about time concepts, clock, calendar

**Total**: 75 Q&A pairs ready for database integration

### Raw Topic Data
- **Batch 7 Raw Topics**: 51 comprehensive bilingual topics covering:
  - Science (19 topics)
  - Geography (10 topics)
  - Places (4 topics)
  - Transportation (3 topics)
  - Arts & Sports (2 topics)
  - Architecture (1 topic)
  - Communication (1 topic)
  - Time & Numbers (4 topics)
  - Foundational Learning (1 topic)
  - Civics & Educational (6 topics)

### Stories
- **Moral Stories (English)**: 40 short moral stories with lessons

## Next Steps

1. Parse remaining 48 topics from Batch 7 into Q&A format
2. Organize parsed Q&A files by subject category
3. Integrate all parsed Q&A data into MongoDB
4. Update game UI to include new topics
