import {
  Card,
  CardBody,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Header } from "~/components";
import { requireUserId } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  if (!userId) {
    throw redirect("/login");
  }

  return json({});
}

export default function Index() {
  return (
    <>
      <Header />
      <Navbar
        position="static"
        isBordered
        isBlurred={false}
        classNames={{
          base: "bg-slate-900 border-slate-700",
          wrapper:
            "max-w-7xl snap-x overflow-x-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300",
        }}
      >
        <NavbarContent className="gap-8">
          {["Dashboard", "User"].map((nav) => (
            <NavbarItem key={nav}>
              <Link
                className="text-sm font-medium text-slate-100"
                color="foreground"
                href="/login"
              >
                {nav}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      </Navbar>
      <div className="max-w-7xl mx-auto py-10 px-6 min-h-[75rem]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} radius="sm" shadow="sm">
              <CardBody className="p-4 md:p-5 flex flex-row justify-between gap-x-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Total users
                  </p>
                  <div className="mt-1 flex items-center gap-x-2">
                    <h3 className="text-xl sm:text-2xl font-medium text-slate-800 dark:text-slate-200">
                      72,540
                    </h3>
                    <span className="flex items-center gap-x-1 text-green-600">
                      <svg
                        className="inline-block w-5 h-5 self-center"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                      <span className="inline-block text-lg">1.7%</span>
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex justify-center items-center w-[46px] h-[46px] bg-blue-600 text-white rounded-full dark:bg-blue-900 dark:text-blue-200">
                  <svg
                    className="flex-shrink-0 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
