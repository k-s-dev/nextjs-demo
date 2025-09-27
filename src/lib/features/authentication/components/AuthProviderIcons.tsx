import { FaGithub, FaGoogle } from "react-icons/fa6";

import "./Authentication.scss";

import { signIn } from "../config";

export default function AuthProviderIcons() {
  return (
    <>
      <section className="auth-provider-icon-row">
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
          className="auth-provider-icon-form"
        >
          <button className="auth-provider-icon-btn">
            <FaGithub className="auth-provider-icon" />
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
          className="auth-provider-icon-form"
        >
          <button className="auth-provider-icon-btn">
            <FaGoogle className="auth-provider-icon" />
          </button>
        </form>
      </section>
    </>
  );
}
