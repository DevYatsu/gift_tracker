import { Divider } from "@nextui-org/react";

export default function SettingsPage() {
  return (
    <div className="max-w-md">
      <div className="space-y-1">
        <h4 className="text-medium font-medium">Gift Tracker - Settings</h4>
        <p className="text-small text-default-400">
          Choose your preference and manage your account.
        </p>
      </div>
      <Divider className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-small">
        <div>Blog</div>
        <Divider orientation="vertical" />
        <div>Docs</div>
        <Divider orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  );
}
