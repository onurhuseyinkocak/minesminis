/**
 * Fallback data when Supabase returns empty or fails.
 * Ensures UI always shows content even without database.
 */

export const fallbackVideos = [
  { id: '1', youtube_id: 'XqZsoesa55w', title: 'Baby Shark Dance', description: 'The most popular kids song ever!', thumbnail: 'https://img.youtube.com/vi/XqZsoesa55w/mqdefault.jpg', duration: '2:16', category: 'song', grade: '2nd Grade', isPopular: true },
  { id: '2', youtube_id: 'e0-2XxgHIXk', title: 'Phonics Song with TWO Words', description: 'A-Apple, B-Ball, learn letters!', thumbnail: 'https://img.youtube.com/vi/e0-2XxgHIXk/mqdefault.jpg', duration: '4:06', category: 'lesson', grade: '2nd Grade', isPopular: true },
  { id: '3', youtube_id: 'BD75RYqrSEI', title: 'Wheels On The Bus', description: 'Classic nursery rhyme song!', thumbnail: 'https://img.youtube.com/vi/BD75RYqrSEI/mqdefault.jpg', duration: '2:30', category: 'song', grade: '2nd Grade', isPopular: false },
  { id: '4', youtube_id: 'WHLZsCz6Yx4', title: 'Five Little Ducks Song', description: 'Count ducks with this fun song!', thumbnail: 'https://img.youtube.com/vi/WHLZsCz6Yx4/mqdefault.jpg', duration: '2:45', category: 'song', grade: '2nd Grade', isPopular: false },
  { id: '5', youtube_id: 'loINl3Ln6Ck', title: 'The Shapes Song', description: 'Circle, square, triangle and more!', thumbnail: 'https://img.youtube.com/vi/loINl3Ln6Ck/mqdefault.jpg', duration: '2:08', category: 'lesson', grade: '3rd Grade', isPopular: false },
  { id: '6', youtube_id: 'L0mL4oZycnU', title: 'Fruits Song', description: 'Apple, banana, orange, grape!', thumbnail: 'https://img.youtube.com/vi/L0mL4oZycnU/mqdefault.jpg', duration: '2:55', category: 'song' as const, grade: '4th Grade', isPopular: false },
  { id: '7', youtube_id: 'TfkIAyJLvyE', title: 'Twinkle Twinkle Little Star', description: 'Beautiful lullaby!', thumbnail: 'https://img.youtube.com/vi/TfkIAyJLvyE/mqdefault.jpg', duration: '2:00', category: 'story' as const, grade: '4th Grade', isPopular: false },
  { id: '8', youtube_id: 'VuNlGfIfigs', title: 'Old MacDonald Had a Farm', description: 'E-I-E-I-O! Animal sounds!', thumbnail: 'https://img.youtube.com/vi/VuNlGfIfigs/mqdefault.jpg', duration: '3:05', category: 'song' as const, grade: '3rd Grade', isPopular: false },
];

export const fallbackGames = [
  { id: 'p1', title: 'Alphabet Fun', url: 'https://wordwall.net/tr/embed/a27e67c8682a4be9a3503f499c937fcc?themeId=21&templateId=69&fontStackId=0', category: 'primary', thumbnail_url: 'https://screens.cdn.wordwall.net/200/a27e67c8682a4be9a3503f499c937fcc_21', description: 'Maze Chase' },
  { id: 'p2', title: 'First Words', url: 'https://wordwall.net/tr/embed/0ec582f6b6a04f26ad15409b73f7e580?themeId=27&templateId=3&fontStackId=0', category: 'primary', thumbnail_url: 'https://screens.cdn.wordwall.net/200/0ec582f6b6a04f26ad15409b73f7e580_27', description: 'Match Up' },
  { id: '1', title: '2nd Grade Revision', url: 'https://wordwall.net/tr/embed/a27e67c8682a4be9a3503f499c937fcc?themeId=21&templateId=69&fontStackId=0', category: 'grade2', thumbnail_url: 'https://screens.cdn.wordwall.net/200/a27e67c8682a4be9a3503f499c937fcc_21', description: 'Maze Chase' },
  { id: '2', title: 'Animals Quiz', url: 'https://wordwall.net/tr/embed/0ec582f6b6a04f26ad15409b73f7e580?themeId=27&templateId=3&fontStackId=0', category: 'grade2', thumbnail_url: 'https://screens.cdn.wordwall.net/200/0ec582f6b6a04f26ad15409b73f7e580_27', description: 'Match Up' },
  { id: '3', title: '2nd Grade Quiz', url: 'https://wordwall.net/tr/embed/7069b22dfc384f9ba0e1c7de9f1fb835?themeId=44&templateId=5&fontStackId=0', category: 'grade2', thumbnail_url: 'https://screens.cdn.wordwall.net/200/7069b22dfc384f9ba0e1c7de9f1fb835_44', description: 'Quiz' },
  { id: '4', title: 'Simple Past Questions', url: 'https://wordwall.net/tr/embed/03dd454cab56495a82a08d631b357b9b?themeId=22&templateId=30&fontStackId=15', category: 'grade2', thumbnail_url: 'https://screens.cdn.wordwall.net/200/03dd454cab56495a82a08d631b357b9b_22', description: 'Open Box' },
  { id: '5', title: 'Action Words', url: 'https://wordwall.net/tr/embed/896a359f89894d30906243d8619163e1?themeId=43&templateId=8&fontStackId=0', category: 'grade2', thumbnail_url: 'https://screens.cdn.wordwall.net/200/896a359f89894d30906243d8619163e1_43', description: 'Whack-a-Mole' },
  { id: '6', title: '3rd Grade English', url: 'https://wordwall.net/tr/embed/896a359f89894d30906243d8619163e1?themeId=22&templateId=5&fontStackId=0', category: 'grade3', thumbnail_url: 'https://screens.cdn.wordwall.net/200/7069b22dfc384f9ba0e1c7de9f1fb835_44', description: 'Quiz' },
  { id: '7', title: '4th Grade Vocabulary', url: 'https://wordwall.net/tr/embed/0ec582f6b6a04f26ad15409b73f7e580?themeId=27&templateId=3&fontStackId=0', category: 'grade4', thumbnail_url: 'https://screens.cdn.wordwall.net/200/0ec582f6b6a04f26ad15409b73f7e580_27', description: 'Match Up' },
];

export const fallbackWorksheets = [
  { id: '1', title: 'Animals Vocabulary', description: 'Learn animal names with pictures', category: 'Vocabulary', grade: '2', thumbnail_url: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=300&h=200&fit=crop', external_url: 'https://www.englishwsheets.com/animals.html', source: 'MinesMinis' },
  { id: '2', title: 'Colors & Shapes', description: 'Match colors and shapes in English', category: 'Vocabulary', grade: '2', thumbnail_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=200&fit=crop', external_url: 'https://learnenglishkids.britishcouncil.org/print-make/worksheets/colours', source: 'MinesMinis' },
  { id: '3', title: 'Food & Drinks', description: 'Vocabulary about food items', category: 'Vocabulary', grade: '2', thumbnail_url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=200&fit=crop', external_url: 'https://www.englishwsheets.com/food-drinks.html', source: 'MinesMinis' },
  { id: '4', title: 'Body Parts', description: 'Learn body parts vocabulary', category: 'Vocabulary', grade: '2', thumbnail_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop', external_url: 'https://games4esl.com/esl-worksheets/body-parts-worksheets/', source: 'MinesMinis' },
  { id: '5', title: 'Simple Sentences', description: 'Build basic English sentences', category: 'Grammar', grade: '2', thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', external_url: 'https://www.englishwsheets.com/grammar.html', source: 'MinesMinis' },
  { id: '6', title: 'Short Stories', description: 'Easy reading comprehension', category: 'Reading', grade: '2', thumbnail_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop', external_url: 'https://learnenglishkids.britishcouncil.org/short-stories', source: 'MinesMinis' },
];
