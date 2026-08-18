namespace Skama.Api.Options;

public class EmailOptions
{
    public const string SectionName = "Email";

    public bool Enabled { get; set; }
    public string FromName { get; set; } = "SKAMA Jewelry";
    public string FromAddress { get; set; } = string.Empty;
    public string FrontendBaseUrl { get; set; } = "http://localhost:5173";
    public SmtpOptions Smtp { get; set; } = new();
}

public class SmtpOptions
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public bool UseStartTls { get; set; } = true;
    public string User { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
