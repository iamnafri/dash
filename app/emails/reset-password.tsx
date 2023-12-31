import { Section, Text } from "@react-email/components";
import { Layout } from "~/emails/components/layout";

interface ResetPasswordTemplateProps {
  name: string;
  email: string;
}

export function ResetPasswordTemplate({
  name,
  email,
}: ResetPasswordTemplateProps) {
  return (
    <Layout preview="Remix dashboard reset your password">
      <Section>
        <Text className="text-black text-[14px] leading-[24px]">
          Hello {name},
        </Text>
        <Text className="text-black text-[14px] leading-[24px]">
          We’re confirming that you changed your Remix Dashboard account
          password for {email}.
        </Text>
      </Section>
    </Layout>
  );
}
