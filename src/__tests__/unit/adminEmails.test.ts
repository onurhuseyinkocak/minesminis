import { describe, it, expect } from 'vitest';
import { ADMIN_EMAILS, isAdminEmail } from '../../config/adminEmails';

describe('ADMIN_EMAILS', () => {
  it('should contain exactly 2 admin emails', () => {
    expect(ADMIN_EMAILS).toHaveLength(2);
  });

  it('should include mineteacheronline@gmail.com', () => {
    expect(ADMIN_EMAILS).toContain('mineteacheronline@gmail.com');
  });

  it('should include onurhuseyinkocak1@dream-mining.co', () => {
    expect(ADMIN_EMAILS).toContain('onurhuseyinkocak1@dream-mining.co');
  });

  it('should store all emails in lowercase', () => {
    ADMIN_EMAILS.forEach((email) => {
      expect(email).toBe(email.toLowerCase());
    });
  });
});

describe('isAdminEmail', () => {
  it('should return true for valid admin email (lowercase)', () => {
    expect(isAdminEmail('mineteacheronline@gmail.com')).toBe(true);
  });

  it('should return true for second admin email', () => {
    expect(isAdminEmail('onurhuseyinkocak1@dream-mining.co')).toBe(true);
  });

  it('should be case insensitive', () => {
    expect(isAdminEmail('MineTeacherOnline@gmail.com')).toBe(true);
    expect(isAdminEmail('MINETEACHERONLINE@GMAIL.COM')).toBe(true);
  });

  it('should trim whitespace', () => {
    expect(isAdminEmail('  mineteacheronline@gmail.com  ')).toBe(true);
  });

  it('should trim leading whitespace', () => {
    expect(isAdminEmail('   onurhuseyinkocak1@dream-mining.co')).toBe(true);
  });

  it('should return false for non-admin email', () => {
    expect(isAdminEmail('user@example.com')).toBe(false);
  });

  it('should return false for random email', () => {
    expect(isAdminEmail('random@random.com')).toBe(false);
  });

  it('should return false for null', () => {
    expect(isAdminEmail(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isAdminEmail('')).toBe(false);
  });

  it('should return false for whitespace only', () => {
    expect(isAdminEmail('   ')).toBe(false);
  });

  it('should return false for partial admin email', () => {
    expect(isAdminEmail('mineteacheronline')).toBe(false);
  });

  it('should return false for admin email with extra chars', () => {
    expect(isAdminEmail('xmineteacheronline@gmail.com')).toBe(false);
  });

  it('should return false for numeric input cast as string', () => {
    expect(isAdminEmail(123 as unknown as string)).toBe(false);
  });

  it('should handle mixed case with spaces', () => {
    expect(isAdminEmail('  OnurHuseyinKocak1@Dream-Mining.co  ')).toBe(true);
  });
});
