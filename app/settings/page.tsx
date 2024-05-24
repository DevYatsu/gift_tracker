"use client";

import { User } from "@nextui-org/react";
import PageTemplate, {
  ContentLineBreak,
  ContentTitle,
  MainContent,
  SideBar,
  SideBarItem,
  SubTitle,
} from "@/components/Page";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ThemeSwitcher from "@/components/Theme/ThemeSwitcher";
import { useState } from "react";

type UserType = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const Components = {
  account: (user?: UserType) => (
    <AccountContent name={user?.name} email={user?.email} image={user?.image} />
  ),
  display: () => <DisplayContent />,
};

export default function Page() {
  const { data: session } = useSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session!!;
  const [name, setName] = useState("account");

  return (
    <>
      <PageTemplate title="Settings">
        <SideBar>
          <SideBarItem
            isActive={name === "account"}
            onClick={() => {
              console.log("here");

              setName("account");
            }}
          >
            Account
          </SideBarItem>
          <SideBarItem
            isActive={name === "display"}
            onClick={() => {
              console.log("here");
              setName("display");
            }}
          >
            Display
          </SideBarItem>
        </SideBar>

        <MainContent>
          {name === "account" ? Components.account(user) : Components.display()}
        </MainContent>
      </PageTemplate>
    </>
  );
}

function UserProfile({ name, email, image }: UserType) {
  return (
    <User
      name={name}
      description={email}
      avatarProps={{
        src: image === null ? undefined : image,
      }}
    />
  );
}

function AccountContent({ name, email, image }: UserType) {
  return (
    <>
      <ContentTitle title="Account" />

      <UserProfile name={name} email={email} image={image} />

      <ContentLineBreak />

      <SubTitle>More coming soon...</SubTitle>
    </>
  );
}

function DisplayContent() {
  return (
    <>
      <ContentTitle title="Display" subText="display settings in here..." />

      <ContentLineBreak />

      <SubTitle>Theme</SubTitle>

      <ThemeSwitcher />
    </>
  );
}