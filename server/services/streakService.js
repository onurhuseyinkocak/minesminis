/**
 * Daily streak tracking service.
 * Upserts daily_streaks row and increments streak_days when first activity of the day.
 */

export async function updateDailyStreak(userId, supabaseAdmin) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    // Check if there's already a streak entry for today
    const { data: existing } = await supabaseAdmin
      .from('daily_streaks')
      .select('id, activities_completed')
      .eq('user_id', userId)
      .eq('streak_date', today)
      .maybeSingle();

    if (existing) {
      // Already active today — just bump the counter
      await supabaseAdmin
        .from('daily_streaks')
        .update({ activities_completed: existing.activities_completed + 1 })
        .eq('id', existing.id);
      return { streak_updated: false };
    }

    // First activity today — insert new row
    await supabaseAdmin
      .from('daily_streaks')
      .insert({
        user_id: userId,
        streak_date: today,
        activities_completed: 1,
        points_earned: 0,
      });

    // Increment streak_days in users and profiles
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('streak_days')
      .eq('id', userId)
      .maybeSingle();

    const newStreak = (user?.streak_days || 0) + 1;

    await supabaseAdmin
      .from('users')
      .update({ streak_days: newStreak })
      .eq('id', userId);

    await supabaseAdmin
      .from('profiles')
      .update({ streak_days: newStreak })
      .eq('id', userId);

    return { streak_updated: true, new_streak: newStreak };
  } catch (err) {
    console.error('[Streak] Error updating daily streak:', err.message);
    return { streak_updated: false, error: err.message };
  }
}
