-- Enable Row Level Security
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY user_chatbot_policy
  ON "Invoice"
  FOR SELECT
  TO chatbot_user
  USING (
    "userId" = current_setting('app.current_user_id')::int
    AND "verificationStatus" = 'VERIFIED'
  );