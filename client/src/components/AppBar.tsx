import { Dialog, DialogPanel, DialogTitle, Field } from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";

export default function AppBar() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<{
    username: string;
    password: string;
  }>();

  const { login, username, logout, isLoggedIn } = useAuthContext();
  const location = useLocation();

  async function onSubmit(data: { username: string; password: string }) {
    const success = await login(data.username, data.password);
    if (success) setOpen(false);
  }

  async function handleLogout() {
    if (window.confirm("ออกจากระบบ?")) logout();
  }

  if (location.pathname === "/register") return <></>;

  return (
    <nav className="py-4.5 px-4 bg-blue-600 text-white dark:bg-gray-800 dark:border-b border-b-gray-500">
      <div className="max-w-screen-lg mx-auto flex items-center gap-4">
        <Link to="/" className="text-xl lg:text-2xl font-bold">
          Event Registration
        </Link>
        <div className="flex-1"></div>
        {isLoggedIn ? (
          <>
            {username}{" "}
            <Button variant="light" onClick={handleLogout}>
              ออกจากระบบ
            </Button>
          </>
        ) : (
          <Button variant="light" onClick={() => setOpen(true)}>
            เข้าสู่ระบบผู้ดูแล
          </Button>
        )}
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/10 dark:bg-black/30">
          <DialogPanel className="max-w-md w-full space-y-4 rounded-2xl shadow-sm dark:bg-gray-800 dark:border dark:border-gray-500 bg-white p-4">
            <DialogTitle className="font-bold">เข้าสู่ระบบผู้ดูแล</DialogTitle>
            <form
              id="login"
              className="grid gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Field>
                <Label>ชื่อผู้ใช้</Label>
                <Input
                  className="w-full"
                  placeholder="admin"
                  {...register("username")}
                  required
                />
              </Field>
              <Field>
                <Label>รหัสผ่าน</Label>
                <Input
                  className="w-full"
                  {...register("password")}
                  type="password"
                  placeholder="admin1234"
                  required
                />
              </Field>
              <Button type="submit">เข้าสู่ระบบ</Button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </nav>
  );
}
