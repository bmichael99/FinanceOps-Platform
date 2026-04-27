-- Enable Row Level Security
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;

--create chatbot_user
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'chatbot_user') THEN
    CREATE ROLE chatbot_user NOLOGIN;
  END IF;
END
$$;

-- Create Policies
CREATE POLICY user_chatbot_policy
  ON "Invoice"
  FOR SELECT
  TO chatbot_user
  USING (
    "userId" = current_setting('app.current_user_id')::int
    AND "verificationStatus" = 'VERIFIED'
  );