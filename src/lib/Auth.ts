import axios from "axios";
import { toast } from "react-hot-toast";

interface ICreateUser {
  name: string;
  username: string;
  password: string;
}

interface ILoginUser {
  username: string;
  password: string;
}

const notify = (message: string, type: string) => {
  if (!message) return;

  console.log("message: ", message);
  if (type === "s") {
    toast.success(message, {
      position: "bottom-center",
      duration: 4000,
      className: "select-none",
    });
  } else {
    toast.error(message, {
      position: "bottom-center",
      duration: 4000,
      className: "select-none",
    });
  }
};

export async function createUser(values: ICreateUser): Promise<any> {
  try {
    const { data } = await axios.post<ICreateUser>(
      "http://localhost:3000/api/auth/register",
      values,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    localStorage.setItem("accesstoken", data?.token);
    notify("Welcome", "s");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error);
      if (error?.response?.data?.message === "data_incomplete") {
        notify("Provide enough Information", "e");
        return error.message;
      }
      notify(error?.response?.data?.message, "e");
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      notify("An unexpected error occurred", "e");
      return "An unexpected error occurred";
    }
  }
}

export async function loginUser(values: ILoginUser): Promise<any> {
  try {
    const { data } = await axios.post<ILoginUser>(
      "http://localhost:3000/api/auth/login",
      values,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    localStorage.setItem("accesstoken", data?.token);
    notify("Welcome", "s");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error);
      if (error?.response?.data?.message === "data_incomplete") {
        notify("Provide enough Information", "e");
        return error.message;
      }
      notify(error?.response?.data?.message, "e");
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      notify("An unexpected error occurred", "e");
      return "An unexpected error occurred";
    }
  }
}
