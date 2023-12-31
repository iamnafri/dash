import { Button, Section, Text } from "@react-email/components";
import { Layout } from "~/emails/components/layout";

interface ForgotPasswordTemplateProps {
  name: string;
  email: string;
  resetPasswordLink: string;
}

export function ForgotPasswordTemplate({
  name,
  email,
  resetPasswordLink,
}: ForgotPasswordTemplateProps) {
  return (
    <Layout preview="Remix dashboard reset your password">
      <Section>
        <Text className="text-black text-[14px] leading-[24px]">
          Hello {name},
        </Text>
        <Text className="text-black text-[14px] leading-[24px]">
          We've received a request to set a new password for this Remix
          Dashboard account: {email}.
        </Text>
        <Section className="mt-[32px] mb-[32px]">
          <Button
            className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-[20px] py-[12px]"
            href={resetPasswordLink}
          >
            Reset password
          </Button>
        </Section>
        <Text className="text-black text-[14px] leading-[24px]">
          If you didn't request this, you can safely ignore this email.
        </Text>
      </Section>
    </Layout>
  );
}
