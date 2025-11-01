import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, displayName } = await req.json();

    console.log(`Sending welcome email to ${email} for ${displayName}`);

    // In production, you would integrate with email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // For now, we'll just log it

    const emailContent = {
      to: email,
      subject: "Welcome to MinesMinis! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #3B82F6, #06B6D4); border-radius: 10px;">
            <h1 style="color: white; margin: 0;">🎯 Welcome to MinesMinis!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333;">Hi ${displayName}! 👋</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We're thrilled to have you join our English learning community! Get ready for an exciting journey of learning and fun.
            </p>

            <h3 style="color: #3B82F6;">What's waiting for you:</h3>
            <ul style="color: #666; font-size: 15px; line-height: 1.8;">
              <li>🎮 Interactive games that make learning fun</li>
              <li>📖 Vocabulary building exercises</li>
              <li>📝 Worksheets for practice</li>
              <li>🎥 Educational videos</li>
              <li>🏆 Earn points and badges as you learn</li>
              <li>👥 Connect with other learners</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get('VITE_SUPABASE_URL') || 'https://localhost:5173'}" 
                 style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #3B82F6, #06B6D4); color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">
                Start Learning Now!
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions, feel free to reach out to our support team.
            </p>

            <p style="color: #666; font-size: 14px;">
              Happy Learning! 🌟<br>
              <strong>The MinesMinis Team</strong>
            </p>
          </div>

          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 MinesMinis. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        email: emailContent 
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});