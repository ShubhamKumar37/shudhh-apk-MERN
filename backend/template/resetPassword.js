const resetPasswordTemplate = (resetLink) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .header {
                text-align: center;
                margin-bottom: 20px;
            }

            .header img {
                max-width: 150px;
            }

            .message {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
                text-align: center;
            }

            .body {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
            }

            .cta {
                display: block;
                width: 100%;
                text-align: center;
                padding: 15px;
                background-color: #28a745;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                margin: 20px 0;
            }

            .support {
                font-size: 14px;
                color: #999999;
                text-align: center;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
            </div>
            <div class="message">Password Reset Request</div>
            <div class="body">
                <p>Dear User,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <a href="${resetLink}" class="cta">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
            <div class="support">If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:info@shudhhApk100.com">info@shudhhApk100.com</a>.</div>
        </div>
    </body>
    
    </html>`;
};

module.exports = { resetPasswordTemplate };
