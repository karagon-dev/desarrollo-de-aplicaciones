IF NOT EXISTS (SELECT 1 FROM EmailNotification WHERE TID_Id = 'a7b8c9d0-e1f2-3456-0123-567890123456')
BEGIN
    INSERT INTO EmailNotification (
        TID_Id, TID_UserId, TID_OrderId, TC_Type,
        TC_RecipientEmail, TC_Subject, TC_Status, TD_SentAt, TD_CreatedAt
    )
    VALUES (
        'a7b8c9d0-e1f2-3456-0123-567890123456',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'b8c9d0e1-f2a3-4567-1234-678901234567',
        'ORDER_CONFIRMATION',
        'cliente@ejemplo.com',
        'Confirmación de pedido ORD-20260215-001',
        'SENT',
        '2026-02-15T10:35:00',
        '2026-02-15T10:31:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM EmailNotification WHERE TID_Id = 'a7b8c9d0-e1f2-3456-0123-567890123457')
BEGIN
    INSERT INTO EmailNotification (
        TID_Id, TID_UserId, TID_OrderId, TC_Type,
        TC_RecipientEmail, TC_Subject, TC_Status, TD_SentAt, TD_CreatedAt
    )
    VALUES (
        'a7b8c9d0-e1f2-3456-0123-567890123457',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'b8c9d0e1-f2a3-4567-1234-678901234568',
        'ORDER_STATUS_UPDATE',
        'cliente@ejemplo.com',
        'Tu pedido ORD-20260301-001 ha sido enviado',
        'FAILED',
        NULL,
        '2026-03-02T08:00:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM EmailNotification WHERE TID_Id = 'a7b8c9d0-e1f2-3456-0123-567890123458')
BEGIN
    INSERT INTO EmailNotification (
        TID_Id, TID_UserId, TID_OrderId, TC_Type,
        TC_RecipientEmail, TC_Subject, TC_Status, TD_SentAt, TD_CreatedAt
    )
    VALUES (
        'a7b8c9d0-e1f2-3456-0123-567890123458',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'b8c9d0e1-f2a3-4567-1234-678901234569',
        'ORDER_CONFIRMATION',
        'cliente@ejemplo.com',
        'Confirmación de pedido ORD-20260310-001',
        'PENDING',
        NULL,
        '2026-03-10T09:05:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM EmailNotification WHERE TID_Id = 'a7b8c9d0-e1f2-3456-0123-567890123459')
BEGIN
    INSERT INTO EmailNotification (
        TID_Id, TID_UserId, TID_OrderId, TC_Type,
        TC_RecipientEmail, TC_Subject, TC_Status, TD_SentAt, TD_CreatedAt
    )
    VALUES (
        'a7b8c9d0-e1f2-3456-0123-567890123459',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        NULL,
        'PASSWORD_RESET',
        'cliente@ejemplo.com',
        'Recuperación de contraseña SKAMA',
        'PENDING',
        NULL,
        '2026-06-01T12:00:00'
    );
END
