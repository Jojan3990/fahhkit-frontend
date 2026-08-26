// Nepali mobile numbers: 10 digits starting with 9 (matches the pattern already used on the contact form).
export const PHONE_PATTERN = '^9\\d{9}$'
export const PHONE_TITLE =
  'Enter a valid 10-digit mobile number starting with 9'

// Letters, spaces, apostrophes, and hyphens only. The hyphen is escaped —
// left unescaped inside this character class, some browsers silently treat
// the whole pattern attribute as a no-op instead of enforcing it.
export const NAME_PATTERN = "^[A-Za-z][A-Za-z '.\\-]{1,49}$"
export const NAME_TITLE = 'Enter a valid name using letters only'
