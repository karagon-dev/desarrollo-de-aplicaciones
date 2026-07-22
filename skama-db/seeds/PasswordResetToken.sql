-- Used token (historical)
IF NOT EXISTS (SELECT 1 FROM PasswordResetToken WHERE TID_Id = 'b1c2d3e4-f5a6-7890-bcde-111111111111')
BEGIN
    INSERT INTO PasswordResetToken (
        TID_Id, TID_UserId, TC_TokenHash, TD_ExpiresAt, TD_UsedAt, TD_CreatedAt
    )
    VALUES (
        'b1c2d3e4-f5a6-7890-bcde-111111111111',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'EXPIRED_TOKEN_HASH_PLACEHOLDER',
        '2026-01-01T00:00:00',
        '2026-01-01T01:00:00',
        '2025-12-31T23:00:00'
    );
END

-- To test reset-password in development, use POST /api/auth/forgot-password
-- with customer@example.com; the API returns resetToken in the response.
