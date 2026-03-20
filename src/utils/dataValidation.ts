import { WORLDS } from '../data/curriculum';
import { ALL_SOUNDS } from '../data/phonics';

export function validateCurriculumData(): string[] {
  const errors: string[] = [];

  if (!WORLDS || WORLDS.length === 0) {
    errors.push('No worlds defined in curriculum');
  }

  WORLDS.forEach(world => {
    if (!world.lessons || world.lessons.length === 0) {
      errors.push(`World ${world.id} has no lessons`);
    }
    if (!world.vocabulary || world.vocabulary.length === 0) {
      errors.push(`World ${world.id} has no vocabulary`);
    }
    world.lessons.forEach(lesson => {
      if (!lesson.activities || lesson.activities.length === 0) {
        errors.push(`Lesson ${lesson.id} has no activities`);
      }
    });
  });

  if (ALL_SOUNDS.length !== 42) {
    errors.push(`Expected 42 phonics sounds, got ${ALL_SOUNDS.length}`);
  }

  return errors;
}
