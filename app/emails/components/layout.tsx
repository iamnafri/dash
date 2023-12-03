import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";
import { PropsWithChildren } from "react";

interface LayoutProps {
  preview: string;
}

export function Layout({ preview, children }: PropsWithChildren<LayoutProps>) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-logo.png"
                width="40"
                height="37"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
