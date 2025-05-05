import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Spinner from "../components/Spinner";
import Table from "../components/Table";
import TableCell from "../components/TableCell";
import TableHead from "../components/TableHead";
import { useAuthContext } from "../contexts/AuthContext";
import { Query } from "../interfaces/query";
import { User } from "../interfaces/user";
import { getUsers } from "../services/userService";
import { useSeatContext } from "../contexts/SeatContext";
import { Dialog, DialogPanel, DialogTitle, Field } from "@headlessui/react";
import Label from "../components/Label";
import { assignSeat, getSeats } from "../services/seatService";

function PhoneSearchForm() {
  const [isNotFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<User>();

  const { login } = useAuthContext();

  async function onSubmit(data: User) {
    setLoading(true);
    const success = await login(data.phone);
    setLoading(false);
    if (!success) return setNotFound(true);
  }

  return (
    <>
      <main className="p-4 h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="max-w-screen-md w-full mx-auto">
          <div className="grid w-full gap-4">
            <h2 className="text-2xl">ติดตามสถานะการลงทะเบียน</h2>
            <form
              className="lg:flex grid gap-4 items-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                placeholder="ใส่เบอร์โทรศัพท์ที่ลงเบียนไว้"
                required
                {...register("phone")}
                className="w-full"
              />
              <Button
                type="submit"
                className="flex-none flex items-center justify-center gap-4"
                disabled={loading}
              >
                ตรวจสอบ
                {loading && <Spinner className="!size-4" />}
              </Button>
            </form>
            {isNotFound && (
              <span className="text-red-500">
                ไม่พบผู้เข้าร่วมด้วยเบอร์โทรนี้
              </span>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

interface SelectSeatForm {
  seatId: string;
  userId: string;
}

function SelectSeatForUser({
  user,
  onClose,
}: {
  user?: User;
  onClose(): void;
}) {
  const { register, handleSubmit } = useForm<SelectSeatForm>({
    defaultValues: { userId: user?._id },
  });

  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ sort: "created:asc" }),
  });

  const seatQuery = useQuery({
    queryKey: ["seats"],
    queryFn: () => getSeats({ sort: "seatNo:asc" }),
  });

  async function onSubmit(data: SelectSeatForm) {
    try {
      await assignSeat(data.seatId, data.userId);
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog open={user !== undefined} onClose={onClose}>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/10">
        <DialogPanel className="max-w-lg w-full space-y-4 border border-gray-300 rounded-2xl shadow-2xl bg-white p-4">
          <DialogTitle className="font-bold">เลือกที่นั่ง</DialogTitle>
          <form
            id="seat-select"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Field>
              <Label>ผู้เข้าร่วม</Label>
              <Select className="w-full" {...register("userId")} required>
                {userQuery.data?.map((u) => (
                  <option
                    key={u._id}
                    value={u._id}
                    disabled={u.seat !== undefined && u.seat !== null}
                  >
                    {u?.firstName} {u?.lastName} ({u?.phone})
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>ที่นั่ง</Label>
              <Select className="w-full" {...register("seatId")} required>
                {seatQuery.data?.map((seat) => (
                  <option
                    key={seat._id}
                    value={seat._id}
                    disabled={seat.user !== undefined && seat.user !== null}
                  >
                    {seat.seatNo} {seat.user?.firstName}
                  </option>
                ))}
              </Select>
            </Field>
          </form>
          <div className="flex gap-4">
            <Button type="submit" form="seat-select">
              ยืนยัน
            </Button>
            <Button variant="alternative" onClick={onClose}>
              ยกเลิก
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default function Status() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthContext();
  const seatInfo = useSeatContext();
  const [selectedUser, setSelectedUser] = useState<User>();

  const { register, handleSubmit } = useForm<Query>();

  const queries = useMemo(() => {
    const options: Record<string, string> = {};
    if (searchParams.has("search"))
      options.search = searchParams.get("search")!;
    return options;
  }, [searchParams]);

  const users = useQuery<User[] | null>({
    queryKey: ["users", queries],
    queryFn: () => getUsers(queries),
  });

  function handleQuery(data: Query) {
    setSearchParams((prev) => {
      const newState = new URLSearchParams(prev);

      if (data.search) newState.set("search", data.search);
      else newState.delete("search");

      return newState;
    });
  }

  function handleCloseSelectSeatDialog() {
    setSelectedUser(undefined);
    users.refetch();
    seatInfo.refetch();
  }

  return (
    <>
      <nav className="py-6 mb-4 px-4 bg-blue-600 text-white">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-2xl font-bold">Event Registration</h1>
        </div>
      </nav>
      {user && (
        <main className="max-w-screen-lg mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-4 px-4">
            <div className="shadow border border-gray-300 rounded-2xl p-4">
              <div className="text-xl text-gray-500 font-semibold">
                ผู้เข้าร่วม
              </div>
              <div className="text-4xl">20</div>
            </div>
            <div className="shadow border border-gray-300 rounded-2xl p-4">
              <div className="text-xl text-gray-500 font-semibold">
                จำนวนที่นั่ง
              </div>
              <div className="text-4xl">
                {seatInfo.available}/{seatInfo.total}
              </div>
            </div>
          </div>
          <div className="px-4 font-medium">สถานะการลงทะเบียน</div>
          <dl className="p-4 max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
            <div className="flex flex-col pb-3">
              <dt className="mb-1 text-gray-500  dark:text-gray-400">ชื่อ</dt>
              <dd className="font-semibold">
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div className="flex flex-col pt-3">
              <dt className="mb-1 text-gray-500  dark:text-gray-400">
                เบอร์โทร
              </dt>
              <dd className="font-semibold">{user.phone}</dd>
            </div>
            <div className="flex flex-col pt-3">
              <dt className="mb-1 text-gray-500  dark:text-gray-400">
                หมายเลขที่นั่ง
              </dt>
              <dd className="font-semibold">
                {user.seat?.seatNo || "กรุณารอผู้ดูแลเลือกที่นั่ง"}
              </dd>
            </div>
          </dl>
          <hr className="m-4 mb-6 border-gray-300" />
          <h3 className="text-lg mb-4 px-4">ผู้เข้าร่วมทั้งหมด</h3>
          <form onSubmit={handleSubmit(handleQuery)} className="flex mb-4 px-4">
            <Input
              placeholder="ค้นหา"
              className="w-96"
              {...register("search")}
            />
            <input type="submit" className="hidden" />
          </form>
          <Table>
            <TableHead>
              <tr>
                <TableCell head>ชื่อ</TableCell>
                <TableCell head>เบอร์โทร</TableCell>
                <TableCell head>หมายเลขที่นั่ง</TableCell>
              </tr>
            </TableHead>
            <tbody>
              {users.data?.map((user, index) => (
                <tr key={index}>
                  <TableCell>
                    <span className="font-medium text-black">
                      {user.firstName} {user.lastName}
                    </span>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.seat ? (
                      user.seat.seatNo
                    ) : (
                      <button
                        className="underline text-black cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        เลือกที่นั่ง
                      </button>
                    )}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="flex justify-end items-center gap-4 pb-4">
            <div>จำนวนต่อหน้า</div>
            <Select className="w-20 py-2">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
            <div className="flex">
              <Button
                variant="light"
                className="flex justify-center items-center text-xs rounded-r-none"
              >
                ก่อนหน้า
              </Button>
              <Button variant="light" className="text-xs rounded-l-none">
                ถัดไป
              </Button>
            </div>
          </div>
        </main>
      )}
      {!user && <PhoneSearchForm />}
      {selectedUser && (
        <SelectSeatForUser
          user={selectedUser}
          onClose={handleCloseSelectSeatDialog}
        />
      )}
    </>
  );
}
