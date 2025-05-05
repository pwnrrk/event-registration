import { Field } from "@headlessui/react";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { User } from "../interfaces/user";
import { createUser } from "../services/userService";
import Spinner from "../components/Spinner";
import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<User>();
  const navigate = useNavigate();

  const { login } = useAuthContext();

  async function onSubmit(data: User) {
    try {
      setLoading(true);
      const user = await createUser(data);
      await login(user.phone);
      navigate("/status");
    } catch (err) {
      console.error(err);
      window.alert("Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-screen-lg mx-auto h-screen flex p-4 flex-col justify-center items-center">
      <form
        className="grid gap-4 max-w-screen-sm w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-medium">ลงทะเบียนเข้างาน</h1>
        <Field>
          <Label>ชื่อ</Label>
          <Input
            type="text"
            required
            {...register("firstName")}
            placeholder="John"
            className="w-full"
            autoFocus
          />
        </Field>
        <Field>
          <Label>นามสกุล</Label>
          <Input
            type="text"
            required
            {...register("lastName")}
            placeholder="Snow"
            className="w-full"
          />
        </Field>
        <Field>
          <Label>เบอร์โทรศัพท์</Label>
          <Input
            type="tel"
            required
            {...register("phone")}
            className="w-full"
            placeholder="0000000000"
          />
        </Field>
        <Button
          type="submit"
          className="flex justify-center items-center gap-4"
          disabled={loading}
        >
          ลงทะเบียน {loading && <Spinner className="!size-4" />}
        </Button>
      </form>
    </main>
  );
}
