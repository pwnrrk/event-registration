import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
} from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Spinner from "../components/Spinner";
import { User } from "../interfaces/user";
import { createUser } from "../services/userService";
import { isFormErrors } from "../utils";

const ErrorMessages: Record<string, string> = {
  USER_EXISTS: "มีการลงทะเบียนด้วยเบอร์โทรนี้แล้ว",
  SESSION_FULL: "ขณะนี้ที่นั่งเต็มแล้ว",
};

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<User>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const navigate = useNavigate();

  async function onSubmit(data: User) {
    try {
      setLoading(true);
      const user = await createUser(data);
      navigate(`/status?u=${user._id}`);
    } catch (err) {
      console.error(err);
      if (isFormErrors(err)) {
        return setErrorMessage(err.errors[0].msg);
      }
      window.alert("We are sorry, unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  function closeErrorDialog() {
    setErrorMessage(undefined);
  }

  console.log(ErrorMessages[errorMessage!]);

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
      <Dialog open={Boolean(errorMessage)} onClose={closeErrorDialog}>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/10">
          <DialogPanel className="max-w-md w-full space-y-4 rounded-2xl shadow-sm dark:bg-gray-800 dark:border dark:border-gray-500 bg-white p-4">
            <DialogTitle className="font-bold">ขออภัย!</DialogTitle>
            <Description>{ErrorMessages[errorMessage!]}</Description>
            <div className="flex gap-4">
              <Button onClick={closeErrorDialog}>ตกลง</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </main>
  );
}
