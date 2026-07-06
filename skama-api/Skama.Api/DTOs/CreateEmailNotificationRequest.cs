using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class CreateEmailNotificationRequest
{
    [Required]
    public Guid UserId { get; set; }

    public Guid? OrderId { get; set; }

    [Required]
    [RegularExpression("^(ORDER_CONFIRMATION|ORDER_STATUS_UPDATE|PASSWORD_RESET)$",
        ErrorMessage = "El tipo debe ser ORDER_CONFIRMATION, ORDER_STATUS_UPDATE o PASSWORD_RESET.")]
    public string Type { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string RecipientEmail { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Subject { get; set; } = string.Empty;
}
