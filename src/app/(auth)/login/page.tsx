import { Suspense, useEffect } from "react";
import LoginForm from "./_components/LoginForm";
import { usePathname } from "next/navigation";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default page;
