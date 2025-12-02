# 🎨 How to Add Your Bear Images

## Step 1: Create Assets Folder
```bash
mkdir src/assets
mkdir src/assets/bear
```

## Step 2: Add Your Image Files

Place your images in `src/assets/bear/`:
- `bear-idle.png` - Bear standing/waving
- `bear-walking.png` - Bear walking pose  
- `bear-pointing.png` - Bear pointing at something
- `bear-sleeping.png` - Bear sleeping/resting
- `bear-waving.png` - Bear celebrating (optional, can reuse idle)

And in `src/assets/`:
- `cottage.png` - The cozy house

## Step 3: Update App.tsx

Replace the import line:
```typescript
// OLD:
import LivingBear from "./components/LivingBear";

// NEW:
import LivingBearImages from "./components/LivingBearImages";
```

And update the component:
```typescript
// OLD:
<LivingBear 
  onBearClick={() => setShowChat(true)}
  speechText=""
/>

// NEW:
<LivingBearImages 
  onBearClick={() => setShowChat(true)}
  speechText=""
/>
```

## Step 4: Test!

The bear will now use your images instead of CSS shapes!

## Image Requirements

- **Format**: PNG with transparent background
- **Size**: ~200x200px per image (will be scaled)
- **Style**: Cartoon/illustrated style works best
- **Consistency**: All poses should match in art style

## Need Placeholder Images?

If you don't have images yet, you can:
1. Use free assets from [OpenGameArt.org](https://opengameart.org)
2. Generate AI images with DALL-E or Midjourney
3. Commission an artist on Fiverr

Let me know when you have the images and I'll help integrate them!
